'use client';

import React, { useState, useEffect } from 'react';
import { PlatformSettings } from '@/types';
import {
  Settings, Save, Sparkles, CheckCircle2, ShieldAlert, Phone,
  MessageCircle, Instagram, Facebook, Send, Smartphone, Building2,
  CreditCard, User, Mail, AlertCircle, ExternalLink, HelpCircle
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'contacts' | 'banking' | 'pricing' | 'quotas'>('contacts');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data.settings) {
          setSettings({
            ...data.settings,
            whatsappNumber: data.settings.whatsappNumber || data.settings.whatsapp_number || '+213 555 12 34 56',
            secondaryPhone: data.settings.secondaryPhone || data.settings.secondary_phone || '+213 770 12 34 56',
            instagramUrl: data.settings.instagramUrl || data.settings.instagram_url || 'https://instagram.com/asmedix_officiel',
            facebookUrl: data.settings.facebookUrl || data.settings.facebook_url || 'https://facebook.com/asmedix_officiel',
            telegramUrl: data.settings.telegramUrl || data.settings.telegram_url || 'https://t.me/asmedix_officiel',
            baridimobRip: data.settings.baridimobRip || data.settings.baridimob_rip || '00799999002233445566',
            ccpNumber: data.settings.ccpNumber || data.settings.ccp_number || '22334455 Clé 66',
            accountHolder: data.settings.accountHolder || data.settings.account_holder || 'Dr. Karim Benali',
            supportEmail: data.settings.supportEmail || data.settings.support_email || 'contact@asmedix.dz',
            freeLimits: data.settings.freeLimits || {
              maxCourses: 2,
              maxFiches: 3,
              maxQcmPerMonth: 20,
              maxCat: 2,
              maxCases: 1,
              maxEcg: 2,
            },
            pricing: data.settings.pricing || {
              freePriceDa: 0,
              proPriceDa: 4500,
              premiumPriceDa: 7000,
            }
          });
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return <div className="p-8 text-center text-xs text-navy-400">Chargement des paramètres de la plateforme...</div>;
  }

  const cleanWhatsappDigits = (settings.whatsappNumber || '').replace(/\D/g, '');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 border border-brand-200 dark:border-brand-900 mb-1.5">
            <Settings className="w-3.5 h-3.5 text-brand-600" />
            <span>Panneau de Configuration Général</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
            Paramètres, Contacts & BaridiMob
          </h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-0.5">
            Modifiez votre numéro WhatsApp, vos liens réseaux sociaux, coordonnées CCP/BaridiMob et tarifs. Mis à jour en direct dans la base de données.
          </p>
        </div>

        {/* Global Save Button top-right */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft flex items-center justify-center gap-2 cursor-pointer transition-all self-start sm:self-auto shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Enregistrement SQL...' : 'Enregistrer tout'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Succès ! Tous les paramètres (WhatsApp, BaridiMob, liens sociaux) ont été mis à jour dans Supabase SQL et appliqués en direct sur tout le site.</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-navy-200 dark:border-navy-800 pb-2 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'contacts'
              ? 'bg-[#6e56cf] text-white shadow-soft'
              : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Contacts & WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banking')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'banking'
              ? 'bg-[#6e56cf] text-white shadow-soft'
              : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>BaridiMob & CCP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'pricing'
              ? 'bg-[#6e56cf] text-white shadow-soft'
              : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Tarifs Abonnements</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quotas')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'quotas'
              ? 'bg-[#6e56cf] text-white shadow-soft'
              : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Quotas Forfait Gratuit</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ======================= TAB 1: CONTACTS & WHATSAPP ======================= */}
        {activeTab === 'contacts' && (
          <div className="space-y-6 animate-fadeIn">
            {/* WhatsApp Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                  <span>Numéro WhatsApp & Réinitialisation Mot de Passe</span>
                </h2>
                {cleanWhatsappDigits && (
                  <a
                    href={`https://wa.me/${cleanWhatsappDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <span>Tester le lien WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed">
                💬 <strong>Usage Automatique :</strong> Lorsqu'un étudiant clique sur <em>"Mot de passe oublié / Réinitialiser"</em> ou <em>"Envoyer le reçu"</em>, le site ouvre directement WhatsApp avec un message pré-rempli envoyé à ce numéro pour que vous puissiez lui répondre directement !
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Numéro WhatsApp Principal (ex: +213 555 12 34 56 ou 0555123456) :
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                      type="text"
                      value={settings.whatsappNumber || ''}
                      onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      placeholder="+213 555 12 34 56"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold text-navy-950 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="text-[10px] text-navy-400 mt-1">
                    Chiffres nettoyés pour wa.me : <code className="text-emerald-600 font-mono font-bold">{cleanWhatsappDigits || 'Non défini'}</code>
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Deuxième Numéro de Téléphone (Numéro Secondaire) :
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                      type="text"
                      value={settings.secondaryPhone || ''}
                      onChange={e => setSettings({ ...settings, secondaryPhone: e.target.value })}
                      placeholder="+213 770 12 34 56"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold text-navy-950 dark:text-white"
                    />
                  </div>
                  <p className="text-[10px] text-navy-400 mt-1">
                    Numéro d'appel de secours affiché aux étudiants en cas de besoin
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links & Support Email */}
            <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
              <h2 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                <span>Réseaux Sociaux & Liens Officiels</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Lien Instagram (Compte officiel) :
                  </label>
                  <div className="relative">
                    <Instagram className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pink-500" />
                    <input
                      type="text"
                      value={settings.instagramUrl || ''}
                      onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                      placeholder="https://instagram.com/asmedix_officiel"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-medium text-navy-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Lien Page Facebook :
                  </label>
                  <div className="relative">
                    <Facebook className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
                    <input
                      type="text"
                      value={settings.facebookUrl || ''}
                      onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                      placeholder="https://facebook.com/asmedix_officiel"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-medium text-navy-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Canal Telegram / Support :
                  </label>
                  <div className="relative">
                    <Send className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
                    <input
                      type="text"
                      value={settings.telegramUrl || ''}
                      onChange={e => setSettings({ ...settings, telegramUrl: e.target.value })}
                      placeholder="https://t.me/asmedix_officiel"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-medium text-navy-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Email de Support Officiel :
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                      type="email"
                      value={settings.supportEmail || ''}
                      onChange={e => setSettings({ ...settings, supportEmail: e.target.value })}
                      placeholder="contact@asmedix.dz"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-medium text-navy-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: BARIDIMOB & CCP ======================= */}
        {activeTab === 'banking' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
              <h2 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-brand-600" />
                <span>Coordonnées Bancaires Algérie Poste (BaridiMob & CCP)</span>
              </h2>

              <p className="text-xs text-navy-500">
                Ces informations sont affichées directement aux étudiants lorsqu'ils souscrivent à un forfait PRO ou PREMIUM sur la page <strong>/checkout</strong>.
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Nom & Prénom du Titulaire du Compte (ex: Dr. Karim Benali) :
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                      type="text"
                      value={settings.accountHolder || ''}
                      onChange={e => setSettings({ ...settings, accountHolder: e.target.value })}
                      placeholder="Dr. Karim Benali"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold text-navy-950 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                      Numéro RIP BaridiMob (20 chiffres) :
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-600" />
                      <input
                        type="text"
                        value={settings.baridimobRip || ''}
                        onChange={e => setSettings({ ...settings, baridimobRip: e.target.value })}
                        placeholder="00799999002233445566"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-mono font-bold text-navy-950 dark:text-white"
                      />
                    </div>
                    <p className="text-[10px] text-navy-400 mt-1">
                      Numéro utilisé par l'application BaridiMob pour le virement instantané
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                      Numéro de Compte CCP & Clé :
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
                      <input
                        type="text"
                        value={settings.ccpNumber || ''}
                        onChange={e => setSettings({ ...settings, ccpNumber: e.target.value })}
                        placeholder="22334455 Clé 66"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-mono font-bold text-navy-950 dark:text-white"
                      />
                    </div>
                    <p className="text-[10px] text-navy-400 mt-1">
                      Numéro utilisé pour les virements au guichet d'Algérie Poste
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 3: TARIFS ======================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
              <h2 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider">
                Tarifs des Abonnements (Dinar Algérien - DA)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Prix Forfait PRO (DA) :
                  </label>
                  <input
                    type="number"
                    value={settings.pricing?.proPriceDa || 4500}
                    onChange={e => setSettings({
                      ...settings,
                      pricing: { ...settings.pricing, proPriceDa: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                  <p className="text-[10px] text-navy-400 mt-1">Affiché sur la page forfaits et checkout</p>
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Prix Forfait PREMIUM VIP (DA) :
                  </label>
                  <input
                    type="number"
                    value={settings.pricing?.premiumPriceDa || 7000}
                    onChange={e => setSettings({
                      ...settings,
                      pricing: { ...settings.pricing, premiumPriceDa: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                  <p className="text-[10px] text-navy-400 mt-1">Forfait incluant l'IA et les cas cliniques</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 4: QUOTAS ======================= */}
        {activeTab === 'quotas' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
              <h2 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-brand-600" />
                <span>Quotas d'Usage - Forfait Gratuit (FREE)</span>
              </h2>
              <p className="text-xs text-navy-500">
                Ces limites définissent ce qu'un étudiant gratuit peut consulter avant de voir la bannière de mise à niveau.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1">
                    Max Cours Gratuits
                  </label>
                  <input
                    type="number"
                    value={settings.freeLimits?.maxCourses || 2}
                    onChange={e => setSettings({
                      ...settings,
                      freeLimits: { ...settings.freeLimits, maxCourses: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1">
                    Max Fiches Révision
                  </label>
                  <input
                    type="number"
                    value={settings.freeLimits?.maxFiches || 3}
                    onChange={e => setSettings({
                      ...settings,
                      freeLimits: { ...settings.freeLimits, maxFiches: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1">
                    Max QCM / Mois
                  </label>
                  <input
                    type="number"
                    value={settings.freeLimits?.maxQcmPerMonth || 20}
                    onChange={e => setSettings({
                      ...settings,
                      freeLimits: { ...settings.freeLimits, maxQcmPerMonth: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1">
                    Max Protocoles CAT
                  </label>
                  <input
                    type="number"
                    value={settings.freeLimits?.maxCat || 2}
                    onChange={e => setSettings({
                      ...settings,
                      freeLimits: { ...settings.freeLimits, maxCat: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1">
                    Max Cas Cliniques
                  </label>
                  <input
                    type="number"
                    value={settings.freeLimits?.maxCases || 1}
                    onChange={e => setSettings({
                      ...settings,
                      freeLimits: { ...settings.freeLimits, maxCases: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-4 flex items-center justify-between border-t border-navy-100 dark:border-navy-800">
          <p className="text-[11px] text-navy-400">
            Toutes les modifications sont synchronisées avec la table SQL <code>platform_settings</code>.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Enregistrement SQL...' : 'Enregistrer les modifications'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
