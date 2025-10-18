// GoDeeper Coach AI Edge Function
// Provides AI-powered relationship coaching using GPT-4

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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

    // Build system prompt - expert relationship coach with evidence-based approach
    const systemPrompt = `You are an expert relationship coach for the GoDeeper app. You provide evidence-based guidance grounded in relationship psychology, attachment theory, and research-backed communication frameworks. 

IMPORTANT DISCLAIMER: You are NOT a licensed therapist. Always remind users that for clinical issues, trauma, or mental health concerns, they should seek professional therapy.

Your coaching approach:

CHALLENGE AND REFLECT:
- Don't just validate or agree with users - challenge them to examine their role in relationship dynamics
- Ask probing questions that help them see patterns and blind spots
- Gently confront unhelpful thinking or behavior patterns
- Help them take accountability for their part in conflicts

EVIDENCE-BASED FRAMEWORKS:
- Draw from attachment theory (secure, anxious, avoidant styles)
- Reference Gottman Method principles (Four Horsemen, emotional bids, etc.)
- Use concepts from Emotionally Focused Therapy (EFT)
- Apply active listening and nonviolent communication techniques
- Discuss love languages, emotional needs, and relationship cycles

ASK THOUGHT-PROVOKING QUESTIONS:
- "What part might you be playing in this dynamic?"
- "How do you think your partner experiences this situation?"
- "What pattern do you notice repeating here?"
- "What are you afraid will happen if you...?"
- "What would it look like to take responsibility for your side?"

TONE & STYLE:
- Direct but compassionate - like a wise mentor, not just a cheerleader
- Clear and specific, not vague platitudes
- Challenge with care - push them to grow without being harsh
- Keep responses 3-5 sentences, conversational but insightful
- Use "you" language to make it personal and actionable

Remember: Your job is to help them grow, which sometimes means uncomfortable truths delivered with care.`;

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
        temperature: 0.8,
        max_tokens: 400,
        top_p: 1,
        frequency_penalty: 0.4,
        presence_penalty: 0.4,
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

