// backend/test-gemini-complete.js
require('dotenv').config();
const weatherService = require('./services/weatherService');
const aiService = require('./services/aiService');

async function testGeminiIntegration() {
  console.log('🤖 Testing Complete Gemini AI Integration...\n');
  
  const testLocation = 'Tokyo';
  const testMessages = [
    {
      text: '今日東京で何をすべきですか？',
      isJapanese: true,
      description: 'Japanese: What should I do in Tokyo today?'
    },
    {
      text: 'What outdoor activities can I do this week?',
      isJapanese: false,
      description: 'English: Weekly outdoor activities'
    },
    {
      text: 'What should I wear today?',
      isJapanese: false,
      description: 'Fashion recommendations'
    }
  ];

  try {
    // 1. Test Weather Service
    console.log('1️⃣ Testing Weather Service...');
    const weatherData = await weatherService.getCompleteWeatherData(testLocation);
    console.log(`✅ Weather: ${weatherData.current.weather.temperature}°C, ${weatherData.current.weather.description}`);
    console.log(`✅ Forecast: ${weatherData.forecast.totalDays} days available\n`);

    // 2. Test AI Service with Different Messages
    for (let i = 0; i < testMessages.length; i++) {
      const testMessage = testMessages[i];
      console.log(`${i + 2}️⃣ Testing: ${testMessage.description}`);
      console.log(`   Input: "${testMessage.text}"`);
      
      try {
        // Process Japanese input if needed
        if (testMessage.isJapanese) {
          console.log('   🇯🇵 Processing Japanese...');
          const analysis = await aiService.processJapaneseInput(testMessage.text);
          console.log(`   📝 Analysis: ${analysis.analysis.substring(0, 100)}...`);
        }

        // Generate suggestions
        console.log('   🤖 Generating suggestions...');
        const aiResponse = await aiService.generateTravelSuggestions(
          weatherData,
          testMessage.text,
          testLocation
        );

        console.log(`   ✅ Generated ${aiResponse.suggestions.length} characters of suggestions`);
        console.log(`   📋 Preview: ${aiResponse.suggestions.substring(0, 150)}...\n`);

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}\n`);
      }
    }

    // 3. Test Specific Categories
    console.log('5️⃣ Testing Category-Specific Suggestions...');
    const categories = ['fashion', 'sports', 'food', 'indoor'];
    
    for (const category of categories) {
      try {
        console.log(`   Testing ${category} suggestions...`);
        const categoryResponse = await aiService.generateSpecificSuggestions(
          weatherData,
          category,
          `Give me ${category} recommendations`,
          testLocation
        );
        console.log(`   ✅ ${category}: ${categoryResponse.suggestions.substring(0, 100)}...`);
      } catch (error) {
        console.log(`   ❌ ${category} error: ${error.message}`);
      }
    }

    console.log('\n6️⃣ Testing Follow-up Questions...');
    const followUp = await aiService.generateFollowUpQuestions(
      'Here are some travel suggestions for Tokyo...',
      weatherData
    );
    console.log(`   ✅ Generated ${followUp.questions.length} follow-up questions`);
    followUp.questions.forEach((q, i) => {
      console.log(`   ${i + 1}. ${q}`);
    });

  } catch (error) {
    console.log(`❌ Major error: ${error.message}`);
  }
}

async function testAPIEndpoints() {
  console.log('\n🌐 API Endpoints to Test:');
  console.log('   POST /api/chat');
  console.log('   Body: { "message": "What should I do today?", "location": "Tokyo", "isJapanese": false }');
  console.log('');
  console.log('   POST /api/chat/category');
  console.log('   Body: { "message": "Clothing advice", "location": "Tokyo", "category": "fashion" }');
  console.log('');
  console.log('   POST /api/chat/analyze');
  console.log('   Body: { "text": "今日東京で何をすべきですか？" }');
  console.log('');
  console.log('   GET /api/suggestions/Tokyo/quick-outdoor');
  console.log('   GET /api/suggestions/Tokyo/quick-fashion');
  console.log('');
  console.log('💡 Test with curl or Postman when server is running!');
}

// Test with sample curl commands
async function generateTestCommands() {
  console.log('\n🧪 Sample Test Commands:');
  console.log('');
  console.log('# Test main chat endpoint:');
  console.log(`curl -X POST http://localhost:5000/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What should I do in Tokyo today?", "location": "Tokyo", "isJapanese": false}'`);
  
  console.log('\n# Test Japanese input:');
  console.log(`curl -X POST http://localhost:5000/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message": "今日東京で何をすべきですか？", "location": "Tokyo", "isJapanese": true}'`);
  
  console.log('\n# Test fashion category:');
  console.log(`curl -X POST http://localhost:5000/api/chat/category \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What should I wear?", "location": "Tokyo", "category": "fashion"}'`);
  
  console.log('\n# Test quick suggestions:');
  console.log(`curl http://localhost:5000/api/suggestions/Tokyo/quick-outdoor`);
}

// Run all tests
console.log('🚀 Starting Gemini AI Integration Tests...\n');

testGeminiIntegration()
  .then(() => testAPIEndpoints())
  .then(() => generateTestCommands())
  .then(() => {
    console.log('\n✅ All tests completed! Start your server and try the curl commands.');
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error.message);
  });