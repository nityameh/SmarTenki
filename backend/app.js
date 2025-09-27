const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path=require('path');

const app = express();
const PORT = process.env.PORT || 5000;



const __directoryName = path.resolve();
// Middleware
app.use(cors());
app.use(express.json());


// Import services
const weatherService = require('./services/weatherService');
const translationService = require('./services/translationService');
const locationExtraction = require('./services/locationExtractionService');
const contextService = require('./services/contextService');
const aiService = require('./services/aiService');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Main chat endpoint - UPDATED FOR BILINGUAL
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, preferBilingual = true } = req.body;
    
    // Step 1: Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
    }

    // Step 2: Get or create session
    const actualSessionId = sessionId || contextService.generateSessionId();
    const context = contextService.getContext(actualSessionId);
    
    console.log(`\n🔄 Processing message for session: ${actualSessionId}`);
    console.log(`📝 Original message: "${message}"`);

    // Step 3: Handle Japanese translation if needed
    let processedMessage = message;
    let translationResult = null;
    
    if (translationService.isJapanese(message)) {
      console.log('🇯🇵 Detected Japanese text, translating...');
      translationResult = await translationService.translateAndExtractIntent(message);
      processedMessage = translationResult.englishTranslation;
      console.log(`📝 Translated message: "${processedMessage}"`);
    }

    // Step 4: Extract location from message
    let extractedLocation = await locationExtraction.extractLocation(processedMessage);
    
    // If translation found a location, use it as backup
    if (!extractedLocation && translationResult?.location) {
      extractedLocation = {
        city: translationResult.location,
        confidence: 0.8,
        method: 'translation_extraction'
      };
    }

    // Step 5: Update context with city
    let currentCity = context.currentCity;
    
    if (extractedLocation && extractedLocation.city) {
      contextService.updateCity(actualSessionId, extractedLocation.city);
      currentCity = extractedLocation.city;
      console.log(`📍 City updated to: ${currentCity}`);
    } else {
      console.log(`📍 Using existing city: ${currentCity}`);
    }

    // Step 6: Get weather data (cached or fresh)
    let weatherData = contextService.getCachedWeather(actualSessionId, currentCity);
    
    if (!weatherData) {
      console.log(`☁️ Fetching fresh weather for ${currentCity}...`);
      weatherData = await weatherService.getCompleteWeatherData(currentCity);
      contextService.cacheWeather(actualSessionId, currentCity, weatherData);
    } else {
      console.log(`☁️ Using cached weather for ${currentCity}`);
    }

    // Step 7: Format weather data into prompt-friendly string
    const weatherSummary = weatherService.buildLightweightWeatherSummary(weatherData);
    const weatherPrompt = weatherService.formatSummaryForPrompt(weatherSummary);
    
    console.log(`📊 Weather summary prepared for ${currentCity}`);

    // Step 8: Create enhanced prompt combining user message and weather
    const enhancedPrompt = `${weatherPrompt}\n\nUSER REQUEST: "${processedMessage}"`;
    
    console.log(`🤖 Generating AI response...`);

    // Step 9: Generate AI suggestions - NOW BILINGUAL
    let aiResponse;
    
    if (preferBilingual) {
      // Use new bilingual method
      aiResponse = await aiService.generateBilingualTravelSuggestions(
        enhancedPrompt,
        currentCity
      );
    } else {
      // Fallback to original method if needed
      aiResponse = await aiService.generateTravelSuggestionsWithPrompt(
        enhancedPrompt,
        currentCity
      );
    }


    // Step 11: Add to message history
    const responseText = aiResponse.suggestions?.english || aiResponse.suggestions;
    contextService.addMessage(actualSessionId, message, responseText);

    // Step 12: Send response
    res.json({
      success: true,
      data: {
        response: aiResponse.suggestions, // Now contains {english, japanese, isBilingual}
        weather: weatherData,
        weatherSummary: weatherSummary,
        currentCity: currentCity,
        extractedLocation: extractedLocation,
        translation: translationResult,
        //followUpQuestions: followUpQuestions.questions,
        sessionId: actualSessionId,
        context: {
          messageCount: context.messageCount,
          citiesVisited: [...new Set(context.cityHistory)].length,
          recentCities: context.cityHistory.slice(-3)
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Chat endpoint error:', error);
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get session stats
app.get('/api/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const stats = contextService.getStats(sessionId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Clear session
app.delete('/api/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const cleared = contextService.clearSession(sessionId);
    
    res.json({
      success: cleared,
      message: cleared ? 'Session cleared' : 'Session not found'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Translation endpoint (standalone)
app.post('/api/translate', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ 
        error: 'Text is required' 
      });
    }

    if (!translationService.isJapanese(text)) {
      return res.json({
        success: true,
        data: {
          originalText: text,
          translatedText: text,
          isJapanese: false
        }
      });
    }

    const translation = await translationService.translateJapaneseToEnglish(text);

    res.json({
      success: true,
      data: {
        ...translation,
        isJapanese: true
      }
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Weather endpoints (keep existing ones)
app.get('/api/weather/current/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const weather = await weatherService.getCurrentWeather(city);
    res.json({ 
      success: true, 
      data: weather,
      type: 'current'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message
    });
  }
});

app.get('/api/weather/complete/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const completeWeather = await weatherService.getCompleteWeatherData(city);
    
    res.json({ 
      success: true, 
      data: completeWeather,
      type: 'complete'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message
    });
  }
});


app.use(express.static(path.join(__directoryName, "/frontend/build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__directoryName, "frontend", "build", "index.html"));
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 API Keys configured:`);
  console.log(`   - OpenWeather: ${process.env.OPENWEATHER_API_KEY ? '✅' : '❌'}`);
  console.log(`   - Gemini: ${process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
});