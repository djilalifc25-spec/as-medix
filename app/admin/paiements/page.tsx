'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard, CheckCircle2, XCircle, Clock, Search, Filter, ShieldCheck,
  Building2, Smartphone, DollarSign, UserCheck, RefreshCw, AlertCircle, Sparkles
} from 'lucide-react';
import { PaymentRequest } from '@/types';

export default function AdminPaymentsPage() {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment/request');
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
    setProcessingId(requestId);
    try {
      const res = await fetch('/api/payment/request', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action })
      });
      const data = await res.json();
      if (data.success) {
        fetchPayments();
      } else {
        alert(data.error || 'Erreur lors de la validation.');
      }
    } catch (err) {
      console.error('Error handling payment action:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = requests.filter(r => {
    const matchesSearch =
      r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.transactionRef.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;
  const totalRevenue = requests
    .filter(r => r.status === 'APPROVED')
    .reduce((sum, r) => sum + (r.requestedPlan === 'PREMIUM' ? 7000 : 4500), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Gestion des Reçus BaridiMob & CCP
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">
            Vérifiez les preuves de virement et validez en 1 clic l'accès aux forfaits PRO (4500 DA) et PREMIUM (7000 DA).
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'PENDING'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-80">En Attente</span>
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black">{pendingCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('APPROVED')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'APPROVED'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-80">Approuvés</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black">{approvedCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('REJECTED')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'REJECTED'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-80">Rejetés</span>
            <XCircle className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black">{rejectedCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-400'
          }`}
        >
          <span className="text-xs font-medium opacity-80 block">Encaissements Validés</span>
          <span className="text-2xl font-black">{totalRevenue.toLocaleString()} DA</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, réf..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>{filtered.length} demande(s) affichée(s)</span>
        </div>
      </div>

      {/* Requests Table / Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
            Aucun virement enregistré dans cette catégorie.
          </div>
        ) : (
          filtered.map(req => (
            <div
              key={req.id}
              className={`p-6 rounded-2xl border transition-all bg-white dark:bg-slate-900 ${
                req.status === 'PENDING'
                  ? 'border-amber-300 dark:border-amber-800/60 shadow-sm'
                  : req.status === 'APPROVED'
                  ? 'border-emerald-200 dark:border-emerald-800/40'
                  : 'border-slate-200 dark:border-slate-800 opacity-75'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* User & Transfer details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {req.userName}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black rounded-full uppercase">
                      {req.requestedPlan} ({req.requestedPlan === 'PREMIUM' ? '7 000 DA' : '4 500 DA'})
                    </span>

                    {req.status === 'PENDING' && (
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> En Attente
                      </span>
                    )}
                    {req.status === 'APPROVED' && (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approuvé
                      </span>
                    )}
                    {req.status === 'REJECTED' && (
                      <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-full flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-600" /> Rejeté
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>Email: <strong className="text-slate-700 dark:text-slate-300">{req.userEmail}</strong></span>
                    <span>Mode: <strong className="text-slate-700 dark:text-slate-300">{req.paymentMethod}</strong></span>
                    <span>Réf / RIP: <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold text-slate-800 dark:text-slate-200">{req.transactionRef}</code></span>
                    <span>Date: {new Date(req.createdAt).toLocaleString('fr-FR')}</span>
                  </div>

                  {req.receiptImageUrl && (
                    <div className="pt-2">
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 flex items-center gap-1">
                        📸 Preuve de versement BaridiMob / CCP jointe :
                      </p>
                      <a href={req.receiptImageUrl} target="_blank" rel="noopener noreferrer" className="inline-block group relative">
                        <img
                          src={req.receiptImageUrl}
                          alt="Capture Reçu"
                          className="h-28 w-auto max-w-xs object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-[1.02] transition-all"
                        />
                        <span className="absolute inset-0 bg-black/40 text-white text-xs font-bold rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          🔍 Agrandir le reçu
                        </span>
                      </a>
                    </div>
                  )}

                  {req.notes && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                      <strong>Remarque élève :</strong> {req.notes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {req.status === 'PENDING' && (
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      disabled={processingId === req.id}
                      onClick={() => handleAction(req.id, 'reject')}
                      className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition cursor-pointer"
                    >
                      Rejeter
                    </button>

                    <button
                      disabled={processingId === req.id}
                      onClick={() => handleAction(req.id, 'approve')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Approuver & Activer {req.requestedPlan}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
