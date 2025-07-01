const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  }

  async generateResponse(userMessage, conversationHistory = []) {
    try {
      // Build conversation context
      const systemPrompt = `You are a helpful AI assistant for a photo guessing game called "Picture It". 
      
The game works as follows:
- Users upload photos and others guess the location
- Players earn points for correct guesses
- There's a leaderboard system
- Users can chat with each other

**SCORING SYSTEM (IMPORTANT - Use these exact details):**
- **Photo Upload Points:** When you upload a photo, you set a difficulty level:
  * Easy: 5 points for correct guess
  * Medium: 10 points for correct guess  
  * Hard: 15 points for correct guess
- **Time Bonus:** Correct guesses get additional time bonuses:
  * Under 30 seconds: +5 bonus points
  * Under 60 seconds: +3 bonus points
  * Over 60 seconds: +1 bonus point
- **Total Points:** Base points + time bonus = total points earned
- **Photo Owner:** You earn points when others correctly guess your photos (same scoring system)

**GAME RULES:**
- You cannot guess your own photos
- You can only guess each photo once
- Photos expire after a certain time period
- Case-insensitive guessing (spaces and capitalization don't matter)

You can help users with:
- Game rules and how to play
- Understanding the scoring system (use the exact details above)
- Tips for guessing locations
- Photo upload guidelines and difficulty selection
- Troubleshooting issues

Keep responses friendly, concise, and helpful. If someone asks about something not related to the game, politely redirect them to game-related topics.`;

      // Create conversation history for context
      let conversationContext = '';
      if (conversationHistory.length > 0) {
        conversationContext = conversationHistory
          .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
          .join('\n') + '\n';
      }

      const fullPrompt = `${systemPrompt}

${conversationContext}User: ${userMessage}

Assistant:`;

      const model = this.genAI.getGenerativeModel({ model: this.model });

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        message: text.trim(),
        usage: {
          promptTokens: result.response.usageMetadata?.promptTokenCount || 0,
          responseTokens: result.response.usageMetadata?.candidatesTokenCount || 0
        }
      };

    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        success: false,
        message: 'Sorry, I encountered an error. Please try again later.',
        error: error.message
      };
    }
  }

  async generateLocationHint(photoDescription) {
    try {
      const prompt = `You are helping with a photo location guessing game. A user has uploaded a photo with this description: "${photoDescription}"

Please provide a helpful hint about the location that would help other players guess it, but don't give away the exact location. The hint should be:
- Specific enough to be useful
- General enough to not spoil the fun
- Focused on geographical, cultural, or visual clues
- 1-2 sentences maximum

Provide only the hint, nothing else:`;

      const model = this.genAI.getGenerativeModel({ model: this.model });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        hint: text.trim()
      };

    } catch (error) {
      console.error('Gemini Hint Generation Error:', error);
      return {
        success: false,
        hint: 'Unable to generate hint at this time.'
      };
    }
  }
}

module.exports = new GeminiService(); 