"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from './use-language';

interface UseSpeechRecognitionOptions {
  onTranscript: (transcript: string) => void;
  onError?: (error: any) => void;
}

export const useSpeechRecognition = ({ onTranscript, onError }: UseSpeechRecognitionOptions) => {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { language } = useLanguage();
  const [transcript, setTranscript] = useState('');

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);
  
  const startRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError?.(new Error('Speech recognition not supported'));
      return;
    }

    if (recognitionRef.current) {
        stopRecognition();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'kn' ? 'kn-IN' : 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsRecognizing(true);
      setTranscript('');
    };

    recognition.onend = () => {
      setIsRecognizing(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecognizing(false);
      onError?.(event.error);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
        onTranscript(finalTranscript);
        // Once we have a final result, stop recognition
        stopRecognition();
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [language, onTranscript, onError, stopRecognition]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopRecognition();
    };
  }, [stopRecognition]);

  return { isRecognizing, transcript, startRecognition, stopRecognition };
};
