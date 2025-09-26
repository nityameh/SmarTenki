// backend/services/translationService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

class TranslationService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  // Check if text contains Japanese characters
  isJapanese(text) {
    if (!text) return false;
    // Check for Hiragana, Katakana, or Kanji
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
    return japaneseRegex.test(text);
  }

  // Main translation method with intent extraction
  async translateAndExtractIntent(japaneseText) {
    try {
      const prompt = `Translate this Japanese text to English and extract travel-related information.

Japanese text: "${japaneseText}"

Provide response in this exact format:
TRANSLATION: [English translation]
INTENT: [what the user wants to know/do]
LOCATION: [any location mentioned, or "none"]
ACTIVITY_TYPE: [travel/food/sports/fashion/general]

Be precise and literal in translation.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        originalText: japaneseText,
        englishTranslation: this.extractValue(text, 'TRANSLATION:'),
        userIntent: this.extractValue(text, 'INTENT:'),
        location: this.extractValue(text, 'LOCATION:'),
        activityType: this.extractValue(text, 'ACTIVITY_TYPE:'),
        isJapanese: true,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  // Simple translation without intent extraction
  async translateJapaneseToEnglish(text) {
    try {
      const prompt = `Translate this Japanese text to English. Provide only the translation, nothing else:
"${text}"`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text().trim();

      return {
        originalText: text,
        translatedText: translatedText,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Simple translation error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  // Translation with context (for better accuracy)
  async translateWithContext(text, context) {
    try {
      const prompt = `Translate this Japanese text to English.
Context: ${context}
Japanese text: "${text}"
Provide only the English translation:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text().trim();

      return {
        originalText: text,
        translatedText: translatedText,
        context: context,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Contextual translation error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  // Helper to extract values from structured response
  extractValue(text, label) {
    const lines = text.split('\n');
    const line = lines.find(l => l.includes(label));
    if (!line) return '';
    
    const value = line.replace(label, '').trim();
    return value === 'none' ? null : value;
  }

  // Batch translation for multiple texts
  async translateBatch(texts) {
    const results = [];
    
    for (const text of texts) {
      try {
        const result = await this.translateJapaneseToEnglish(text);
        results.push(result);
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({
          originalText: text,
          error: error.message,
          translatedText: null
        });
      }
    }

    return results;
  }
}

module.exports = new TranslationService();