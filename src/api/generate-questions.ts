export const config = {
  runtime: 'edge',
};

interface GenerateQuestionsRequest {
  category: 'friends' | 'family' | 'dating' | 'lovers' | 'work' | 'growth' | 'spice';
  count: number;
  depth?: 'standard' | 'deeper';
  userPreferences?: {
    previousQuestions?: string[];
    skippedQuestions?: string[];
    completedQuestions?: string[];
  };
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body: GenerateQuestionsRequest = await req.json();
    const { category, count = 5, depth = 'standard', userPreferences } = body;

    // Validate category
    const validCategories = ['friends', 'family', 'dating', 'lovers', 'work', 'growth', 'spice'];
    if (!validCategories.includes(category)) {
      return new Response(JSON.stringify({ error: 'Invalid category' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create context-aware prompt
    let prompt = `Generate ${count} engaging conversation starter questions for the "${category}" category. `;
    
    if (depth === 'standard') {
      prompt += 'Make them approachable, safe, and easy to answer. They should be comfortable for most people to discuss. ';
    } else {
      prompt += 'Make them thought-provoking, deep, and potentially vulnerable. They should encourage deeper reflection and meaningful conversations. ';
    }

    // Add adaptive context based on user preferences
    if (userPreferences?.previousQuestions?.length) {
      prompt += `Avoid similar questions to these: ${userPreferences.previousQuestions.slice(0, 3).join(', ')}. `;
    }

    if (userPreferences?.skippedQuestions?.length) {
      prompt += `Avoid questions similar to these that were skipped: ${userPreferences.skippedQuestions.slice(0, 2).join(', ')}. `;
    }

    prompt += `
Requirements:
- Each question should be 1-2 sentences long
- Make them personal and relationship-focused
- Avoid generic or cliché questions
- Ensure they're appropriate for the ${category} context
- Make them engaging and conversation-worthy

Return only the questions, one per line, without numbering or bullet points.`;

    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at creating meaningful conversation starter questions that help people connect and build relationships.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(JSON.stringify({ error: 'Failed to generate questions' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse questions from response
    const questions = content
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0)
      .slice(0, count);

    // Generate tags for each question
    const questionsWithTags = questions.map(question => {
      const tags = generateTags(category, question);
      return {
        text: question,
        depth_level: depth,
        tags,
      };
    });

    return new Response(JSON.stringify({
      questions: questionsWithTags,
      category,
      count: questionsWithTags.length,
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate questions' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function generateTags(category: string, questionText: string): string[] {
  const baseTags = [category];
  const lowerText = questionText.toLowerCase();
  
  if (lowerText.includes('memory') || lowerText.includes('remember')) {
    baseTags.push('memory');
  }
  if (lowerText.includes('future') || lowerText.includes('goal') || lowerText.includes('dream')) {
    baseTags.push('future');
  }
  if (lowerText.includes('favorite') || lowerText.includes('best') || lowerText.includes('love')) {
    baseTags.push('preferences');
  }
  if (lowerText.includes('advice') || lowerText.includes('learn') || lowerText.includes('teach')) {
    baseTags.push('wisdom');
  }
  if (lowerText.includes('together') || lowerText.includes('with') || lowerText.includes('share')) {
    baseTags.push('shared');
  }
  if (lowerText.includes('challenge') || lowerText.includes('difficult') || lowerText.includes('hard')) {
    baseTags.push('challenge');
  }
  if (lowerText.includes('fun') || lowerText.includes('funny') || lowerText.includes('laugh')) {
    baseTags.push('fun');
  }

  return baseTags;
}
