'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  time: string;
  quickReplies?: string[];
  actionLink?: { label: string; href: string };
}

export default function RaseenAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadPhone, setLeadPhone] = useState('');
  const [showLeadPrompt, setShowLeadPrompt] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: 'أهلاً بك في رَصين! 🌟 أنا مستشارك الذكي المؤتمت. أساعدك في اختيار النماذج المحاسبية والقانونية الأنسب لمشروعك، أو إصدار فواتيرك وحساب أرباحك فوراً.',
          time: getCurrentTime(),
          quickReplies: [
            '📊 أفضل شيتات إكسيل محاسبية',
            '🧾 إصدار فاتورة ضريبية مجانية',
            '📈 كيف أحسب نقطة تعادل مشروعي؟',
            '🏪 كيف أبيع أصولي بربح 85%؟',
            '📞 التحدث مباشرة مع فريق المبيعات',
          ],
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      respondToQuery(text);
      setIsTyping(false);
    }, 600);
  };

  const respondToQuery = (query: string) => {
    const q = query.toLowerCase();
    let replyText = '';
    let quickReplies: string[] | undefined = undefined;
    let actionLink: { label: string; href: string } | undefined = undefined;

    if (q.includes('شيت') || q.includes('إكسيل') || q.includes('محاسب')) {
      replyText = 'لدينا 12 شيت تخصصي معتمد لعام 2026! تشمل: شيت المحاسبة المالية الكاملة، شيت حساب ضريبة القيمة المضافة، شيت التدفقات النقدية، وشيت مسير الرواتب. جميعها بمعادلات ديناميكية وربط مع Power BI.';
      actionLink = { label: 'استعراض الشيتات المحاسبية', href: '/#products' };
      quickReplies = ['كم سعر الشيت؟', 'هل الشيتات متوافقة مع معايير IFRS؟'];
    } else if (q.includes('فاتورة') || q.includes('ضريب')) {
      replyText = 'يمكنك استخدام مولد الفواتير الإلكترونية المجاني مباشرة في الصفحة الرئيسية! يدعم معايير هيئة الزكاة والضريبة (ZATCA) في السعودية، ومصلحة الضرائب المصرية، مع رمز QR للتحقق السريع.';
      actionLink = { label: 'فتح مولد الفواتير الآن', href: '/#interactive-suite' };
    } else if (q.includes('تعادل') || q.includes('ربح') || q.includes('أرباح')) {
      replyText = 'حاسبة نقطة التعادل وهامش المساهمة متاحة مجاناً الآن في أعلى الصفحة! يمكنك تحريك أشرطة التكاليف وسعر الوحدة لمعرفة متى تبدأ بجني أرباح حقيقية يومياً.';
      actionLink = { label: 'جرب حاسبة التعادل', href: '/#interactive-suite' };
    } else if (q.includes('بيع') || q.includes('بائع') || q.includes('متجر') || q.includes('85%')) {
      replyText = 'في رَصين، يمكنك فتح متجرك الرقمي المستقل في 5 دقائق! نمنحك 85% من سعر كل عملية بيع مع تحويل تلقائي للأرباح عبر إنستاباي، فودافون كاش، ومدى دون تأخير.';
      actionLink = { label: 'إنشاء متجرك الرقمي كبائع', href: '/vendor' };
    } else if (q.includes('تحدث') || q.includes('فريق') || q.includes('مبيعات') || q.includes('واتساب') || q.includes('مستشار')) {
      replyText = 'يسعدنا جداً خدمتك! يمكنك إدخال رقم هاتفك أو الواتساب وسيتواصل معك مستشار أعمال معتمد من رَصين فوراً:';
      setShowLeadPrompt(true);
      return;
    } else {
      replyText = 'شكراً لتواصلك! في رَصين نقدم أصولاً ونماذج إكسيل وعقوداً قانونية وأدوات ذكية معتمدة تختصر 80% من جهد عملك. يمكنك طلب استشارة مخصصة أو استخدام أدواتنا المجانية فوراً.';
      quickReplies = ['شيتات المحاسبة', 'مولد الفواتير', 'فتح متجر بائع', 'تواصل عبر واتساب'];
    }

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        time: getCurrentTime(),
        quickReplies,
        actionLink,
      },
    ]);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadPhone.trim()) return;

    setLeadCaptured(true);
    setShowLeadPrompt(false);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `تم استلام رقمك بنجاح (${leadPhone})! سيتواصل معك فريق الاستشارات والتنفيذ عبر الواتساب في غضون دقائق. يمكنك أيضاً فتح محادثة مباشرة الآن:`,
        time: getCurrentTime(),
        actionLink: {
          label: 'فتح محادثة واتساب فورية 💬',
          href: `https://wa.me/201026046026?text=${encodeURIComponent('مرحباً فريق رَصين، أرغب في استشارة حول أصول وخدمات المنصة.')}`,
        },
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xl backdrop-blur-md cursor-pointer hover:border-amber-400 transition-all animate-bounce"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>مساعد رَصين الذكي 🟢 متصل</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="فتح المساعد الذكي"
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-amber-300"
        >
          {isOpen ? (
            <span className="text-2xl font-black">✕</span>
          ) : (
            <div className="relative">
              <span className="text-2xl">🤖</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
          )}
        </button>
      </div>

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[580px] h-[80vh] bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-right font-cairo text-white animate-fade-in-up">
          
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white">مستشار رَصين المؤتمت</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] text-slate-400 block">ذكاء اصطناعي 24/7 • دعم ومبيعات فورية</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-bold rounded-br-none shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {m.actionLink && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800">
                      <a
                        href={m.actionLink.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
                      >
                        <span>{m.actionLink.label}</span>
                        <span>←</span>
                      </a>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-500 mt-1 px-1 font-mono">
                  {m.time}
                </span>

                {/* Quick Reply Pills */}
                {m.quickReplies && (
                  <div className="flex flex-wrap gap-1.5 mt-2 justify-end">
                    {m.quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleSendMessage(reply)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500/20 hover:border-amber-500/40 text-amber-300 border border-slate-700/60 text-[10px] font-bold transition-all"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 w-20">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            {/* In-chat Lead Capture Form */}
            {showLeadPrompt && !leadCaptured && (
              <form onSubmit={handleLeadSubmit} className="bg-slate-950 p-3.5 rounded-2xl border border-amber-500/30 space-y-2 mt-2">
                <span className="text-[11px] font-bold text-amber-400 block">
                  أدخل رقم هاتفك أو واتساب للتواصل الفوري:
                </span>
                <input
                  type="tel"
                  required
                  placeholder="+966 50 000 0000 أو 010 000 0000"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-left font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs transition-colors"
                >
                  طلب التواصل الآن ←
                </button>
              </form>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="اكتب سؤالك أو استفسارك هنا..."
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 flex items-center justify-center font-black transition-colors shrink-0"
              >
                ←
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
