'use client';

import React, { useState, useEffect } from 'react';
import { User, UserRole, PlanType, PaymentRequest } from '@/types';
import {
  Search, Shield, UserX, UserCheck, Trash2, Edit, CheckCircle2,
  XCircle, Clock, CreditCard, Sparkles, AlertCircle, Eye, EyeOff,
  KeyRound, Copy, Check
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedPass, setCopiedPass] = useState<string | null>(null);
  const [editingPasswordUserId, setEditingPasswordUserId] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const fetchUsersAndPayments = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
      setPaymentRequests(data.paymentRequests || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndPayments();
  }, []);

  const handleApprovePayment = async (requestId: string) => {
    if (!confirm('Confirmer la validation du versement BaridiMob / CCP ? L\'étudiant recevra immédiatement son accès PRO.')) return;
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve_payment', requestId })
    });
    fetchUsersAndPayments();
  };

  const handleRejectPayment = async (requestId: string) => {
    if (!confirm('Refuser cette demande de paiement ?')) return;
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject_payment', requestId })
    });
    fetchUsersAndPayments();
  };

  const handleUpdatePlan = async (id: string, newPlan: PlanType) => {
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'update', updates: { plan: newPlan } })
    });
    fetchUsersAndPayments();
  };

  const handleUpdateRole = async (id: string, newRole: UserRole) => {
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'update', updates: { role: newRole } })
    });
    fetchUsersAndPayments();
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, action: 'update', updates: { status: newStatus } })
    });
    fetchUsersAndPayments();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'delete' })
    });
    fetchUsersAndPayments();
  };

  const handleResetPassword = async (id: string, newPass: string) => {
    if (!newPass || newPass.length < 4) {
      alert('Le mot de passe doit comporter au moins 4 caractères.');
      return;
    }
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'reset_password', updates: { newPassword: newPass } })
    });
    if (res.ok) {
      alert('Mot de passe mis à jour avec succès !');
      setEditingPasswordUserId(null);
      setNewPasswordInput('');
      fetchUsersAndPayments();
    }
  };

  const filteredUsers = users
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .filter(u =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase())
    );

  const pendingRequests = paymentRequests.filter(p => p.status === 'PENDING');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 border border-brand-200 dark:border-brand-900 mb-2">
          <Shield className="w-3.5 h-3.5 text-brand-600" />
          <span>Gestion Sécurisée de la Plateforme</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
          Utilisateurs & Validation des Accès PRO
        </h1>
        <p className="text-xs sm:text-sm text-navy-600 dark:text-navy-300 mt-1">
          Autorisez manuellement les forfaits PRO après réception du reçu BaridiMob / CCP et gérez les rôles d'administration.
        </p>
      </div>

      {/* SECTION 1: PENDING PAYMENT REQUESTS (AUTHORIZATION QUEUE) */}
      <div className="apple-card p-6 space-y-4 border-l-4 border-l-amber-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-navy-950 dark:text-white">
              Demandes de Forfait PRO en Attente de Validation ({pendingRequests.length})
            </h2>
          </div>
          <span className="text-xs text-navy-500">
            Seul l'Administrateur peut débloquer les accès Premium
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-6 rounded-2xl bg-navy-50/50 dark:bg-navy-800/30 text-center text-xs text-navy-500">
            Aucun reçu de paiement en attente de vérification.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-white dark:bg-navy-800 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-navy-950 dark:text-white">
                      {req.userName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {req.requestedPlan}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy-100 text-navy-700 dark:bg-navy-700 dark:text-navy-200">
                      {req.paymentMethod}
                    </span>
                  </div>

                  <div className="text-xs text-navy-600 dark:text-navy-300">
                    Email : <strong className="text-navy-900 dark:text-white">{req.userEmail}</strong> • Réf. Transaction : <strong className="text-brand-600">{req.transactionRef}</strong>
                  </div>
                  {req.notes && (
                    <div className="text-[11px] text-navy-500 italic">
                      Note : "{req.notes}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApprovePayment(req.id)}
                    className="apple-badge-purple px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>⚡ Autoriser & Activer l'Accès PRO</span>
                  </button>

                  <button
                    onClick={() => handleRejectPayment(req.id)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors"
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    <span>Refuser</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: USERS DIRECTORY */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-navy-950 dark:text-white">
            Répertoire des Comptes Inscris ({users.length})
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher par nom, email..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs text-navy-900 dark:text-white"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-50 dark:bg-navy-800/60 text-navy-700 dark:text-navy-300 font-bold uppercase tracking-wider border-b border-navy-100 dark:border-navy-800">
                <tr>
                  <th className="p-4">Utilisateur</th>
                  <th className="p-4">Mot de Passe</th>
                  <th className="p-4">Profession</th>
                  <th className="p-4">Forfait Actif</th>
                  <th className="p-4">Rôle Système</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50 dark:divide-navy-800 text-navy-700 dark:text-navy-300">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-navy-50/50 dark:hover:bg-navy-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-navy-900 dark:text-white text-sm">{u.name}</div>
                      <div className="text-[11px] text-navy-400">{u.email}</div>
                    </td>
                    <td className="p-4">
                      {editingPasswordUserId === u.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={newPasswordInput}
                            onChange={e => setNewPasswordInput(e.target.value)}
                            placeholder="Nouveau mdp"
                            className="px-2 py-1 rounded-lg border border-brand-400 text-xs w-28 bg-white dark:bg-navy-800 text-navy-900 dark:text-white"
                            autoFocus
                          />
                          <button
                            onClick={() => handleResetPassword(u.id, newPasswordInput)}
                            className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                            title="Enregistrer"
                          >
                            OK
                          </button>
                          <button
                            onClick={() => setEditingPasswordUserId(null)}
                            className="px-1.5 py-1 rounded-lg text-navy-400 hover:text-navy-700 text-[10px]"
                            title="Annuler"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 font-mono text-xs">
                          <span className="font-semibold text-navy-800 dark:text-navy-100">
                            {u.password 
                              ? (showPasswords[u.id] ? u.password : '••••••••')
                              : <span className="text-navy-400 font-sans italic text-[11px]">Non capturé</span>
                            }
                          </span>
                          {u.password && (
                            <>
                              <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                                className="p-1 text-navy-400 hover:text-navy-700 dark:hover:text-white transition-colors"
                                title={showPasswords[u.id] ? "Masquer" : "Afficher"}
                              >
                                {showPasswords[u.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(u.password || '');
                                  setCopiedPass(u.id);
                                  setTimeout(() => setCopiedPass(null), 2000);
                                }}
                                className="p-1 text-navy-400 hover:text-navy-700 dark:hover:text-white transition-colors"
                                title="Copier le mot de passe"
                              >
                                {copiedPass === u.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPasswordUserId(u.id);
                              setNewPasswordInput(u.password || '');
                            }}
                            className="p-1 text-brand-500 hover:text-brand-700 transition-colors ml-0.5"
                            title="Modifier le mot de passe"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-4">{u.profession}</td>
                    <td className="p-4">
                      <select
                        value={u.plan}
                        onChange={e => handleUpdatePlan(u.id, e.target.value as PlanType)}
                        className={`px-2.5 py-1 rounded-xl border border-navy-200 dark:border-navy-700 font-bold text-xs ${
                          u.plan === 'PRO' || u.plan === 'PREMIUM'
                            ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border-brand-300'
                            : 'bg-white dark:bg-navy-800 text-navy-800 dark:text-navy-200'
                        }`}
                      >
                        <option value="FREE">FREE (0 DA)</option>
                        <option value="PRO">PRO (4 500 DA)</option>
                        <option value="PREMIUM">PREMIUM (7 000 DA)</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={e => handleUpdateRole(u.id, e.target.value as UserRole)}
                        className={`px-2.5 py-1 rounded-xl border border-navy-200 dark:border-navy-700 font-semibold text-xs ${
                          u.role === 'ADMIN' || u.role === 'SUPER_ADMIN'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300 font-bold'
                            : 'bg-white dark:bg-navy-800 text-navy-800 dark:text-navy-200'
                        }`}
                      >
                        <option value="USER">USER</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {u.status === 'active' ? 'Actif' : 'En attente / Suspendu'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        title={u.status === 'active' ? 'Suspendre' : 'Réactiver'}
                        className="p-1.5 text-navy-400 hover:text-navy-900 transition-colors"
                      >
                        {u.status === 'active' ? <UserX className="w-4 h-4 text-amber-500" /> : <UserCheck className="w-4 h-4 text-emerald-500" />}
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        title="Supprimer"
                        className="p-1.5 text-rose-500 hover:text-rose-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
