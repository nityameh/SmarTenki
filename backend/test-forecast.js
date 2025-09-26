// backend/test-forecast.js
require('dotenv').config();
const weatherService = require('./services/weatherService');

async function testEnhancedWeatherService() {
  console.log('🌤️ Testing Enhanced Weather Service with Forecast...\n');
  
  const testCity = 'Tokyo';
  
  try {
    console.log('1. Testing Current Weather...');
    const current = await weatherService.getCurrentWeather(testCity);
    console.log(`✅ Current: ${current.weather.temperature}°C, ${current.weather.description}\n`);
    
    console.log('2. Testing 5-Day Forecast...');
    const forecast = await weatherService.getFiveDayForecast(testCity);
    console.log(`✅ Forecast for ${forecast.totalDays} days:`);
    forecast.dailyForecasts.forEach(day => {
      console.log(`   ${day.dayName}: ${day.temperature.min}°C - ${day.temperature.max}°C, ${day.weather.description}`);
    });
    console.log('');
    
    console.log('3. Testing Complete Weather Data...');
    const complete = await weatherService.getCompleteWeatherData(testCity);
    const recommendations = weatherService.getWeeklyRecommendation(complete);
    
    console.log(`✅ Complete data for ${complete.city}, ${complete.country}`);
    console.log(`   Current: ${complete.current.weather.temperature}°C`);
    console.log(`   Forecast days: ${complete.forecast.totalDays}`);
    console.log(`   Today's recommendation: ${recommendations.today}`);
    
    if (recommendations.week.bestDays.length > 0) {
      console.log('   Best days this week:');
      recommendations.week.bestDays.forEach(day => {
        console.log(`     ${day.day} (${day.temp}°C)`);
      });
    }
    
    if (recommendations.week.rainDays.length > 0) {
      console.log('   Rainy days:');
      recommendations.week.rainDays.forEach(day => {
        console.log(`     ${day.day}`);
      });
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// Test different endpoint formats
async function testApiEndpoints() {
  console.log('\n🧪 Testing API Endpoint Formats...\n');
  
  const testUrls = [
    'http://localhost:5000/api/weather/current/Tokyo',
    'http://localhost:5000/api/weather/forecast/Tokyo',
    'http://localhost:5000/api/weather/complete/Tokyo'
  ];
  
  for (const url of testUrls) {
    console.log(`Testing: ${url.split('/').pop()}`);
    console.log(`Visit: ${url}\n`);
  }
}

// Run tests
testEnhancedWeatherService().then(() => {
  testApiEndpoints();
});