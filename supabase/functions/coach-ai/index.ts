// GoDeeper Coach AI Edge Function
// Provides AI-powered relationship coaching using GPT-4

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CoachRequest {
  message: string;
  mode: 'conversation' | 'guidance';
  conversationHistory?: Array<{
    role: 'user' | 'coach';
    content: string;
  }>;
  relationshipContext?: {
    partnerName?: string;
    relationshipDuration?: string;
    currentChallenges?: string[];
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, mode, conversationHistory = [], relationshipContext = {} }: CoachRequest = await req.json();

    if (!message || message.trim().length === 0) {
      throw new Error('Message is required');
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build system prompt based on mode
    const systemPrompt = mode === 'conversation'
      ? `You are a compassionate relationship coach for the GoDeeper app. You help people practice and improve their relationship conversations. Your role is to:

- Listen actively and ask thoughtful follow-up questions
- Help users explore their feelings and communication patterns
- Provide gentle guidance on healthy communication
- Encourage self-reflection and emotional awareness
- Suggest conversation starters and phrases they could use
- Be warm, empathetic, and non-judgmental

Keep responses conversational, concise (2-4 sentences), and focused on the user's immediate needs. Adapt your tone to match the user's emotional state.`
      : `You are an expert relationship coach for the GoDeeper app. You provide evidence-based guidance on relationships, communication, and emotional intimacy. Your role is to:

- Offer practical advice based on relationship psychology
- Explain concepts like attachment styles, love languages, and emotional needs
- Help users understand relationship dynamics
- Provide actionable strategies for improving communication
- Share insights on building emotional intimacy
- Be supportive, wise, and grounded in research

Keep responses clear, helpful (3-5 sentences), and actionable. Draw on relationship research when relevant but keep it accessible.`;

    // Build conversation context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Add relationship context if provided
    if (relationshipContext.partnerName || relationshipContext.currentChallenges) {
      const contextNote = `Context: ${relationshipContext.partnerName ? `Partner: ${relationshipContext.partnerName}. ` : ''}${relationshipContext.currentChallenges ? `Current focus areas: ${relationshipContext.currentChallenges.join(', ')}` : ''}`;
      messages.splice(1, 0, { role: 'system', content: contextNote });
    }

    // Call OpenAI GPT-4 API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 300,
        top_p: 1,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const coachResponse = data.choices[0]?.message?.content;

    if (!coachResponse) {
      throw new Error('No response from AI');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          response: coachResponse,
          timestamp: new Date().toISOString(),
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Coach AI error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to process coaching request',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

