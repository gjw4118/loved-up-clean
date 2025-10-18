// Speech-to-Text Edge Function
// Uses OpenAI Whisper API for transcription

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Parse the multipart form data
    const formData = await req.formData();
    const audioFile = formData.get('audio');
    const language = formData.get('language') || 'en';
    const model = formData.get('model') || 'whisper-1';

    if (!audioFile || !(audioFile instanceof File)) {
      throw new Error('Audio file is required');
    }

    console.log('STT Request:', {
      fileName: audioFile.name,
      fileSize: audioFile.size,
      fileType: audioFile.type,
      language,
    });

    // Create form data for OpenAI Whisper API
    const whisperFormData = new FormData();
    whisperFormData.append('file', audioFile);
    whisperFormData.append('model', model);
    whisperFormData.append('language', language);
    whisperFormData.append('response_format', 'json');

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: whisperFormData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Whisper API error:', error);
      throw new Error(`Whisper API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('STT Success:', {
      textLength: data.text?.length || 0,
      text: data.text?.substring(0, 50) + '...',
    });

    return new Response(
      JSON.stringify({
        text: data.text || '',
        confidence: 1.0, // Whisper doesn't provide confidence scores
        language: language,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Speech-to-text error:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to transcribe audio',
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

