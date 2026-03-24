// Native fetch-based Netlify function — no external dependencies needed
export const handler = async (event: any) => {
  // CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const apiKey = process.env.MOONSHOT_API_KEY;

  if (!apiKey) {
    console.error('MOONSHOT_API_KEY is not set in environment variables');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'API key not configured on server' }),
    };
  }

  try {
    const { text } = JSON.parse(event.body || '{}');

    if (!text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is required' }),
      };
    }

    const apiResponse = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: 'You are a Hebrew translation expert. Translate the given English text to Hebrew. Respond with ONLY the Hebrew translation, no explanations or additional text.',
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error('Moonshot API error:', apiResponse.status, errorBody);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'Translation API returned an error', status: apiResponse.status }),
      };
    }

    const data = await apiResponse.json();
    const translation = data.choices?.[0]?.message?.content || '';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ translation }),
    };
  } catch (error: any) {
    console.error('Translation function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Translation failed', details: error.message }),
    };
  }
};
