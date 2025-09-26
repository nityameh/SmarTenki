// backend/test-weather.js (temporary test file)
require('dotenv').config();
const weatherService = require('./services/weatherService');

async function testWeatherService() {
  console.log('🧪 Testing Weather Service...\n');
  
  // Test cities
  const testCities = ['Tokyo', 'Osaka', 'New York', 'Invalid City 123'];
  
  for (const city of testCities) {
    try {
      console.log(`Testing: ${city}`);
      const weather = await weatherService.getCurrentWeather(city);
      
      console.log(`✅ ${weather.city}, ${weather.country}`);
      console.log(`   Temperature: ${weather.weather.temperature}°C`);
      console.log(`   Description: ${weather.weather.description}`);
      console.log(`   Humidity: ${weather.weather.humidity}%\n`);
      
    } catch (error) {
      console.log(`❌ ${city}: ${error.message}\n`);
    }
  }
}

// Run the test
testWeatherService();