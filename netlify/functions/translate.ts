import OpenAI from 'openai';

export const handler = async (event: any) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Use either MOONSHOT_API_KEY or VITE_MOONSHOT_API_KEY
  const apiKey = process.env.MOONSHOT_API_KEY || process.env.VITE_MOONSHOT_API_KEY;

  if (!apiKey) {
    console.error('MOONSHOT_API_KEY is missing in environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API Key not configured on server' }),
    };
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.moonshot.cn/v1",
  });

  try {
    const { text } = JSON.parse(event.body);

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Text is required' }),
      };
    }

    const response = await openai.chat.completions.create({
      model: "moonshot-v1-8k",
      messages: [
        {
          role: "system",
          content: "You are a Hebrew translation expert. Translate the given English text to Hebrew. Respond with ONLY the Hebrew translation, no explanations or additional text."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3
    });

    const translation = response.choices[0].message.content || '';
    return {
      statusCode: 200,
      body: JSON.stringify({ translation }),
    };
  } catch (error) {
    console.error('Moonshot translation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Translation failed', details: (error as any).message }),
    };
  }
};

