const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiAIService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    } 
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    console.log(`🧠 Using Gemini model: ${modelName}`);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  // NEW METHOD: Bilingual travel suggestions
//   async generateBilingualTravelSuggestions(enhancedPrompt, location) {
//     try {
//       const structuredPrompt = `You are a knowledgeable travel assistant specializing in Japan. 
// Generate personalized suggestions based on the weather conditions and user request provided below.

// ${enhancedPrompt}

// Please provide your response in BOTH English and Japanese languages.

// FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

// === ENGLISH ===
// [Provide a 4-sentence response to the user's request]

// [Then provide suggestions in these categories:]

// 1. Travel & Sightseeing:
//    - List 3-4 key attractions suitable for the weather

// 2. Outdoor Activities & Sports:
//    - Suggest weather-appropriate activities

// 3. Fashion & Clothing Recommendations:
//    - Suggest clothing for current temperature
//    - Include layering advice
//    - Recommend necessary accessories

// 4. Practical Tips:
//    - Transportation recommendations
//    - Budget-friendly alternatives

// === JAPANESE ===
// [Provide the EXACT SAME content translated to natural, polite Japanese]
// [Use appropriate honorifics and Japanese travel vocabulary]
// [Maintain the same structure and bullet points]

// Requirements:
// - Use bullet points only; no emojis, icons, or bold text
// - One point, one sentence for each suggestion
// - Be specific about locations in ${location}
// - Keep suggestions realistic and culturally appropriate for Japan
// - The Japanese version should be a natural translation, not word-for-word`;

//       console.log('🤖 Generating bilingual travel suggestions...');
      
//       const result = await this.model.generateContent(structuredPrompt);
//       const response = await result.response;
//       const fullResponse = response.text();

//       // Parse the response to separate English and Japanese
//       const englishMatch = fullResponse.match(/=== ENGLISH ===([\s\S]*?)(?==== JAPANESE ===|$)/);
//       const japaneseMatch = fullResponse.match(/=== JAPANESE ===([\s\S]*?)$/);

//       return {
//         suggestions: {
//           english: englishMatch ? englishMatch[1].trim() : fullResponse,
//           japanese: japaneseMatch ? japaneseMatch[1].trim() : null,
//           isBilingual: true
//         },
//         type: 'bilingual_travel_suggestions',
//         timestamp: new Date().toISOString(),
//         location: location
//       };

//     } catch (error) {
//       console.error('Gemini AI Error:', error.message);
//       throw new Error(`AI suggestion error: ${error.message}`);
//     }
//   }

//   // EXISTING METHOD: Generate suggestions with pre-formatted prompt
//   async generateTravelSuggestionsWithPrompt(enhancedPrompt, location) {
//     try {
//       const structuredPrompt = `You are a knowledgeable travel assistant specializing in Japan. 
// Generate personalized suggestions based on the weather conditions and user request provided below.

// ${enhancedPrompt}  please give me an accurate response for the above message considering the intent of the prompt in 4 sentence and

// Please also  provide added suggestions in these categories:

// You are a travel and lifestyle assistant for Japan. Based on the current weather and 3-day forecast, provide concise, practical recommendations in the following categories:

// 1. Travel & Sightseeing:
//    - List 3-4 key attractions suitable for the weather.

// 2. Outdoor Activities & Sports:
//    - Suggest weather-appropriate activities (hiking, cycling, beach, etc.).
//    - Consider temperature and wind conditions.

// 3. Fashion & Clothing Recommendations:
//    - Suggest clothing for current temperature.
//    - Include layering advice for temperature changes.
//    - Recommend necessary accessories (umbrella, sunglasses, etc.).

// 4. Practical Tips:
//    - Transportation recommendations.
//    - Budget-friendly alternatives.

// Requirements:.
// - Use bullet points only; no emojis, icons, or bold text.
// - Avoid long explanations or extra commentary.
// - Please give me one point one sentence repsone for the added suggestions 
// - Focus on actionable, realistic advice suitable for a traveler in Japan.
// . Be specific about locations in ${location}, times, and practical details. Keep suggestions realistic and culturally appropriate for Japan.`;

//       console.log('🤖 Generating structured travel suggestions...');
      
//       const result = await this.model.generateContent(structuredPrompt);
//       const response = await result.response;
//       const suggestions = response.text();

//       return {
//         suggestions: suggestions,
//         type: 'enhanced_travel_suggestions',
//         timestamp: new Date().toISOString(),
//         location: location
//       };

