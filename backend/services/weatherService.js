// backend/services/weatherService.js
const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.geoBaseURL = 'https://api.openweathermap.org/geo/1.0';
  }

  async getCurrentWeather(city) {
    try {
      if (!city || typeof city !== 'string') {
        throw new Error('City name is required and must be a string');
      }

      if (!this.apiKey) {
        throw new Error('OpenWeather API key is not configured');
      }

      console.log(`Fetching current weather for: ${city}`);

      const response = await axios.get(`${this.baseURL}/weather`, {
        params: {
          q: city.trim(),
          appid: this.apiKey,
          units: 'metric',
          lang: 'en'
        },
        timeout: 5000
      });

      const weatherData = this.formatCurrentWeatherData(response.data);
      console.log('Current weather data retrieved successfully');
      
      return weatherData;

    } catch (error) {
      console.error('Current Weather API Error:', error.message);
      this.handleWeatherError(error, city);
    }
  }

  async getFiveDayForecast(city) {
    try {
      if (!city || typeof city !== 'string') {
        throw new Error('City name is required and must be a string');
      }

      if (!this.apiKey) {
        throw new Error('OpenWeather API key is not configured');
      }

      console.log(`Fetching 5-day forecast for: ${city}`);

      const response = await axios.get(`${this.baseURL}/forecast`, {
        params: {
          q: city.trim(),
          appid: this.apiKey,
          units: 'metric',
          lang: 'en'
        },
        timeout: 10000 // Longer timeout for forecast data
      });

      const forecastData = this.formatForecastData(response.data);
      console.log('5-day forecast data retrieved successfully');
      
      return forecastData;

    } catch (error) {
      console.error('Forecast API Error:', error.message);
      this.handleWeatherError(error, city);
    }
  }

  async getCurrentWeatherByCoords(lat, lon) {
  try {
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      throw new Error('Latitude and longitude are required and must be numbers');
    }

    if (!this.apiKey) {
      throw new Error('OpenWeather API key is not configured');
    }

    console.log(`Fetching current weather for coords: ${lat},${lon}`);

    const response = await axios.get(`${this.baseURL}/weather`, {
      params: {
        lat,
        lon,
        appid: this.apiKey,
        units: 'metric',
        lang: 'en'
      },
      timeout: 5000
    });

    const weatherData = this.formatCurrentWeatherData(response.data);
    console.log('Current weather (coords) retrieved successfully');

    return weatherData;

  } catch (error) {
    console.error('Current Weather (coords) API Error:', error.message);
    this.handleWeatherError(error, `${lat},${lon}`);
  }
}


  async getFiveDayForecastByCoords(lat, lon) {
    try {
      if (typeof lat !== 'number' || typeof lon !== 'number') {
        throw new Error('Latitude and longitude are required and must be numbers');
      }

      if (!this.apiKey) {
        throw new Error('OpenWeather API key is not configured');
      }

      console.log(`Fetching 5-day forecast for coords: ${lat},${lon}`);

      const response = await axios.get(`${this.baseURL}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'en'
        },
        timeout: 10000
      });

      const forecastData = this.formatForecastData(response.data);
      console.log('5-day forecast (coords) retrieved successfully');

      return forecastData;

    } catch (error) {
      console.error('Forecast (coords) API Error:', error.message);
      this.handleWeatherError(error, `${lat},${lon}`);
    }
  }

  // NEW: Get both current weather AND 5-day forecast in one call
  async getCompleteWeatherData(city) {
    try {
      console.log(`Fetching complete weather data for: ${city}`);
      
      // Make both API calls simultaneously for better performance
      const [currentWeather, forecast] = await Promise.all([
        this.getCurrentWeather(city),
        this.getFiveDayForecast(city)
      ]);

      return {
        current: currentWeather,
        forecast: forecast,
        city: currentWeather.city,
        country: currentWeather.country,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Complete weather data error:', error.message);
      throw error;
    }
  }


  async getCompleteWeatherDataByCoords(lat, lon) {
  try {
    console.log(`Fetching complete weather data for coords: ${lat},${lon}`);

    const [currentWeather, forecast] = await Promise.all([
      this.getCurrentWeatherByCoords(lat, lon),
      this.getFiveDayForecastByCoords(lat, lon)
    ]);

    return {
      current: currentWeather,
      forecast: forecast,
      city: currentWeather.city,
      country: currentWeather.country,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Complete weather (coords) error:', error.message);
    throw error;
  }
  }

  formatCurrentWeatherData(data) {
    return {
      city: data.name,
      country: data.sys.country,
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      weather: {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        minTemp: Math.round(data.main.temp_min),
        maxTemp: Math.round(data.main.temp_max),
        description: data.weather[0].description,
        main: data.weather[0].main,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind?.speed || 0,
        windDirection: data.wind?.deg || 0,
        cloudiness: data.clouds?.all || 0,
        visibility: (data.visibility || 0) / 1000 // Convert to km
      },
      sun: {
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('ja-JP'),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('ja-JP')
      },
      timestamp: new Date().toISOString()
    };
  }

  formatForecastData(data) {
    const dailyForecasts = {};
    
    // Group forecast data by day
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const hour = date.getHours();
      
      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = {
          date: dateKey,
          dayName: date.toLocaleDateString('ja-JP', { weekday: 'long' }),
          temperatures: [],
          conditions: [],
          humidity: [],
          windSpeed: [],
          hourlyData: []
        };
      }
      
      const dayForecast = dailyForecasts[dateKey];
      dayForecast.temperatures.push(item.main.temp);
      dayForecast.humidity.push(item.main.humidity);
      dayForecast.windSpeed.push(item.wind?.speed || 0);
      
      // Store unique weather conditions
      const conditionExists = dayForecast.conditions.find(
        c => c.icon === item.weather[0].icon
      );
      if (!conditionExists) {
        dayForecast.conditions.push({
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        });
      }

      // Store hourly data for detailed view
      dayForecast.hourlyData.push({
        time: date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        hour: hour,
        temperature: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        windSpeed: item.wind?.speed || 0,
        humidity: item.main.humidity
      });
    });

    // Process daily summaries
    const processedForecasts = Object.values(dailyForecasts).slice(0, 5).map(day => ({
      date: day.date,
      dayName: day.dayName,
      temperature: {
        min: Math.round(Math.min(...day.temperatures)),
        max: Math.round(Math.max(...day.temperatures)),
        avg: Math.round(day.temperatures.reduce((a, b) => a + b, 0) / day.temperatures.length)
      },
      weather: {
        // Use the most common condition of the day
        main: day.conditions[0]?.main || 'Unknown',
        description: day.conditions[0]?.description || 'No data',
        icon: day.conditions[0]?.icon || '01d',
        allConditions: day.conditions
      },
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      windSpeed: Math.round((day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length) * 10) / 10,
      hourlyData: day.hourlyData
    }));

    return {
      city: data.city.name,
      country: data.city.country,
      dailyForecasts: processedForecasts,
      totalDays: processedForecasts.length
    };
  }

  handleWeatherError(error, city) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || 'Unknown error';
      
      switch (status) {
        case 404:
          throw new Error(`City "${city}" not found. Please check the spelling.`);
        case 401:
          throw new Error('Invalid API key. Please check your OpenWeather API key.');
        case 429:
          throw new Error('API rate limit exceeded. Please try again later.');
        default:
          throw new Error(`Weather API error: ${message}`);
      }
    } else if (error.request) {
      throw new Error('Unable to connect to weather service. Please check your internet connection.');
    } else {
      throw new Error(`Weather service error: ${error.message}`);
    }
  }

  // Helper method to get weather icon URL
  getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }



// buildLightweightWeatherSummary(completeWeatherData) {
//   const current = completeWeatherData?.current?.weather;
//   const next3 = completeWeatherData?.forecast?.dailyForecasts?.slice(0, 3) || [];

//   return {
//     location: {
//       city: completeWeatherData?.city,
//       country: completeWeatherData?.country
//     },
//     current: current ? {
//       temperatureC: current.temperature,
//       feelsLikeC: current.feelsLike,
//       condition: current.description,
//       humidityPct: current.humidity,
//       windMs: current.windSpeed,
//       visibilityKm: current.visibility
//     } : null,
//     next3Days: next3.map(d => ({
//       dayName: d.dayName,
//       minC: d.temperature.min,
//       maxC: d.temperature.max,
//       condition: d.weather.description
//     })),
//     timestamp: new Date().toISOString()
//   };
// }

buildLightweightWeatherSummary(completeWeatherData) {
  const current = completeWeatherData?.current?.weather;
  const next3 = completeWeatherData?.forecast?.dailyForecasts?.slice(0, 3) || [];

  return {
    location: {
      city: completeWeatherData?.city,
      country: completeWeatherData?.country
    },
    current: current ? {
      temperatureC: current.temperature,
      feelsLikeC: current.feelsLike,
      condition: current.description,
      humidityPct: current.humidity,
      windMs: current.windSpeed,
      visibilityKm: current.visibility,
      uvIndex: current.uvIndex,
      sunrise: current.sunrise,
      sunset: current.sunset,
      tag: this.mapWeatherToTag(current.description, current.windSpeed, current.humidity)
    } : null,
    next3Days: next3.map(d => ({
      dayName: d.dayName,
      minC: d.temperature.min,
      maxC: d.temperature.max,
      condition: d.weather.description,
      humidityPct: d.weather.humidity,
      windMs: d.weather.windSpeed,
      visibilityKm: d.weather.visibility,
      precipChancePct: d.weather.precipChance,
      uvIndex: d.weather.uvIndex,
      sunrise: d.weather.sunrise,
      sunset: d.weather.sunset,
      tag: this.mapWeatherToTag(d.weather.description, d.weather.windSpeed, d.weather.humidity)
    })),
    timestamp: new Date().toISOString()
  };
}

// Helper to create a simplified tag
mapWeatherToTag(description, windSpeed, humidity) {
  if (/storm|thunder/i.test(description) || windSpeed > 10) return "stormy";
  if (/rain/i.test(description)) return "rainy";
  if (/cloud/i.test(description)) return "cloudy";
  if (/sun|clear/i.test(description)) return "clear";
  if (humidity > 80) return "humid";
  return "normal";
}

// Optional: produce a compact string for prompts
// formatSummaryForPrompt(summary) {
//   if (!summary?.current) return 'Weather: unavailable';

//   const header = `${summary.location.city}, ${summary.location.country}`;
//   const cur = summary.current;
//   const days = summary.next3Days
//     .map(d => `${d.dayName}: ${d.minC}-${d.maxC}°C, ${d.condition}`)
//     .join(' | ');

//   return [
//     `Weather (${header})`,
//     `Now: ${cur.temperatureC}°C (feels ${cur.feelsLikeC}°C), ${cur.condition}, ` +
//       `Humidity ${cur.humidityPct}%, Wind ${cur.windMs} m/s, Vis ${cur.visibilityKm} km`,
//     `Next 3 days: ${days}`
//   ].join('\n');
// }
formatSummaryForPrompt(summary) {
  if (!summary?.current) return 'Weather: unavailable';

  const lines = [];

  // Helper: map temperature to human label
  const tempLabel = (t) => {
    if (t < 5) return "very cold";
    if (t < 15) return "chilly";
    if (t < 25) return "pleasant";
    if (t < 32) return "warm";
    return "hot";
  };

  // --- Current day ---
  const cur = summary.current;
  let curDesc = `Today in ${summary.location.city}, ${summary.location.country}: `;
  curDesc += `The temperature is ${cur.temperatureC}°C (feels like ${cur.feelsLikeC}°C), which is ${tempLabel(cur.temperatureC)}. `;
  
  // condition
  curDesc += cur.condition ? `The sky is ${cur.condition.toLowerCase()}. ` : '';

  // humidity
  if (cur.humidityPct < 40) {
    curDesc += "It's quite dry. ";
  } else if (cur.humidityPct > 70) {
    curDesc += "The air feels humid. ";
  } else {
    curDesc += "Humidity is comfortable. ";
  }

  // wind
  if (cur.windMs < 2) {
    curDesc += "Winds are calm. ";
  } else if (cur.windMs < 5) {
    curDesc += "A light breeze is present. ";
  } else {
    curDesc += "It’s rather windy. ";
  }

  // visibility
  if (cur.visibilityKm > 10) {
    curDesc += "Visibility is excellent.";
  } else if (cur.visibilityKm > 5) {
    curDesc += "Visibility is good.";
  } else {
    curDesc += "Visibility is limited.";
  }

  lines.push(curDesc.trim());

  // --- Next 3 days ---
  summary.next3Days.forEach(d => {
    let dayDesc = `${d.dayName}: Expect ${d.condition.toLowerCase()} skies with temperatures ranging from ${d.minC}°C to ${d.maxC}°C. `;
    dayDesc += `Overall, it should feel ${tempLabel((d.minC + d.maxC) / 2)}. `;

    if (d.humidityPct) {
      if (d.humidityPct > 70) dayDesc += "It may feel humid. ";
      else if (d.humidityPct < 40) dayDesc += "The air should feel dry. ";
      else dayDesc += "Humidity will be comfortable. ";
    }

    if (d.windMs !== undefined) {
      if (d.windMs < 2) dayDesc += "Winds will be calm. ";
      else if (d.windMs < 5) dayDesc += "A gentle breeze is expected. ";
      else dayDesc += "It could be windy. ";
    }

    if (d.visibilityKm !== undefined) {
      if (d.visibilityKm > 10) dayDesc += "Visibility will be excellent.";
      else if (d.visibilityKm > 5) dayDesc += "Visibility will be decent.";
      else dayDesc += "Visibility may be limited.";
    }

    lines.push(dayDesc.trim());
  });

  return lines.join('\n\n'); // separate each day by blank line
}



 
}








module.exports = new WeatherService();