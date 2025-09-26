
require('dotenv').config();
const translationService = require('./services/translationService');

async function testTranslation() {
  console.log('Testing Japanese to English Translation...\n');

  const testTexts = [
    '今日東京で何をすべきですか？',
    '天気はどうですか？',
    '雨が降っていますか？',
    '観光地を教えてください',
    'Hello this is English', // Should detect as not Japanese
  ];

  for (const text of testTexts) {
    try {
      console.log(`Original: ${text}`);
      
      if (translationService.isJapanese(text)) {
        const result = await translationService.translateJapaneseToEnglish(text);
        console.log(`English: ${result.translatedText}`);
      } else {
        console.log('Not Japanese - skipping translation');
      }
      
      console.log('---');
    } catch (error) {
      console.log(`Error: ${error.message}`);
      console.log('---');
    }
  }
}

if (require.main === module) {
  testTranslation();
}