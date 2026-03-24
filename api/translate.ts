import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_MOONSHOT_API_KEY,
  baseURL: "https://api.moonshot.cn/v1",
});

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
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
    return res.status(200).json({ translation });
  } catch (error) {
    console.error('Moonshot translation error:', error);
    return res.status(500).json({ error: 'Translation failed' });
  }
}
