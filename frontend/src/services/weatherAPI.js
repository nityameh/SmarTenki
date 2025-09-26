import axios from 'axios';

// Base API URL for weather endpoints
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance for weather API
const weatherAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
weatherAPI.interceptors.request.use(
  (config) => {
    // Log weather requests for debugging
    console.log('🌤️ [weatherAPI] Request', { url: config.url });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
weatherAPI.interceptors.response.use(
  (response) => {
    console.log('🌤️ [weatherAPI] Response received');
    return response;
  },
  (error) => {
    console.error('🌩️ [weatherAPI] Error', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Weather API functions
export const getCurrentWeather = async (city) => {
  try {
    const response = await weatherAPI.get(`/weather/current/${city}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || `Failed to get weather for ${city}`);
  }
};

// Removed forecast endpoint as backend exposes /weather/complete instead

export const getCompleteWeatherData = async (city) => {
  try {
    const response = await weatherAPI.get(`/weather/complete/${city}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || `Failed to get complete weather data for ${city}`);
  }
};

// Helper function to format weather data for display
export const formatWeatherData = (weatherData) => {
  if (!weatherData || !weatherData.data) {
    return null;
  }

  const data = weatherData.data;
  
  return {
    current: {
      city: data.current?.city || data.city,
      country: data.current?.country || data.country,
      temperature: data.current?.weather?.temperature,
      feelsLike: data.current?.weather?.feelsLike,
      description: data.current?.weather?.description,
      humidity: data.current?.weather?.humidity,
      windSpeed: data.current?.weather?.windSpeed,
      icon: data.current?.weather?.icon,
    },
    forecast: data.forecast?.dailyForecasts?.slice(0, 5) || [],
    recommendations: data.recommendations || null
  };
};

// Get weather icon URL
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export default {
  getCurrentWeather,
  getWeatherForecast,
  getCompleteWeatherData,
  formatWeatherData,
  getWeatherIconUrl
};