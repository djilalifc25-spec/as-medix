'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Search, Filter, CheckCircle2, Clock, AlertCircle, Trash2,
  Send, User as UserIcon, Mail, Phone, Stethoscope, RefreshCw, Check, ArrowRight, ShieldCheck
} from 'lucide-react';
import { UserMessage } from '@/types';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNREAD' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/messages');
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        if (data.messages.length > 0 && !selectedMessage) {
          setSelectedMessage(data.messages[0]);
          setReplyInput(data.messages[0].replyNote || '');
        }
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'UNREAD' | 'IN_PROGRESS' | 'RESOLVED', note?: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/user/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, replyNote: note !== undefined ? note : selectedMessage?.replyNote })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev =>
          prev.map(m => (m.id === id ? { ...m, status: newStatus, replyNote: note !== undefined ? note : m.replyNote } : m))
        );
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(prev => prev ? { ...prev, status: newStatus, replyNote: note !== undefined ? note : prev.replyNote } : null);
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce message ?')) return;
    try {
      const res = await fetch(`/api/user/messages?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        const updated = messages.filter(m => m.id !== id);
        setMessages(updated);
        if (selectedMessage?.id === id) {
          setSelectedMessage(updated[0] || null);
          setReplyInput(updated[0]?.replyNote || '');
        }
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch =
      m.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || m.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const unreadCount = messages.filter(m => m.status === 'UNREAD').length;
  const inProgressCount = messages.filter(m => m.status === 'IN_PROGRESS').length;
  const resolvedCount = messages.filter(m => m.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Messagerie & Support Utilisateurs
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">
            Consultez, traitez et répondez aux messages et questions posées par les étudiants et médecins praticiens.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-400'
          }`}
        >
          <span className="text-xs font-medium opacity-80 block">Total Messages</span>
          <span className="text-2xl font-black">{messages.length}</span>
        </button>

        <button
          onClick={() => setStatusFilter('UNREAD')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'UNREAD'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-80">Non lus</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-extrabold text-[10px] rounded-full">
                Nouveau
              </span>
            )}
          </div>
          <span className="text-2xl font-black">{unreadCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('IN_PROGRESS')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'IN_PROGRESS'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
          }`}
        >
          <span className="text-xs font-medium opacity-80 block">En traitement</span>
          <span className="text-2xl font-black">{inProgressCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('RESOLVED')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'RESOLVED'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
          }`}
        >
          <span className="text-xs font-medium opacity-80 block">Traités / Résolus</span>
          <span className="text-2xl font-black">{resolvedCount}</span>
        </button>
      </div>

      {/* Main Content Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Messages List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filters & Search */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, sujet..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs outline-none"
              >
                <option value="ALL">Toutes les catégories</option>
                <option value="Question Médicale">Question Médicale</option>
                <option value="Abonnement / Paiement">Abonnement / Paiement</option>
                <option value="Support Technique">Support Technique</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          {/* List items */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 text-xs">
                Aucun message ne correspond à vos filtres.
              </div>
            ) : (
              filteredMessages.map(msg => {
                const isSelected = selectedMessage?.id === msg.id;

                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      setReplyInput(msg.replyNote || '');
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 dark:border-blue-600 shadow-sm'
                        : msg.status === 'UNREAD'
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 hover:border-amber-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[180px]">
                        {msg.userName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mb-1">
                      {msg.subject}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] rounded-md font-medium">
                        {msg.category}
                      </span>

                      {msg.status === 'UNREAD' && (
                        <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-[10px] rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" /> Non lu
                        </span>
                      )}
                      {msg.status === 'IN_PROGRESS' && (
                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] rounded-full">
                          En traitement
                        </span>
                      )}
                      {msg.status === 'RESOLVED' && (
                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> Traité
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Detailed Message Viewer & Response Panel */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Top User Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedMessage.userName}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-800">
                      {selectedMessage.profession || 'Praticien'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                      <a href={`mailto:${selectedMessage.userEmail}`} className="hover:underline text-blue-600 dark:text-blue-400">
                        {selectedMessage.userEmail}
                      </a>
                    </span>
                    {selectedMessage.userPhone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{selectedMessage.userPhone}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                    title="Supprimer le message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Subject & Metadata */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg">
                    📌 {selectedMessage.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Reçu le {new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedMessage.subject}
                </h2>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Changer le statut du message
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={updatingId === selectedMessage.id}
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'UNREAD')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                      selectedMessage.status === 'UNREAD'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    Marquer Non Lu
                  </button>

                  <button
                    disabled={updatingId === selectedMessage.id}
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'IN_PROGRESS')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                      selectedMessage.status === 'IN_PROGRESS'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50'
                    }`}
                  >
                    En Traitement
                  </button>

                  <button
                    disabled={updatingId === selectedMessage.id}
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'RESOLVED')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                      selectedMessage.status === 'RESOLVED'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50'
                    }`}
                  >
                    Marquer Traité / Résolu
                  </button>
                </div>
              </div>

              {/* Admin Note & Response Section */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Note Interne & Réponse Administrateur
                </label>
                <textarea
                  rows={3}
                  placeholder="Inscrivez la réponse transmise à l'étudiant ou la remarque interne (ex: Accès PRO débloqué via CCP...)"
                  value={replyInput}
                  onChange={e => setReplyInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>

                <div className="flex justify-end">
                  <button
                    disabled={updatingId === selectedMessage.id}
                    onClick={() => handleUpdateStatus(selectedMessage.id, selectedMessage.status, replyInput)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sauvegarder la Note</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-sm">
              Sélectionnez un message dans la liste de gauche pour en afficher tous les détails.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
