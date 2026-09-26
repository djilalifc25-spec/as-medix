'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, MessageSquare, Phone, Mail, MapPin, Clock, HelpCircle, ShieldAlert, Sparkles, Stethoscope } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    profession: 'Étudiant en Médecine',
    subject: '',
    category: 'Question Médicale',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/user/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du message');
      }

      setSuccess(true);
      setFormData({
        userName: '',
        userEmail: '',
        userPhone: '',
        profession: 'Étudiant en Médecine',
        subject: '',
        category: 'Question Médicale',
        message: ''
      });
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-12 pointer-events-none">
          <Stethoscope className="w-96 h-96 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/30 backdrop-blur-md border border-blue-400/30 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-100 mb-4">
            <MessageSquare className="w-3.5 h-3.5" /> Support Médical Direct
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Contacter l'Équipe Médicale & Admin
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Une question sur un protocole d'urgence ? Un doute sur une posologie Pharmnet DZ ? Besoin d'aide pour valider votre virement BaridiMob ? Laissez-nous un message et recevez une réponse directement dans votre espace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" /> Envoyer un Message
          </h2>

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-3 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Message transmis avec succès !</h4>
                <p className="text-xs mt-0.5 opacity-90">
                  Votre message a bien été envoyé à l'équipe d'administration AS MEDIX. Un praticien ou un administrateur traitera votre requête dans les meilleurs délais.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-800 dark:text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nom Complet & Titre *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Karim Benali"
                  value={formData.userName}
                  onChange={e => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Adresse Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="karim.benali@gmail.com"
                  value={formData.userEmail}
                  onChange={e => setFormData({ ...formData, userEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Téléphone (Facultatif)
                </label>
                <input
                  type="tel"
                  placeholder="05 55 12 34 56"
                  value={formData.userPhone}
                  onChange={e => setFormData({ ...formData, userPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Profession / Statut
                </label>
                <select
                  value={formData.profession}
                  onChange={e => setFormData({ ...formData, profession: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="Étudiant en Médecine">Étudiant en Médecine</option>
                  <option value="Interne en Médecine">Interne en Médecine</option>
                  <option value="Resident en Spécialité">Résident en Spécialité</option>
                  <option value="Médecin Généraliste">Médecin Généraliste</option>
                  <option value="Médecin Spécialiste">Médecin Spécialiste</option>
                  <option value="Pharmacien">Pharmacien / Biologiste</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Catégorie du Message *
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="Question Médicale">🩺 Question Médicale / Thérapeutique</option>
                  <option value="Abonnement / Paiement">💳 Abonnement & Paiement BaridiMob</option>
                  <option value="Support Technique">💻 Bug / Support Technique</option>
                  <option value="Suggestion">💡 Suggestion d'amélioration</option>
                  <option value="Autre">📩 Autre demande</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Sujet du Message *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Précision posologie DFG ou Reçu CCP..."
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Contenu du Message *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Décrivez précisément votre demande, votre question clinique ou la référence du versement..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition leading-relaxed resize-y"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Transmission en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Envoyer le Message à l'Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Informations Directes
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block text-xs">Email Officiel</span>
                  <a href="mailto:contact@asmedix.dz" className="text-blue-600 dark:text-blue-400 hover:underline">contact@asmedix.dz</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block text-xs">Support Téléphonique</span>
                  <span className="text-slate-600 dark:text-slate-400">+213 (0) 555 90 80 70</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block text-xs">Pôle de Développement</span>
                  <span className="text-slate-600 dark:text-slate-400">Alger (Moussef) & Oran, Algérie</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block text-xs">Disponibilité Mode Garde</span>
                  <span className="text-slate-600 dark:text-slate-400">7j/7 - Assistance prioritaires aux médecins d'urgence</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-800/50 rounded-2xl p-6 text-white shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 text-indigo-400" /> Réception Admin en Temps Réel
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tous vos messages sont transmis instantanément au panneau d'administration central. Vous pouvez suivre le statut (*Non lu*, *En traitement*, *Traité*) dès validation par notre équipe médicale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
