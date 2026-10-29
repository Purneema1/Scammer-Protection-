import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  PhoneCall,
  FileText,
  LifeBuoy,
} from 'lucide-react';
import { Language, ChatMessage } from '../types';

interface CyberDefenseChatProps {
  lang: Language;
  onNavigateToRescue: () => void;
  onNavigateToComplaint: () => void;
}

export function CyberDefenseChat({
  lang,
  onNavigateToRescue,
  onNavigateToComplaint,
}: CyberDefenseChatProps) {
  const isNe = lang === 'ne';

  const initialGreeting: ChatMessage = {
    id: 'msg-welcome',
    role: 'model',
    content: isNe
      ? `नमस्ते! 🙏 म नेपाल साइबर सुरक्षा तथा अनलाइन ठगी नियन्त्रण AI सहायक हुँ।

तपाईं मलाई अनलाइन किनमेल, इसेवा/खल्ती दुरुपयोग, शंकास्पद फोन कल, नक्कली जागिर, वा पैसा फसेपछि तत्काल गर्नुपर्ने कुरा सोध्न सक्नुहुन्छ। यो सेवा **१००% निःशुल्क** छ।

तलका नमुना प्रश्नहरूमा थिच्नुहोस् वा आफ्नो समस्या तल लेखेर पठाउनुहोस्!`
      : `Hello! 🙏 I am your Nepal Cyber Security & Fraud Defense AI Assistant.

You can ask me anything about fake shopping offers, digital wallet fraud (eSewa/Khalti), suspicious calls, lottery scams, or emergency rescue steps. This service is **100% Free**.

Click any quick prompt below or type your question!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: 'gemini-3.8-flash',
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const quickPrompts = isNe
    ? [
        {
          label: 'इसेवामा झुक्किएर पैसा आयो भन्यो, के गर्ने?',
          query: 'कसैले फोन गरेर "तपाईंको इसेवामा मेरो पैसा झुक्किएर आयो, फिर्ता पठाइदिनुहोस्" भन्यो। के यो ठगी हो र मैले के गर्नुपर्छ?',
        },
        {
          label: 'फेसबुकमा मोबाइल सस्तो, आधा एडभान्स माग्यो',
          query: 'फेसबुक मार्केटप्लेसमा रु. ३५,००० को नयाँ फोन रु. १२,००० मा दिने भन्यो। डेलिभरी अघि ६,००० एडभान्स इसेवा गर्न भन्दैछ। के यो सुरक्षित छ?',
        },
        {
          label: 'मैले पैसा पठाइसकेँ, तत्काल के गर्ने?',
          query: 'मैले ठगलाई इसेवाबाट पैसा पठाइसकेँ, अब त्यो व्यक्तिले फोन उठाउँदैन। मेरो पैसा कसरी रोक्का गर्ने र उजुरी कहाँ दिने?',
        },
        {
          label: 'टेलिग्राममा दैनिक रु. ५,००० कमाउने काम',
          query: 'मलाई ह्वाट्सएपमा घरमै बसी युट्युब भिडियो लाइक गरेर दैनिक रु. ५००० कमाउने कामको अफर आयो। के यो साँचो हो?',
        },
        {
          label: 'नेपाल प्रहरी साइबर ब्युरोको सम्पर्क र प्रक्रिया',
          query: 'नेपाल प्रहरी साइबर ब्युरोमा अनलाइन ठगीको उजुरी कसरी र कहाँ दिने? आवश्यक कागजात के के हुन्?',
        },
      ]
    : [
        {
          label: 'eSewa accidental transfer call',
          query: 'Someone called saying they accidentally sent money to my eSewa and wants me to send it back. Is this a scam?',
        },
        {
          label: 'Cheap phone on Facebook asking advance',
          query: 'A Facebook Marketplace seller is offering a Rs 35,000 phone for Rs 12,000 and demands Rs 6,000 advance payment. Should I pay?',
        },
        {
          label: 'I already sent money! Immediate steps?',
          query: 'I just transferred money to a scammer via digital wallet and they blocked me. How can I freeze the account and get help?',
        },
        {
          label: 'Telegram task scam (Rs 5000/day)',
          query: 'I received an offer to earn Rs 5000/day by liking YouTube videos and following Telegram tasks. Is this a scam?',
        },
        {
          label: 'How to report to Nepal Cyber Bureau',
          query: 'What is the contact information and official procedure to file a complaint at Nepal Police Cyber Bureau?',
        },
      ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Speech API for voice input
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isNe
          ? 'तपाईंको ब्राउजरले भ्वाइस रिकग्निसन समर्थन गर्दैन। कृपया टाइप गरेर प्रश्न सोध्नुहोस्।'
          : 'Voice recognition not supported in this browser. Please type your message.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isNe ? 'ne-NP' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6),
          lang,
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        (isNe
          ? 'माफ गर्नुहोस्, जवाफ प्राप्त गर्न सकिएन। कृपया केही बेरपछि पुन: प्रयास गर्नुहोस्।'
          : 'Sorry, could not generate a response. Please try again.');

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini-3.8-flash',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'model',
        content: isNe
          ? '⚠️ नेटवर्क समस्या आयो। तर याद राख्नुहोस्: कसैलाई पनि OTP वा अग्रिम पैसा नपठाउनुहोस् र आकस्मिक सहयोगका लागि नेपाल साइबर ब्युरो (०१-४२१२९२९) मा सम्पर्क गर्नुहोस्।'
          : '⚠️ Network issue. Please remember: Never share OTPs or send advance payments. For emergencies, contact Nepal Cyber Bureau at 01-4212929.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'emergency-rule',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner audio
    const cleanText = text
      .replace(/[#*_`]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isNe ? 'ne-NP' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);

    setIsSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearHistory = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingId(null);
    setMessages([initialGreeting]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner / Feature Callout */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {isNe
                    ? 'AI साइबर सुरक्षा सल्लाहकार (Gemini AI Chatbot)'
                    : 'AI Cyber Fraud Defense Specialist'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isNe ? '१००% निःशुल्क' : '100% Free Tier'}
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-300 mt-1">
                {isNe
                  ? 'गुगल जेमिनाई (Gemini 2.5 Flash) द्वारा सञ्चालित — नेपाल साइबर ब्युरो मार्गदर्शन, इसेवा/खल्ती सुरक्षा, र तत्काल उद्धार सुझाव।'
                  : 'Powered by Gemini 2.5 Flash — Nepal Cyber Bureau guidelines, wallet safety, and urgent defense advice.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
              title={isNe ? 'च्याट खाली गर्नुहोस्' : 'Reset Chat'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isNe ? 'च्याट रिसेट' : 'Clear Chat'}</span>
            </button>
          </div>
        </div>

        {/* Quick Emergency Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">
            {isNe ? 'तत्काल आवश्यक परेमा:' : 'Quick shortcuts:'}
          </span>
          <button
            onClick={onNavigateToRescue}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition font-medium"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            {isNe ? 'पैसा पठाइसकेको भए (Emergency Rescue)' : "I'm Scammed (Rescue SOS)"}
          </button>
          <button
            onClick={onNavigateToComplaint}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition font-medium"
          >
            <FileText className="w-3.5 h-3.5" />
            {isNe ? 'साइबर ब्युरो उजुरी मस्यौदा' : 'Police Complaint Drafter'}
          </button>
          <a
            href="tel:014212929"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cyber Bureau: ०१-४२१२९२९</span>
          </a>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {isNe ? '💡 सिधै सोध्न सकिने लोकप्रिय प्रश्नहरू:' : '💡 Popular Quick Inquiries:'}
        </p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.query)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:border-emerald-500/50 hover:text-emerald-300 hover:bg-emerald-950/30 transition text-left disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl min-h-[460px] max-h-[640px] overflow-y-auto flex flex-col space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-semibold shadow-md ${
                  isUser
                    ? 'bg-cyan-600 text-white ring-2 ring-cyan-500/30'
                    : 'bg-emerald-600 text-white ring-2 ring-emerald-500/30'
                }`}
              >
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] md:max-w-[78%] rounded-2xl p-4 relative group ${
                  isUser
                    ? 'bg-cyan-600/90 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/70 shadow-md'
                }`}
              >
                {/* Meta header */}
                <div className="flex items-center justify-between gap-3 text-[11px] mb-1.5 opacity-80">
                  <span className="font-medium">
                    {isUser
                      ? isNe
                        ? 'तपाईं'
                        : 'You'
                      : isNe
                      ? 'AI साइबर सुरक्षा सल्लाहकार'
                      : 'Cyber Defense AI'}
                  </span>
                  <div className="flex items-center gap-2">
                    {msg.source && !isUser && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                        {msg.source}
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {/* Action buttons for model message */}
                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] text-slate-400">
                      {isNe ? 'आधिकारिक मार्गदर्शन' : 'Verified Nepal Cyber Guidelines'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title={isNe ? 'आवाजमा सुन्नुहोस्' : 'Listen with Audio'}
                      >
                        {isSpeakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            <span className="text-[11px] text-amber-300">
                              {isNe ? 'रोक्नुहोस्' : 'Stop'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[11px]">{isNe ? 'सुन्नुहोस्' : 'Listen'}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title={isNe ? 'कपी गर्नुहोस्' : 'Copy'}
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[11px] text-emerald-400">
                              {isNe ? 'कपी भयो' : 'Copied'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">{isNe ? 'कपी' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-4 max-w-[70%]">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>
                  {isNe
                    ? 'AI सुरक्षा सल्लाह तयार हुँदैछ...'
                    : 'Analyzing query and preparing cyber defense response...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box & Voice Button */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-3 rounded-xl border transition shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
            title={
              isListening
                ? isNe
                  ? 'बोल्न रोक्नुहोस्'
                  : 'Stop recording'
                : isNe
                ? 'माइक थिचेर नेपालीमै बोल्नुहोस्'
                : 'Speak in voice'
            }
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? isNe
                  ? 'सुन्दैछ... बोल्नुहोस् (Listening in Nepali)...'
                  : 'Listening... speak now...'
                : isNe
                ? 'आफ्नो प्रश्न वा शंकास्पद सन्देश यहाँ लेख्नुहोस्...'
                : 'Ask a question or describe suspicious message/call...'
            }
            disabled={isLoading}
            className="flex-1 bg-slate-950/80 text-white placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 text-sm transition"
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{isNe ? 'पठाउनुहोस्' : 'Send'}</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 mt-2">
          <span>
            {isNe
              ? '🔒 १००% सुरक्षित र गोप्य • व्यक्तिगत पासवर्ड वा बैंक पिन कहिल्यै टाइप नगर्नुहोस्'
              : '🔒 Confidential • Never type real OTPs, passwords, or bank PINs'}
          </span>
          <span className="text-emerald-400 font-medium">
            {isNe ? 'निःशुल्क जेमिनाई AI' : 'Free Gemini AI Tier'}
          </span>
        </div>
      </div>
    </div>
  );
}
