const { GoogleGenerativeAI } = require('@google/generative-ai');

class LocationExtractionService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Comprehensive Japanese cities and districts
    this.japaneseCities = {
      // === MAJOR CITIES ===
      'tokyo': ['tokyo', 'tokio', '東京', 'とうきょう'],'osaka': ['osaka', 'ōsaka', '大阪', 'おおさか'],'kyoto': ['kyoto', 'kyōto', '京都', 'きょうと'],'yokohama': ['yokohama', '横浜', 'よこはま'],'nagoya': ['nagoya', '名古屋', 'なごや'],'sapporo': ['sapporo', '札幌', 'さっぽろ'],
      'fukuoka': ['fukuoka', '福岡', 'ふくおか'],'kobe': ['kobe', 'kōbe', '神戸', 'こうべ'],'kawasaki': ['kawasaki', '川崎', 'かわさき'],
      'saitama': ['saitama', '埼玉', 'さいたま'],'hiroshima': ['hiroshima', '広島', 'ひろしま'],'sendai': ['sendai', '仙台', 'せんだい'],
      'chiba': ['chiba', '千葉', 'ちば'],'kitakyushu': ['kitakyushu', '北九州', 'きたきゅうしゅう'],'sakai': ['sakai', '堺', 'さかい'],
      'niigata': ['niigata', '新潟', 'にいがた'],'hamamatsu': ['hamamatsu', '浜松', 'はままつ'],'kumamoto': ['kumamoto', '熊本', 'くまもと'],
      'sagamihara': ['sagamihara', '相模原', 'さがみはら'],'okayama': ['okayama', '岡山', 'おかやま'],'shizuoka': ['shizuoka', '静岡', 'しずおか'],
      'kagoshima': ['kagoshima', '鹿児島', 'かごしま'],'funabashi': ['funabashi', '船橋', 'ふなばし'],'kawaguchi': ['kawaguchi', '川口', 'かわぐち'],
      'himeji': ['himeji', '姫路', 'ひめじ'],'matsuyama': ['matsuyama', '松山', 'まつやま'],'utsunomiya': ['utsunomiya', '宇都宮', 'うつのみや'],
      'matsudo': ['matsudo', '松戸', 'まつど'],
      'nishinomiya': ['nishinomiya', '西宮', 'にしのみや'],'kurashiki': ['kurashiki', '倉敷', 'くらしき'],'ichikawa': ['ichikawa', '市川', 'いちかわ'],
      'fukuyama': ['fukuyama', '福山', 'ふくやま'],'amagasaki': ['amagasaki', '尼崎', 'あまがさき'],'kanazawa': ['kanazawa', '金沢', 'かなざわ'],
      'nagasaki': ['nagasaki', '長崎', 'ながさき'],'takamatsu': ['takamatsu', '高松', 'たかまつ'],'toyama': ['toyama', '富山', 'とやま'],
      'gifu': ['gifu', '岐阜', 'ぎふ'],'wakayama': ['wakayama', '和歌山', 'わかやま'],'nara': ['nara', '奈良', 'なら'],
      'takasaki': ['takasaki', '高崎', 'たかさき'],'oita': ['oita', 'ōita', '大分', 'おおいた'],'tsu': ['tsu', '津', 'つ'],
      'akita': ['akita', '秋田', 'あきた'],'kochi': ['kochi', 'kōchi', '高知', 'こうち'],'miyazaki': ['miyazaki', '宮崎', 'みやざき'],
      'naha': ['naha', '那覇', 'なは'],'aomori': ['aomori', '青森', 'あおもり'],'morioka': ['morioka', '盛岡', 'もりおか'],
      'fukushima': ['fukushima', '福島', 'ふくしま'],'yamagata': ['yamagata', '山形', 'やまがた'],'maebashi': ['maebashi', '前橋', 'まえばし'],
      'mito': ['mito', '水戸', 'みと'],'kofu': ['kofu', 'kōfu', '甲府', 'こうふ'],'nagano': ['nagano', '長野', 'ながの'],
      'matsumoto': ['matsumoto', '松本', 'まつもと'],'fukui': ['fukui', '福井', 'ふくい'],'otsu': ['otsu', 'ōtsu', '大津', 'おおつ'],
      'tottori': ['tottori', '鳥取', 'とっとり'],'matsue': ['matsue', '松江', 'まつえ'],'yamaguchi': ['yamaguchi', '山口', 'やまぐち'],
      'tokushima': ['tokushima', '徳島', 'とくしま'],'saga': ['saga', '佐賀', 'さが'],
      
      // === POPULAR TOURIST CITIES ===
      'nikko': ['nikko', 'nikkō', '日光', 'にっこう'],'kamakura': ['kamakura', '鎌倉', 'かまくら'],'hakone': ['hakone', '箱根', 'はこね'],
      'takayama': ['takayama', '高山', 'たかやま'],'ise': ['ise', '伊勢', 'いせ'],'beppu': ['beppu', '別府', 'べっぷ'],
      'atami': ['atami', '熱海', 'あたみ'],'otaru': ['otaru', '小樽', 'おたる'],'hakodate': ['hakodate', '函館', 'はこだて'],
      'asahikawa': ['asahikawa', '旭川', 'あさひかわ'],'kushiro': ['kushiro', '釧路', 'くしろ'],'obihiro': ['obihiro', '帯広', 'おびひろ'],
      'karuizawa': ['karuizawa', '軽井沢', 'かるいざわ'],'furano': ['furano', '富良野', 'ふらの'],'noboribetsu': ['noboribetsu', '登別', 'のぼりべつ'],
      
      // === TOKYO DISTRICTS/AREAS ===
      'shibuya': ['shibuya', '渋谷', 'しぶや'],'shinjuku': ['shinjuku', '新宿', 'しんじゅく'],'harajuku': ['harajuku', '原宿', 'はらじゅく'],
      'ginza': ['ginza', '銀座', 'ぎんざ'],'asakusa': ['asakusa', '浅草', 'あさくさ'],'akihabara': ['akihabara', '秋葉原', 'あきはばら'],
      'roppongi': ['roppongi', '六本木', 'ろっぽんぎ'],'ueno': ['ueno', '上野', 'うえの'],'ikebukuro': ['ikebukuro', '池袋', 'いけぶくろ'],
      'odaiba': ['odaiba', 'お台場', 'おだいば'],'shinagawa': ['shinagawa', '品川', 'しながわ'],'ebisu': ['ebisu', 'えびす', '恵比寿'],
      'meguro': ['meguro', '目黒', 'めぐろ'],'nakano': ['nakano', '中野', 'なかの'],'kichijoji': ['kichijoji', '吉祥寺', 'きちじょうじ'],
      'shimokitazawa': ['shimokitazawa', '下北沢', 'しもきたざわ'],'daikanyama': ['daikanyama', '代官山', 'だいかんやま'],'omotesando': ['omotesando', '表参道', 'おもてさんどう'],
      'kagurazaka': ['kagurazaka', '神楽坂', 'かぐらざか'],'yanaka': ['yanaka', '谷中', 'やなか'],'ryogoku': ['ryogoku', '両国', 'りょうごく'],
      'tsukiji': ['tsukiji', '築地', 'つきじ'],'toyosu': ['toyosu', '豊洲', 'とよす'],'marunouchi': ['marunouchi', '丸の内', 'まるのうち'],
      'nihonbashi': ['nihonbashi', '日本橋', 'にほんばし'],'kabukicho': ['kabukicho', '歌舞伎町', 'かぶきちょう'],
      
      // === OSAKA DISTRICTS/AREAS ===
      'namba': ['namba', 'nanba', '難波', 'なんば'],
      'umeda': ['umeda', '梅田', 'うめだ'],
      'dotonbori': ['dotonbori', 'dōtonbori', '道頓堀', 'どうとんぼり'],
      'shinsaibashi': ['shinsaibashi', '心斎橋', 'しんさいばし'],
      'tennoji': ['tennoji', 'tennōji', '天王寺', 'てんのうじ'],
      'kitashinchi': ['kitashinchi', '北新地', 'きたしんち'],
      'shinsekai': ['shinsekai', '新世界', 'しんせかい'],
      'amerikamura': ['amerikamura', 'アメリカ村', 'あめりかむら'],
      'nakanoshima': ['nakanoshima', '中之島', 'なかのしま'],
      
      // === KYOTO DISTRICTS/AREAS ===
      'gion': ['gion', '祇園', 'ぎおん'],
      'arashiyama': ['arashiyama', '嵐山', 'あらしやま'],
      'higashiyama': ['higashiyama', '東山', 'ひがしやま'],
      'kawaramachi': ['kawaramachi', '河原町', 'かわらまち'],
      'pontocho': ['pontocho', 'pontochō', '先斗町', 'ぽんとちょう'],
      'fushimi': ['fushimi', '伏見', 'ふしみ'],
      'kiyomizu': ['kiyomizu', '清水', 'きよみず'],
      'nijo': ['nijo', 'nijō', '二条', 'にじょう'],
      
      // === YOKOHAMA DISTRICTS ===
      'minato-mirai': ['minato mirai', 'minatomirai', 'みなとみらい'],
      'chinatown-yokohama': ['chinatown', '中華街', 'ちゅうかがい'],
      'motomachi': ['motomachi', '元町', 'もとまち'],
      'kannai': ['kannai', '関内', 'かんない'],
      
      // === NAGOYA DISTRICTS ===
      'sakae': ['sakae', '栄', 'さかえ'],
      'osu': ['osu', 'ōsu', '大須', 'おおす'],
      'meieki': ['meieki', '名駅', 'めいえき'],
      
      // === KOBE DISTRICTS ===
      'sannomiya': ['sannomiya', '三宮', 'さんのみや'],
      'motomachi-kobe': ['motomachi', '元町', 'もとまち'],
      'kitano': ['kitano', '北野', 'きたの'],
      
      // === FUKUOKA DISTRICTS ===
      'hakata': ['hakata', '博多', 'はかた'],
      'tenjin': ['tenjin', '天神', 'てんじん'],
      'nakasu': ['nakasu', '中洲', 'なかす'],
      
      // === SAPPORO DISTRICTS ===
      'susukino': ['susukino', 'すすきの', '薄野'],
      'odori': ['odori', 'ōdori', '大通', 'おおどおり'],
      'maruyama': ['maruyama', '円山', 'まるやま']
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

  // Map districts to their parent cities - EXPANDED
  mapDistrictToCity(location) {
    const districtMap = {
      // Tokyo districts
      'shibuya': 'Tokyo',
      'shinjuku': 'Tokyo',
      'harajuku': 'Tokyo',
      'ginza': 'Tokyo',
      'asakusa': 'Tokyo',
      'akihabara': 'Tokyo',
      'roppongi': 'Tokyo',
      'ueno': 'Tokyo',
      'ikebukuro': 'Tokyo',
      'odaiba': 'Tokyo',
      'shinagawa': 'Tokyo',
      'ebisu': 'Tokyo',
      'meguro': 'Tokyo',
      'nakano': 'Tokyo',
      'kichijoji': 'Tokyo',
      'shimokitazawa': 'Tokyo',
      'daikanyama': 'Tokyo',
      'omotesando': 'Tokyo',
      'kagurazaka': 'Tokyo',
      'yanaka': 'Tokyo',
      'ryogoku': 'Tokyo',
      'tsukiji': 'Tokyo',
      'toyosu': 'Tokyo',
      'marunouchi': 'Tokyo',
      'nihonbashi': 'Tokyo',
      'kabukicho': 'Tokyo',
      
      // Osaka districts
      'namba': 'Osaka',
      'umeda': 'Osaka',
      'dotonbori': 'Osaka',
      'shinsaibashi': 'Osaka',
      'tennoji': 'Osaka',
      'kitashinchi': 'Osaka',
      'shinsekai': 'Osaka',
      'amerikamura': 'Osaka',
      'nakanoshima': 'Osaka',
      
      // Kyoto districts
      'gion': 'Kyoto',
      'arashiyama': 'Kyoto',
      'higashiyama': 'Kyoto',
      'kawaramachi': 'Kyoto',
      'pontocho': 'Kyoto',
      'fushimi': 'Kyoto',
      'kiyomizu': 'Kyoto',
      'nijo': 'Kyoto',
      
      // Yokohama districts
      'minato-mirai': 'Yokohama',
      'chinatown-yokohama': 'Yokohama',
      'motomachi': 'Yokohama',
      'kannai': 'Yokohama',
      
      // Nagoya districts
      'sakae': 'Nagoya',
      'osu': 'Nagoya',
      'meieki': 'Nagoya',
      
      // Kobe districts
      'sannomiya': 'Kobe',
      'motomachi-kobe': 'Kobe',
      'kitano': 'Kobe',
      
      // Fukuoka districts
      'hakata': 'Fukuoka',
      'tenjin': 'Fukuoka',
      'nakasu': 'Fukuoka',
      
      // Sapporo districts
      'susukino': 'Sapporo',
      'odori': 'Sapporo',
      'maruyama': 'Sapporo'
    };

    const normalized = location.toLowerCase();
    return districtMap[normalized] || location;
  }

  capitalizeCity(city) {
    if (!city || typeof city !== 'string') return city;
    
    // Handle special cases
    const specialCases = {
      'minato-mirai': 'Minato Mirai',
      'chinatown-yokohama': 'Yokohama Chinatown',
      'motomachi-kobe': 'Kobe Motomachi'
    };
    
    const lower = city.toLowerCase();
    if (specialCases[lower]) {
      return specialCases[lower];
    }
    
    return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  }
}

module.exports = new LocationExtractionService();