// Browser Speech Recognition (STT) and Speech Synthesis (TTS)
// Comprehensive fallback for browsers and regional voice availability

export interface SpeechRecognitionResultState {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
}

// BCP 47 language tags for Speech Recognition & Synthesis
export const LANGUAGE_SPEECH_CODES: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  as: 'as-IN', // Assamese BCP-47 (browser will fallback to Hindi/English if Assamese voice is missing)
};

export function checkSpeechRecognitionSupport(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

export function checkSpeechSynthesisSupport(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

let activeRecognitionInstance: any = null;

export function startSpeechRecognition(
  language: string,
  onResult: (text: string) => void,
  onError: (err: string) => void,
  onEnd: () => void
) {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser. Please type your message.');
    return null;
  }

  try {
    if (activeRecognitionInstance) {
      activeRecognitionInstance.abort();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = LANGUAGE_SPEECH_CODES[language] || 'en-IN';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      onResult(finalTranscript);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition event error:', event.error);
      if (event.error === 'not-allowed') {
        onError('Microphone permission denied. Please allow microphone access in browser settings.');
      } else if (event.error === 'no-speech') {
        onError('No speech detected. Please try speaking again.');
      } else {
        onError(`Voice recognition error: ${event.error}`);
      }
      onEnd();
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();
    activeRecognitionInstance = recognition;
    return recognition;
  } catch (err: any) {
    onError(err.message || 'Failed to start microphone.');
    onEnd();
    return null;
  }
}

export function stopSpeechRecognition() {
  if (activeRecognitionInstance) {
    try {
      activeRecognitionInstance.stop();
    } catch (e) {
      // Ignore
    }
    activeRecognitionInstance = null;
  }
}

export function speakText(text: string, language: string, onEnd?: () => void) {
  if (!checkSpeechSynthesisSupport()) {
    console.warn('SpeechSynthesis is not supported on this browser.');
    return false;
  }

  // Stop any currently playing speech first
  window.speechSynthesis.cancel();

  const cleanText = text.replace(/[*#_`]/g, ''); // strip markdown formatting
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.95; // Slightly slower for clear agricultural comprehension
  utterance.pitch = 1.0;

  const targetCode = LANGUAGE_SPEECH_CODES[language] || 'en-IN';
  utterance.lang = targetCode;

  // Attempt to select the best available regional voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(targetCode.slice(0, 2)));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
