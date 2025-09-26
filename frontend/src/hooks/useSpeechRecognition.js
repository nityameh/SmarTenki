import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechRecognition = (language = 'ja-JP') => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const hasProcessedRef = useRef(false);

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  // Initialize recognition only once
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      isListeningRef.current = true;
      setError(null);
      hasProcessedRef.current = false;
    };

    recognition.onresult = (event) => {
      if (hasProcessedRef.current) return; // Prevent double processing
      
      const result = event.results[0][0].transcript;
      console.log('Speech recognized:', result);
      
      setTranscript(result);
      hasProcessedRef.current = true;
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied.');
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
      
      setIsListening(false);
      isListeningRef.current = false;
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      isListeningRef.current = false;
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, isSupported]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListeningRef.current) {
      return;
    }

    try {
      console.log('Starting speech recognition...');
      setTranscript(''); // Clear previous transcript
      setError(null);
      hasProcessedRef.current = false;
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setError('Failed to start voice recognition');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
    hasProcessedRef.current = false;
  }, []);

  return {
    transcript,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  };
};