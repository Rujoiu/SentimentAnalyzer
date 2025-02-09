import OpenAI from 'openai';

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  emoji: string;
  color: string;
  explanation: string;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze the sentiment of the text and respond with a JSON object containing: sentiment (positive/negative/neutral), score (-1 to 1), and a brief explanation. Be concise."
        },
        {
          role: "user",
          content: text
        }
      ],
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '');
    
    const emojiMap = {
      positive: '😊',
      negative: '😔',
      neutral: '😐'
    };

    const colorMap = {
      positive: 'text-green-600',
      negative: 'text-red-600',
      neutral: 'text-gray-600'
    };

    return {
      sentiment: response.sentiment,
      score: response.score,
      emoji: emojiMap[response.sentiment as keyof typeof emojiMap],
      color: colorMap[response.sentiment as keyof typeof colorMap],
      explanation: response.explanation
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw new Error('Failed to analyze sentiment');
  }
}