// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Cloud, 
  Volume2, 
  MapPin, 
  ArrowRight,
  Sun,
  Umbrella,
  Thermometer,
  Wind,
  Star
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const HomePage = ({ onStartChat }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Japanese locations data
  const japaneseLocations = [
    {
      name: 'Tokyo',
      image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop&auto=format',
      description: 'The bustling capital with modern skyscrapers and traditional temples',
      alt: 'Tokyo skyline at night'
    },
    {
      name: 'Kyoto',
      image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400&h=300&fit=crop&auto=format',
      description: 'Ancient capital famous for temples, gardens, and traditional culture',
      alt: 'Kyoto bamboo forest'
    },
    {
      name: 'Mount Fuji',
      image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&fit=crop&auto=format',
      description: 'Japan\'s iconic mountain and spiritual symbol',
      alt: 'Mount Fuji with cherry blossoms'
    },
    {
      name: 'Osaka',
      image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400&h=300&fit=crop&auto=format',
      description: 'Known as Japan\'s kitchen with amazing food culture',
      alt: 'Osaka castle and city'
    }
  ];

  // Features data
  const features = [
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Real-time Weather",
      description: "Get current weather and 5-day forecasts for any Japanese city with detailed conditions",
      color: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: <Volume2 className="w-8 h-8" />,
      title: "Japanese Voice Input",
      description: "Speak naturally in Japanese - our AI understands your travel needs and responds intelligently",
      color: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Smart Travel Suggestions",
      description: "AI-powered recommendations based on weather conditions, local culture, and your preferences",
      color: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: <Thermometer className="w-8 h-8" />,
      title: "Fashion Advice",
      description: "Get clothing recommendations based on temperature, humidity, and weather conditions",
      color: "from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30",
      iconColor: "text-pink-600 dark:text-pink-400"
    },
    {
      icon: <Wind className="w-8 h-8" />,
      title: "Activity Planning",
      description: "Outdoor and indoor activity suggestions tailored to current and upcoming weather",
      color: "from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30",
      iconColor: "text-cyan-600 dark:text-cyan-400"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Cultural Integration",
      description: "Recommendations consider Japanese customs, seasonal events, and local preferences",
      color: "from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30",
      iconColor: "text-yellow-600 dark:text-yellow-400"
    }
  ];

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % japaneseLocations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [japaneseLocations.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 transition-colors duration-200">
      {/* Theme Toggle in top right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 text-pink-200 dark:text-pink-400 opacity-20 dark:opacity-10 animate-float">🌸</div>
        <div className="absolute top-40 right-32 w-24 h-24 text-blue-200 dark:text-blue-400 opacity-25 dark:opacity-15 animate-float animation-delay-1000">⛩️</div>
        <div className="absolute bottom-40 left-32 w-28 h-28 text-red-200 dark:text-red-400 opacity-20 dark:opacity-10 animate-float animation-delay-2000">🏯</div>
        <div className="absolute bottom-60 right-20 w-20 h-20 text-green-200 dark:text-green-400 opacity-30 dark:opacity-20 animate-float animation-delay-1500">🌿</div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            {/* Main Title */}
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight transition-colors duration-200">
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Smart Travel
              </span>
              <br />
              <span className="text-gray-800 dark:text-gray-200">Assistant</span>
            </h1>
            
            {/* Japanese Subtitle */}
            <div className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-8 font-light transition-colors duration-200">
              🌤️ スマートトラベルアシスタント🗾
            </div>
            
            {/* Description */}
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12 transition-colors duration-200">
              Your intelligent Japanese travel companion that combines real-time weather data 
              with AI-powered suggestions. Speak in Japanese and get personalized travel recommendations 
              for any city in Japan, perfectly matched to current weather conditions.
            </p>

            {/* CTA Button */}
            <button
              onClick={onStartChat}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex items-center mx-auto"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Start Chat Experience
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Quick Stats */}
            <div className="mt-12 flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              <div className="flex items-center">
                <Sun className="w-4 h-4 mr-1" />
                Real-time Weather
              </div>
              <div className="flex items-center">
                <Volume2 className="w-4 h-4 mr-1" />
                Japanese Voice AI
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Japanese Cities
              </div>
            </div>
          </div>

          {/* Featured Image Gallery */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 transition-colors duration-200">
              Explore Beautiful Japan 🇯🇵
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {japaneseLocations.map((location, index) => (
                <div 
                  key={location.name}
                  className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                    index === currentImageIndex ? 'ring-4 ring-blue-500 dark:ring-blue-400 ring-opacity-50' : ''
                  }`}
                >
                  <img
                    src={location.image}
                    alt={location.alt}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-1">{location.name}</h3>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {location.description}
                    </p>
                  </div>
                  {index === currentImageIndex && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-blue-500 dark:bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4 transition-colors duration-200">
              Intelligent Travel Planning
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12 transition-colors duration-200">
              Our AI combines weather data with cultural knowledge to provide 
              personalized suggestions for your Japanese adventure
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 border border-white/40 dark:border-slate-700/40 hover:transform hover:scale-105"
                >
                  <div className={`bg-gradient-to-br ${feature.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={feature.iconColor}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-200">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 transition-colors duration-200">
              How It Works ⚡
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-500 dark:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg transition-colors duration-200">
                    1
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-200">🎤 Speak in Japanese</h3>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    Click the microphone and speak naturally in Japanese about your travel plans
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-500 dark:bg-purple-700 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg transition-colors duration-200">
                    2
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-200">🌤️ Weather Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    Our AI gets real-time weather data and analyzes conditions for your chosen city
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-500 dark:bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg transition-colors duration-200">
                    3
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-200">✨ Smart Suggestions</h3>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    Receive personalized recommendations for activities, clothing, and dining
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-12 border border-white/40 dark:border-slate-700/40 transition-colors duration-200">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 transition-colors duration-200">
                Ready to Start Your Japanese Adventure? 🌸
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto transition-colors duration-200">
                Get weather-aware travel suggestions powered by AI. 
                Perfect for travelers who want to make the most of every day in Japan.
              </p>
              
              <button
                onClick={onStartChat}
                className="bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-600 dark:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transform transition-all duration-300 inline-flex items-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Begin Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;