// backend/services/contextService.js
class ContextService {
  constructor() {
    // In-memory storage (use Redis in production)
    this.sessions = new Map();
    this.defaultCity = 'Tokyo';
    
    // Clean up old sessions every hour
    setInterval(() => this.cleanup(24), 3600000);
  }

  // Get or create session context
  getContext(sessionId) {
    if (!sessionId) {
      sessionId = this.generateSessionId();
    }

    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        sessionId: sessionId,
        currentCity: this.defaultCity,
        cityHistory: [this.defaultCity],
        weatherCache: new Map(),
        messageHistory: [],
        lastActivity: Date.now(),
        messageCount: 0,
        preferences: {
          language: 'en',
          tempUnit: 'celsius'
        }
      });
    }

    const context = this.sessions.get(sessionId);
    context.lastActivity = Date.now();
    return context;
  }

  // Generate unique session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Update current city
  updateCity(sessionId, city) {
    if (!city) return null;

    const context = this.getContext(sessionId);
    const normalizedCity = this.normalizeCity(city);

    if (normalizedCity !== context.currentCity) {
      console.log(`📍 City updated for session ${sessionId}: ${context.currentCity} → ${normalizedCity}`);
      
      context.currentCity = normalizedCity;
      context.cityHistory.push(normalizedCity);
      
      // Keep only last 10 cities in history
      if (context.cityHistory.length > 10) {
        context.cityHistory = context.cityHistory.slice(-10);
      }
      
      // Don't clear weather cache, just mark for refresh
      context.weatherCacheExpired = true;
    }

    context.messageCount++;
    return context;
  }

  // Get current city for session
  getCurrentCity(sessionId) {
    const context = this.getContext(sessionId);
    return context.currentCity;
  }

  // Cache weather data
  cacheWeather(sessionId, city, weatherData) {
    const context = this.getContext(sessionId);
    const normalizedCity = this.normalizeCity(city);
    
    context.weatherCache.set(normalizedCity, {
      data: weatherData,
      timestamp: Date.now(),
      city: normalizedCity
    });
    
    context.weatherCacheExpired = false;
    console.log(`☁️ Weather cached for ${normalizedCity} in session ${sessionId}`);
  }

  // Get cached weather (with TTL)
  getCachedWeather(sessionId, city, maxAgeMinutes = 15) {
    const context = this.getContext(sessionId);
    const normalizedCity = this.normalizeCity(city);
    const cached = context.weatherCache.get(normalizedCity);

    if (!cached) {
      console.log(`❌ No cached weather for ${normalizedCity}`);
      return null;
    }

    const ageMinutes = (Date.now() - cached.timestamp) / 60000;
    
    if (ageMinutes > maxAgeMinutes) {
      console.log(`⏰ Cached weather for ${normalizedCity} expired (${ageMinutes.toFixed(1)} min old)`);
      context.weatherCache.delete(normalizedCity);
      return null;
    }

    console.log(`✅ Using cached weather for ${normalizedCity} (${ageMinutes.toFixed(1)} min old)`);
    return cached.data;
  }

  // Add message to history
  addMessage(sessionId, message, response) {
    const context = this.getContext(sessionId);
    
    context.messageHistory.push({
      timestamp: Date.now(),
      userMessage: message,
      assistantResponse: response,
      city: context.currentCity
    });

    // Keep only last 20 messages
    if (context.messageHistory.length > 20) {
      context.messageHistory = context.messageHistory.slice(-20);
    }
  }

  // Get conversation history
  getHistory(sessionId, limit = 5) {
    const context = this.getContext(sessionId);
    return context.messageHistory.slice(-limit);
  }

  // Check if location was mentioned recently
  hasRecentLocationMention(sessionId, withinMinutes = 5) {
    const context = this.getContext(sessionId);
    const recentTime = Date.now() - (withinMinutes * 60000);
    
    return context.messageHistory.some(msg => 
      msg.timestamp > recentTime && msg.city !== context.currentCity
    );
  }

  // Normalize city name for consistency
  normalizeCity(city) {
    if (!city) return this.defaultCity;
    
    // Handle district to city mapping
    const districtToCity = {
      'shibuya': 'Tokyo',
      'shinjuku': 'Tokyo',
      'harajuku': 'Tokyo',
      'ginza': 'Tokyo',
      'asakusa': 'Tokyo',
      'akihabara': 'Tokyo',
      'roppongi': 'Tokyo',
      'minato': 'Tokyo',
      'chiyoda': 'Tokyo',
      'meguro': 'Tokyo',
      'namba': 'Osaka',
      'umeda': 'Osaka',
      'dotonbori': 'Osaka',
      'gion': 'Kyoto',
      'arashiyama': 'Kyoto'
    };

    const normalized = city.toLowerCase().trim();
    const mappedCity = districtToCity[normalized] || city;
    
    // Capitalize first letter
    return mappedCity.charAt(0).toUpperCase() + mappedCity.slice(1);
  }

  // Clean up old sessions
  cleanup(maxAgeHours = 24) {
    const maxAge = maxAgeHours * 3600000; // Convert to milliseconds
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, context] of this.sessions.entries()) {
      if ((now - context.lastActivity) > maxAge) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} old sessions`);
    }
  }

  // Get session stats
  getStats(sessionId) {
    const context = this.getContext(sessionId);
    return {
      sessionId: sessionId,
      currentCity: context.currentCity,
      messageCount: context.messageCount,
      citiesVisited: [...new Set(context.cityHistory)].length,
      sessionAge: Math.round((Date.now() - context.lastActivity) / 60000) + ' minutes',
      cachedCities: Array.from(context.weatherCache.keys())
    };
  }

  // Clear session
  clearSession(sessionId) {
    if (this.sessions.has(sessionId)) {
      this.sessions.delete(sessionId);
      console.log(`🗑️ Session ${sessionId} cleared`);
      return true;
    }
    return false;
  }
}

module.exports = new ContextService();