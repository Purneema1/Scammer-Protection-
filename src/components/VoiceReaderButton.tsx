import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { speakVerdict, stopSpeaking, isSpeechSynthesisSupported } from '../utils/voiceAssistant';
import { Language } from '../types';

interface VoiceReaderButtonProps {
  textToRead: string;
  lang: Language;
}

export const VoiceReaderButton: React.FC<VoiceReaderButtonProps> = ({ textToRead, lang }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isNe = lang === 'ne';
  const supported = isSpeechSynthesisSupported();

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  if (!supported) return null;

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakVerdict(textToRead, lang, () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <button
      onClick={handleToggleSpeak}
      className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer shadow-sm active:scale-95 ${
        isSpeaking
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
          : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/40'
      }`}
      title={isNe ? 'नतिजा नेपाली आवाजमा सुन्नुहोस्' : 'Listen to verdict in spoken voice'}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-4 h-4 text-amber-400" />
          <span>{isNe ? 'आवाज बन्द गर्नुहोस्' : 'Stop Audio'}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span>{isNe ? 'आवाजमा सुन्नुहोस् (Voice)' : 'Listen to Verdict'}</span>
        </>
      )}
    </button>
  );
};
