import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({
  apiKey: config.openaiApiKey
});

export const aiService = {
  async getInvestmentAdvice(message: string, investmentHistory: any) {
    const systemPrompt = `You are an investment advisor for a micro-investment platform. 
    Users can invest 1, 5, or 10 bob with the following returns:
    - 1 bob: 5 bob per minute for 3 days (7200 per day)
    - 5 bob: 8 bob per minute for 6 days (11520 per day)
    - 10 bob: 15 bob per minute for 8 days (21600 per day)
    Provide clear, concise advice based on user questions and their investment history.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Investment History: ${JSON.stringify(investmentHistory)}\n\nUser Question: ${message}` }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get investment advice');
    }
  },

  async predictInvestmentTrend(investments: any[]) {
    try {
      const prompt = `Analyze this investment data and provide insights about investment patterns and potential risks:\n${JSON.stringify(investments)}`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI investment analyst. Analyze investment patterns and provide insights." },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to predict investment trend');
    }
  }
};