import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const VoiceInput = ({ onTranscript, disabled = false, compact = false }) => {
  const { transcript, isListening, startListening, stopListening, resetTranscript } = useSpeechRecognition('ja-JP');
  const lastProcessedRef = useRef('');
  const [showTranscript, setShowTranscript] = useState(false);

  const processJapaneseInput = useCallback(async (japaneseText) => {
    try {
      console.log('Processing Japanese input:', japaneseText);

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: japaneseText, 
          context: 'travel' 
        })
      });

      const data = await response.json();

      if (data.success) {
        onTranscript(data.data.translatedText, japaneseText);
      } else {
        console.error('Translation failed:', data.error);
        onTranscript(japaneseText, japaneseText);
      }

    } catch (error) {
      console.error('Translation error:', error);
      onTranscript(japaneseText, japaneseText);
    }
    
    setShowTranscript(false);
  }, [onTranscript]);

  useEffect(() => {
    const trimmed = (transcript || '').trim();
    if (!trimmed) {
      return;
    }

    if (lastProcessedRef.current === trimmed) {
      return;
    }

    stopListening();
    lastProcessedRef.current = trimmed;
    processJapaneseInput(trimmed);
  }, [transcript, processJapaneseInput, stopListening]);

  const handleVoiceClick = useCallback(() => {
    if (disabled) return;
    if (isListening) {
      stopListening();
      setShowTranscript(false);
      return;
    }
    lastProcessedRef.current = '';
    resetTranscript();
    startListening();
    setShowTranscript(true);
  }, [disabled, isListening, startListening, stopListening, resetTranscript]);

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={handleVoiceClick}
          disabled={disabled}
          className={`p-3 rounded-full transition-all duration-200 shadow-md ${
            isListening
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-lg'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isListening ? 'Stop recording' : 'Start voice input (Japanese)'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        
        {isListening && (
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full shadow-lg animate-pulse whitespace-nowrap text-sm">
            日本語で話してください...
          </div>
        )}
        
        {transcript && showTranscript && !isListening && (
          <div className="absolute bottom-full mb-2 left-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2 rounded-lg min-w-[200px] max-w-xs border border-purple-200 dark:border-purple-700 shadow-lg">
            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Japanese:</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{transcript}</p>
            <p className="text-xs text-pink-600 dark:text-pink-400 font-medium mt-1">Translating...</p>
          </div>
        )}
      </div>
    );
  }

  // Full-size mode
  return (
    <div className="flex flex-col items-center space-y-3">
      <button
        onClick={handleVoiceClick}
        disabled={disabled}
        className={`p-4 rounded-full transition-all duration-200 shadow-lg ${
          isListening
            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse scale-110'
            : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-xl hover:scale-105'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      {isListening && (
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 text-sm animate-pulse font-medium">
          日本語で話してください... (Speak in Japanese...)
        </p>
      )}

      {transcript && !isListening && (
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg max-w-md border border-purple-200 dark:border-purple-700">
          <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Japanese:</p>
          <p className="text-gray-900 dark:text-gray-100 mb-2">{transcript}</p>
          <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">Translating...</p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;