//     } catch (error) {
//       console.error('Gemini AI Error:', error.message);
//       throw new Error(`AI suggestion error: ${error.message}`);
//     }
//   }
async generateBilingualTravelSuggestions(enhancedPrompt, location) {
  try {
    const structuredPrompt = `You are a travel assistant for ${location}, Japan. Respond naturally to what the user is asking.

${enhancedPrompt}

RESPONSE APPROACH:
1. Read the user's message carefully and answer THAT specific question first
2. Let the weather conditions inform your advice (don't just list weather stats)
3. Be conversational, not formulaic
4. use simple text in response dont give bold font, emoji , icons anything other than simple text


CONTEXT-AWARE GUIDELINES:
- If user asks about weather → Focus on conditions and how they affect plans
- If user asks what to wear → Specific clothing advice for the temperature/conditions
- If user asks what to do → Activities that work well with current weather
- If user asks about food → Weather-appropriate dining suggestions
- If general travel question → Brief weather context, then relevant suggestions

BILINGUAL OUTPUT FORMAT:

=== ENGLISH ===
[Natural conversational response that directly addresses what they asked]
[Include 3-5 practical suggestions relevant to their question and the weather]
[Mention specific places in ${location} when applicable]

=== JAPANESE ===
[Natural Japanese translation using appropriate politeness]
[Maintain the helpful tone but allow natural Japanese sentence flow]

QUALITY GUIDELINES:
- Avoid using BOLD text , emoji and icon, keep the response simple and polite
- Start with what they're actually asking about
- If weather is severe (storm/extreme heat/cold), mention safety first
- Keep suggestions specific to ${location}, not generic Japan
- Total response: 5-8 sentences in each language
- Adapt your response style to the question - don't force categories if not needed`;

    console.log('🤖 Generating bilingual travel suggestions...');
    
    const result = await this.model.generateContent(structuredPrompt);
    const response = await result.response;
    const fullResponse = response.text();

    // Parse the response to separate English and Japanese
    const englishMatch = fullResponse.match(/=== ENGLISH ===([\s\S]*?)(?==== JAPANESE ===|$)/);
    const japaneseMatch = fullResponse.match(/=== JAPANESE ===([\s\S]*?)$/);

    return {
      suggestions: {
        english: englishMatch ? englishMatch[1].trim() : fullResponse,
        japanese: japaneseMatch ? japaneseMatch[1].trim() : null,
        isBilingual: true
      },
      type: 'bilingual_travel_suggestions',
      timestamp: new Date().toISOString(),
      location: location
    };

  } catch (error) {
    console.error('Gemini AI Error:', error.message);
    throw new Error(`AI suggestion error: ${error.message}`);
  }
}
  // EXISTING METHOD: Original method for backward compatibility
  async generateTravelSuggestions(weatherData, userMessage, location) {
    try {
      const prompt = this.buildTravelPrompt(weatherData, userMessage, location);
      console.log('🤖 Generating travel suggestions with Gemini...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const suggestions = response.text();

      return {
        suggestions: suggestions,
        type: 'travel_suggestions',
        timestamp: new Date().toISOString(),
        weatherContext: {
          current: weatherData.current?.weather,
          forecast: weatherData.forecast?.dailyForecasts?.slice(0, 3) || []
        }
      };

    } catch (error) {
      console.error('Gemini AI Error:', error.message);
      throw new Error(`AI suggestion error: ${error.message}`);
    }
  }

  buildTravelPrompt(weatherData, userMessage, location) {
    const current = weatherData.current?.weather;
    const forecast = weatherData.forecast?.dailyForecasts || [];
    
    return `You are a knowledgeable travel assistant specializing in Japan. Generate personalized suggestions based on weather conditions and user preferences.

CURRENT WEATHER IN ${location.toUpperCase()}:
- Temperature: ${current?.temperature}°C (feels like ${current?.feelsLike}°C)
- Condition: ${current?.description}
- Humidity: ${current?.humidity}%
- Wind: ${current?.windSpeed} m/s
- Visibility: ${current?.visibility} km

UPCOMING WEATHER (Next 3 days):
${forecast.slice(0, 3).map((day, index) => 
  `Day ${index + 1} (${day.dayName}): ${day.temperature.min}-${day.temperature.max}°C, ${day.weather.description}`
).join('\n')}

USER REQUEST: "${userMessage}"

Please provide comprehensive suggestions in these categories:


You are a travel and lifestyle assistant for Japan. Based on the current weather and 3-day forecast, provide concise, practical recommendations in the following categories:

1. Travel & Sightseeing:
   - List 3-4 key attractions suitable for the weather.

2. Outdoor Activities & Sports:
   - Suggest weather-appropriate activities (hiking, cycling, beach, etc.).
   - Include difficulty and equipment needed.
   - Consider temperature and wind conditions.

3. Fashion & Clothing Recommendations:
   - Suggest clothing for current temperature.
   - Include layering advice for temperature changes.
   - Recommend necessary accessories (umbrella, sunglasses, etc.).


4. Practical Tips:
   - Transportation recommendations.
   - Budget-friendly alternatives.

Requirements:
- Keep each section short and precise.
- Use bullet points only; no emojis, icons, or bold text.
- Avoid long explanations or extra commentary.
- Make the response at max of  300 characters
- Focus on actionable, realistic advice suitable for a traveler in Japan.
`;
  }

  async generateFollowUpQuestions(previousSuggestions, weatherData) {
    try {
      const prompt = `Based on the previous travel suggestions and current weather conditions, generate 3-4 helpful follow-up questions that users might want to ask.

Previous suggestions context: "${previousSuggestions.substring(0, 500)}..."

Current weather: ${weatherData.current?.weather?.temperature}°C, ${weatherData.current?.weather?.description}

Generate natural, conversational follow-up questions that explore:
1. More specific details about suggested activities
2. Alternative options for different preferences
3. Practical planning and logistics
4. Weather-related concerns

Format as a simple array of questions, one per line.
Make them specific and actionable.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const questions = response.text()
        .split('\n')
        .filter(q => q.trim().length > 0)
        .map(q => q.replace(/^[-•*\d.]+\s*/, '').trim())
        .filter(q => q.length > 10)
        .slice(0, 4);

      return {
        questions: questions,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Follow-up questions error:', error.message);
      return { 
        questions: [
          "What indoor activities would you recommend if it rains?",
          "Can you suggest restaurants near the attractions?",
          "What's the best time of day to visit these places?",
          "Are there any seasonal events happening this week?"
        ], 
        timestamp: new Date().toISOString() 
      };
    }
  }
}

module.exports = new GeminiAIService();