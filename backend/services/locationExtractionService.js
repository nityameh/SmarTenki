const { GoogleGenerativeAI } = require('@google/generative-ai');

class LocationExtractionService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Predefined Japanese cities for quick recognition
    this.japaneseCities = {
      // Major cities
      'tokyo': ['tokyo', 'tokio', '東京', 'とうきょう'],
      'osaka': ['osaka', 'ōsaka', '大阪', 'おおさか'],
      'kyoto': ['kyoto', 'kyōto', '京都', 'きょうと'],
      'hiroshima': ['hiroshima', '広島', 'ひろしま'],
      'sapporo': ['sapporo', '札幌', 'さっぽろ'],
      'fukuoka': ['fukuoka', '福岡', 'ふくおか'],
      'yokohama': ['yokohama', '横浜', 'よこはま'],
      'kobe': ['kobe', 'kōbe', '神戸', 'こうべ'],
      'sendai': ['sendai', '仙台', 'せんだい'],
      'kanazawa': ['kanazawa', '金沢', 'かなざわ'],
      'nara': ['nara', '奈良', 'なら'],
      'nikko': ['nikko', 'nikkō', '日光', 'にっこう'],
      

      // Districts/Areas
      'shibuya': ['shibuya', '渋谷', 'しぶや'],
      'shinjuku': ['shinjuku', '新宿', 'しんじゅく'],
      'harajuku': ['harajuku', '原宿', 'はらじゅく'],
      'ginza': ['ginza', '銀座', 'ぎんざ'],
      'asakusa': ['asakusa', '浅草', 'あさくさ'],
      'akihabara': ['akihabara', '秋葉原', 'あきはばら'],
      'roppongi': ['roppongi', '六本木', 'ろっぽんぎ'],
    };
  }

  // Main method
  async extractLocation(text) {
    try {
      console.log('Extracting location from:', text);

      // Step 1: Quick pattern match
      const quickResult = this.quickLocationMatch(text);
      if (quickResult) {
        console.log('✅ Quick match found:', quickResult);
        return quickResult;
      }

      // Step 2: AI fallback
      const aiResult = await this.aiLocationExtraction(text);
      console.log('🤖 AI extraction result:', aiResult);
      return aiResult;

    } catch (error) {
      console.error('❌ Location extraction error:', error);
      return null;
    }
  }

  // Quick pattern matching
  quickLocationMatch(text) {
    const normalizedText = text.toLowerCase();

    for (const [city, variations] of Object.entries(this.japaneseCities)) {
      for (const variation of variations) {
        if (normalizedText.includes(variation.toLowerCase())) {
          return {
            city: this.capitalizeCity(this.mapDistrictToCity(city)),
            confidence: 0.95,
            method: 'pattern_match',
            originalText: variation
          };
        }
      }
    }
    return null;
  }

  // AI extraction with strict JSON
  async aiLocationExtraction(text) {
    try {
      const prompt = `
        Extract location/city information from the following text.
        Only consider Japanese locations (cities, districts, regions, landmarks).

        Text: "${text}"

        Respond ONLY in valid JSON with this schema:
        {
          "city": "string | none",
          "confidence": "number between 0.0 and 1.0",
          "type": "city | district | region | landmark | unknown"
        }

        Rules:
        - If no location is found, use "city": "none" and confidence: 0.0.
        - Always use standardized English names (Tokyo, Osaka, Kyoto, etc.).
        - Example: "How's the weather in Shibuya?" → {"city": "Shibuya", "confidence": 0.85, "type": "district"}
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response.text();

      let parsed;
      try {
        parsed = JSON.parse(response);
      } catch (err) {
        console.error("⚠️ Failed to parse AI JSON:", response);
        return null;
      }

      if (parsed.city && parsed.city.toLowerCase() !== 'none') {
        const mappedCity = this.mapDistrictToCity(parsed.city);
        return {
          city: this.capitalizeCity(mappedCity),
          confidence: parsed.confidence || 0.5,
          method: 'ai_extraction',
          type: parsed.type || 'unknown',
          rawResponse: parsed
        };
      }
      return null;

    } catch (error) {
      console.error('AI location extraction error:', error);
      return null;
    }
  }

  // Map districts to their parent cities
  mapDistrictToCity(location) {
    const districtMap = {
      'shibuya': 'Tokyo',
      'shinjuku': 'Tokyo',
      'harajuku': 'Tokyo',
      'ginza': 'Tokyo',
      'asakusa': 'Tokyo',
      'akihabara': 'Tokyo',
      'roppongi': 'Tokyo',
    };

    const normalized = location.toLowerCase();
    return districtMap[normalized] || location;
  }

  capitalizeCity(city) {
    if (!city || typeof city !== 'string') return city;
    return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  }
}

module.exports = new LocationExtractionService();
