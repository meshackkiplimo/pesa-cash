interface AIResponse {
  status: string;
  data: {
    message?: string;
    insights?: string;
  };
}

export const aiService = {
  async getAdvice(message: string): Promise<string> {
    try {
      const response = await fetch('/api/ai/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data: AIResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.data.message || 'Failed to get advice');
      }

      return data.data.message || 'No advice available';
    } catch (error) {
      console.error('AI service error:', error);
      throw error;
    }
  },

  async getInsights(): Promise<string> {
    try {
      const response = await fetch('/api/ai/insights');
      const data: AIResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.data.message || 'Failed to get insights');
      }

      return data.data.insights || 'No insights available';
    } catch (error) {
      console.error('AI service error:', error);
      throw error;
    }
  }
};