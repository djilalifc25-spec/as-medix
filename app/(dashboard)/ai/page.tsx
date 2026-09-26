'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Brain, FileText, Award, RefreshCw } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiMedicalPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Bonjour Docteur ! Je suis l'**Assistant Médical AS MEDIX**, entraîné sur les recommandations officielles, l'ECNi et le programme du Résidanat algérien.\n\nPosez-moi une question clinique, demandez-moi de clarifier un mécanisme physiopathologique, ou cliquez sur un des boutons ci-dessous pour générer un cas clinique ou un QCM d'entraînement."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const newMsgs: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([...newMsgs, { role: 'assistant', content: data.reply }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (topic: string) => {
    sendMessage(topic);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 flex flex-col h-[calc(100vh-140px)]">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-600 to-purple-700 text-white shadow-soft flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black">Assistant Médical Intelligent</h1>
            <p className="text-xs text-brand-200">Recommandations cliniques & entraînement personnalisé</p>
          </div>
        </div>

        <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
          Modèle : Med-Core DZ 4.0
        </span>
      </div>

      {/* Suggested Quick Action Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => handleQuickAction("Explique-moi la prise en charge de l'AVC ischémique en urgence.")}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-750 text-xs font-medium text-navy-700 dark:text-navy-300 hover:border-brand-400 whitespace-nowrap"
        >
          🧠 Urgence AVC & Thrombolyse
        </button>
        <button
          onClick={() => handleQuickAction("Quels sont les 4 piliers thérapeutiques de l'insuffisance cardiaque à FEVG réduite ?")}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-750 text-xs font-medium text-navy-700 dark:text-navy-300 hover:border-brand-400 whitespace-nowrap"
        >
          ❤️ Les 4 Piliers Insuffisance Cardiaque
        </button>
        <button
          onClick={() => handleQuickAction("Rappelle-moi le protocole national de traitement de la tuberculose 2RHZE/4RH.")}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-750 text-xs font-medium text-navy-700 dark:text-navy-300 hover:border-brand-400 whitespace-nowrap"
        >
          🫁 Tuberculose Régime 2RHZE/4RH
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-soft">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 text-xs sm:text-sm ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-4 rounded-2xl max-w-2xl leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : 'bg-navy-50 dark:bg-navy-800/80 text-navy-900 dark:text-navy-100 rounded-tl-none border border-navy-100 dark:border-navy-700'
              }`}
            >
              {m.content}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-navy-200 dark:bg-navy-700 text-navy-700 dark:text-navy-200 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                Dr
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 p-2 font-semibold">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>L'Assistant Médical analyse les recommandations...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={e => { e.preventDefault(); sendMessage(); }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Posez votre question médicale à l'IA..."
          className="flex-1 px-5 py-3.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-soft"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white shadow-soft transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
