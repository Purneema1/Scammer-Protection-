export interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  startListening: (lang?: string) => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Spoken TTS Player
export function speakVerdict(text: string, lang: 'ne' | 'en', onEnd?: () => void) {
  if (!isSpeechSynthesisSupported()) return;

  // Stop any active utterance first
  window.speechSynthesis.cancel();

  // Clean text of markdown asterisks and technical tags for pleasant speech
  const cleanText = text
    .replace(/[#*`_~]/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Attempt to select Nepali voice or Hindi voice for Devanagari pronunciation
  const voices = window.speechSynthesis.getVoices();
  if (lang === 'ne') {
    const neVoice = voices.find((v) => v.lang.startsWith('ne') || v.lang.includes('Nepali'));
    const hiVoice = voices.find((v) => v.lang.startsWith('hi') || v.lang.includes('Hindi'));
    if (neVoice) {
      utterance.voice = neVoice;
      utterance.lang = 'ne-NP';
    } else if (hiVoice) {
      utterance.voice = hiVoice;
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'ne-NP';
    }
  } else {
    const enVoice = voices.find((v) => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
    utterance.lang = 'en-US';
  }

  utterance.rate = 0.95; // slightly slower for maximum clarity
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
