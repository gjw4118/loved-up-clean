// Text-to-Speech Edge Function
// Supports both ElevenLabs (premium) and OpenAI TTS (fallback)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TTSRequest {
  text: string;
  voice: string;
  provider: 'openai' | 'elevenlabs';
  model?: string;
  speed?: number;
  response_format?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      text,
      voice = 'nova',
      provider = 'openai',
      model = 'tts-1',
      speed = 1.0,
      response_format = 'mp3',
    }: TTSRequest = await req.json();

    if (!text || text.trim().length === 0) {
      throw new Error('Text is required');
    }

    console.log('TTS Request:', {
      provider,
      voice,
      textLength: text.length,
      model,
    });

    let audioBuffer: ArrayBuffer;

    if (provider === 'elevenlabs') {
      // Try ElevenLabs first (premium quality)
      const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
      
      if (!elevenlabsApiKey) {
        console.log('ElevenLabs API key not found, falling back to OpenAI');
        // Fall back to OpenAI
        audioBuffer = await generateOpenAITTS(text, voice, model, speed);
      } else {
        try {
          audioBuffer = await generateElevenLabsTTS(text, voice, elevenlabsApiKey);
        } catch (error) {
          console.log('ElevenLabs failed, falling back to OpenAI:', error.message);
          audioBuffer = await generateOpenAITTS(text, voice, model, speed);
        }
      }
    } else {
      // Use OpenAI TTS
      audioBuffer = await generateOpenAITTS(text, voice, model, speed);
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upload to Supabase Storage
    const fileName = `tts_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
    const filePath = `tts/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio')
      .upload(filePath, audioBuffer, {
        contentType: 'audio/mpeg',
        cacheControl: '3600',
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('audio')
      .getPublicUrl(filePath);

    console.log('TTS Success: Audio uploaded to', publicUrl);

    return new Response(
      JSON.stringify({
        audioUri: publicUrl,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Text-to-speech error:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to generate speech',
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function generateOpenAITTS(
  text: string,
  voice: string,
  model: string,
  speed: number
): Promise<ArrayBuffer> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: text,
      voice: voice.toLowerCase(),
      speed: Math.max(0.25, Math.min(4.0, speed)),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI TTS error: ${error}`);
  }

  return await response.arrayBuffer();
}

async function generateElevenLabsTTS(
  text: string,
  voiceName: string,
  apiKey: string
): Promise<ArrayBuffer> {
  // Map voice names to ElevenLabs voice IDs
  const voiceIds: Record<string, string> = {
    'Rachel': '21m00Tcm4TlvDq8ikWAM',
    'Domi': 'AZnzlk1XvdvUeBnXmlld',
    'Bella': 'EXAVITQu4vr4xnSDxMaL',
    'Antoni': 'ErXwobaYiN019PkySvjV',
    'Elli': 'MF3mGyEYCl7XYWbV9V6O',
    'Josh': 'TxGEqnHWrfWFTfGW9XjX',
    'Arnold': 'VR6AewLTigWG4xSOukaG',
    'Adam': 'pNInz6obpgDQGcFmaJgB',
    'Sam': 'yoZ06aMxZJJ28mfd3POQ',
    'Nicole': 'piTKgcLEGmPE4e6mEKli',
    'Glinda': 'z9fAnlkpzviPz146aGWa',
    'Mimi': 'zrHiDhphv9ZnVXBqCLjz',
  };

  const voiceId = voiceIds[voiceName] || voiceIds['Rachel'];

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs TTS error: ${error}`);
  }

  return await response.arrayBuffer();
}

