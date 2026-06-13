import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Compass, HelpCircle, ArrowRight } from 'lucide-react';

interface AiAssistantWidgetProps {
  theme: 'light' | 'dark';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiAssistantWidget({ theme }: AiAssistantWidgetProps) {
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to the **AURA Resorts Royal Suite Concierge**. I am your personal AI travel butler. How may I customize your luxury travel plans today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested pre-styled questions for instant delightful interaction
  const suggestions = [
    "Recommend a romantic Paris suite",
    "Tell me about Tokyo hot springs",
    "Classic afternoon tea in London",
    "Central Park view lofts in NYC"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg]
        })
      });
      
      if (!response.ok) {
        throw new Error('Royal concierge service took a detour');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, our private concierge line is currently occupied. Please review our premium curated suite options directly in the main layout."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple Markdown parser utility
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold handling
      let parsed = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      parsed = parsed.replace(boldRegex, '<strong class="font-extrabold text-blue-400 dark:text-blue-300">$1</strong>');
      
      // Bullet handling
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const listContent = line.replace(/^[\s*-]+/, '').trim();
        const listBoldCount = (listContent.match(boldRegex) || []).length;
        return (
          <li key={idx} className="list-disc ml-4 pl-1 text-[11px] mb-1.5 leading-normal text-slate-250 font-light" dangerouslySetInnerHTML={{ __html: parsed.replace(/^[\s*-]+/, '').trim() }} />
        );
      }
      
      // Headers
      if (line.trim().startsWith('#')) {
        const level = (line.match(/#/g) || []).length;
        const textVal = line.replace(/#/g, '').trim();
        return (
          <h5 key={idx} className="font-serif font-bold text-xs text-white uppercase tracking-wider mt-3 mb-1.5" dangerouslySetInnerHTML={{ __html: textVal }} />
        );
      }

      return (
        <p key={idx} className="mb-2 text-[11px] leading-relaxed text-slate-200 font-light" dangerouslySetInnerHTML={{ __html: parsed }} />
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-999 print:hidden font-sans">
      {/* 1. Closed State Circular Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl transition-all hover:scale-105 active:scale-95 group border border-blue-500/20 relative"
          title="AURA AI Royal Butler Concierge"
        >
          {/* pulsating back glowing ring */}
          <span className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping" />
          <Sparkles className="h-6 w-6 text-blue-400 transition-transform group-hover:rotate-12" />
        </button>
      )}

      {/* 2. Expanded Glassmorphic Chat Panel */}
      {isOpen && (
        <div className="w-80 md:w-96 rounded-3xl bg-slate-950/95 border border-white/10 text-white shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col h-[525px] animate-drawer-in">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/35 border border-blue-400/25">
                <Compass className="h-4.5 w-4.5 text-blue-400 animate-spin-slow" />
              </div>
              <div>
                <span className="block text-[8px] font-bold tracking-widest text-blue-400 uppercase">SIGNATURE SERVICE</span>
                <span className="text-xs font-serif font-extrabold tracking-tight block">AURA Royal Butler</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages Console */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-slate-950/50 to-indigo-950/20"
          >
            {messages.map((m, idx) => (
              <div 
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-3 ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white/5 border border-white/10 rounded-bl-none text-slate-100 shadow-sm'
                }`}>
                  {m.role === 'user' ? (
                    <span className="text-[11.5px] font-light leading-relaxed">{m.content}</span>
                  ) : (
                    parseMarkdown(m.content)
                  )}
                </div>
              </div>
            ))}

            {/* Bubble Loading Stagger */}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Shortcuts / Suggestions block when conversation is young */}
          {messages.length < 3 && !isLoading && (
            <div className="px-4 pb-2 pt-1 border-t border-white/5 bg-slate-950/50">
              <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1.5">Elite Prompt Inquiries:</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="text-[9.5px] font-light bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-400 transition-all text-left truncate max-w-full"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Panel */}
          <div className="p-3 bg-slate-950 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask our AI travel butler..."
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-all font-light"
            />
            <button
              onClick={() => handleSend(input)}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 hover:shadow-md transition-all text-white shrink-0"
              title="Transmitstay message"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
