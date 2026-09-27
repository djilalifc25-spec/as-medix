'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { Specialty, MEDICAL_YEARS } from '@/types';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import {
  ArrowLeft, Code, Eye, Save, Globe, Check, Sparkles, AlertCircle,
  Columns, ExternalLink, Loader2, CheckCircle2, FileText, PlusCircle,
  Stethoscope, ShieldAlert, Pill, Table, List, BookmarkCheck, Upload, Image as ImageIcon, School,
  Bot, Wand2, Cpu, Key, X
} from 'lucide-react';
import { autoFormatCourseHtml, extractMetadataFromHtml } from '@/lib/autoHtmlFormatter';

function CourseEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  const isEditMode = Boolean(courseId);

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentSlug, setCurrentSlug] = useState<string>('');

  // Course Form States
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState<number | ''>(4);
  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>(ALL_SPECIALTIES);
  const [specialtyId, setSpecialtyId] = useState('cardio');
  const [author, setAuthor] = useState('Pr. Karim Benali');
  const [authorTitle, setAuthorTitle] = useState('Chef de Service Hospitalo-Universitaire');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200');
  const [difficulty, setDifficulty] = useState<'Fondamental' | 'Incontournable' | 'Avancé'>('Incontournable');
  const [faculty, setFaculty] = useState<'ORAN' | 'SIDI_BEL_ABBES' | 'TOUS'>('ORAN');
  const [source, setSource] = useState('Externat');
  const [rang, setRang] = useState<'Rang A' | 'Rang B' | 'Rang C'>('Rang A');
  const [estimatedDuration, setEstimatedDuration] = useState('35 min');
  const [accessLevel, setAccessLevel] = useState<'FREE' | 'PRO' | 'PREMIUM'>('FREE');
  const [tagsInput, setTagsInput] = useState('Urgences, Diagnostic, Algérie');
  const [isPublished, setIsPublished] = useState(false);

  // Editor Display Mode: 'code' | 'split' | 'preview'
  const [viewMode, setViewMode] = useState<'code' | 'split' | 'preview'>('split');
  const [convertMode, setConvertMode] = useState<'THEME' | 'RAW'>('THEME');
  const [uploadingFile, setUploadingFile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const contentFileInputRef = useRef<HTMLInputElement>(null);

  // AI Assistant Modal State (Google AI Studio, OpenRouter & Direct API Auto-detect)
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiProvider, setAiProvider] = useState<'google_ai_studio' | 'openrouter' | 'direct_api'>('google_ai_studio');
  const [googleAiKey, setGoogleAiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('asmedix_google_ai_key') || '';
    }
    return '';
  });
  const [openRouterKey, setOpenRouterKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('asmedix_openrouter_key') || '';
    }
    return '';
  });
  const [directApiKey, setDirectApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('asmedix_direct_api_key') || '';
    }
    return '';
  });
  const [selectedAiModel, setSelectedAiModel] = useState('gemini-2.5-flash');
  const [aiInputType, setAiInputType] = useState<'text' | 'pdfUrl'>('text');
  const [aiPdfUrl, setAiPdfUrl] = useState('');
  const [aiRawInput, setAiRawInput] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const detectApiProvider = (key: string) => {
    const cleanKey = key.trim();
    if (cleanKey.startsWith('AIzaSy')) {
      return {
        provider: 'google_ai_studio' as const,
        label: 'Google AI Studio (Gemini)',
        badgeColor: 'bg-emerald-500 text-white',
        models: [
          { value: 'gemini-2.5-flash', label: '⚡ Gemini 2.5 Flash (Ultra Rapide & Recommandé)' },
          { value: 'gemini-2.5-pro', label: '🧠 Gemini 2.5 Pro (Raisonnement Élevé)' },
          { value: 'gemini-2.0-flash', label: '🚀 Gemini 2.0 Flash' },
          { value: 'gemini-1.5-pro', label: '📄 Gemini 1.5 Pro' },
        ]
      };
    } else if (cleanKey.startsWith('sk-or-v1-')) {
      return {
        provider: 'openrouter' as const,
        label: 'OpenRouter (Multi-Modèles)',
        badgeColor: 'bg-purple-500 text-white',
        models: [
          { value: 'google/gemini-2.5-flash', label: '⚡ Gemini 2.5 Flash' },
          { value: 'deepseek/deepseek-chat', label: '🔬 DeepSeek V3' },
          { value: 'anthropic/claude-3.5-sonnet', label: '🧠 Claude 3.5 Sonnet' },
          { value: 'openai/gpt-4o', label: '🌐 GPT-4o' },
          { value: 'meta-llama/llama-3.3-70b-instruct', label: '🦙 Llama 3.3 70B' },
        ]
      };
    } else if (cleanKey.startsWith('sk-ant-')) {
      return {
        provider: 'anthropic' as const,
        label: 'Anthropic Claude Direct',
        badgeColor: 'bg-amber-600 text-white',
        models: [
          { value: 'claude-3-5-sonnet-20241022', label: '🧠 Claude 3.5 Sonnet' },
          { value: 'claude-3-5-haiku-20241022', label: '⚡ Claude 3.5 Haiku' },
          { value: 'claude-3-opus-20240229', label: '🔬 Claude 3 Opus' },
        ]
      };
    } else if (cleanKey.startsWith('sk-dsk-')) {
      return {
        provider: 'deepseek' as const,
        label: 'DeepSeek Direct API',
        badgeColor: 'bg-blue-600 text-white',
        models: [
          { value: 'deepseek-chat', label: '🔬 DeepSeek V3 / Chat' },
          { value: 'deepseek-reasoner', label: '🧠 DeepSeek R1 (Reasoner)' },
        ]
      };
    } else if (cleanKey.startsWith('cc-') || cleanKey.startsWith('codecraft-') || cleanKey.startsWith('sk-cc-')) {
      return {
        provider: 'codecraft' as const,
        label: 'CodeCraft API (codecraftapi.com/v1)',
        badgeColor: 'bg-indigo-600 text-white',
        models: [
          { value: 'codecraft-pro', label: '🧠 CodeCraft Pro' },
          { value: 'codecraft-flash', label: '⚡ CodeCraft Flash' },
          { value: 'gpt-4o', label: '🌐 GPT-4o (CodeCraft)' },
          { value: 'claude-3-5-sonnet', label: '🧠 Claude 3.5 Sonnet (CodeCraft)' },
        ]
      };
    } else if (cleanKey.startsWith('sk-proj-') || cleanKey.startsWith('sk-')) {
      return {
        provider: 'openai' as const,
        label: 'OpenAI ChatGPT Direct',
        badgeColor: 'bg-teal-600 text-white',
        models: [
          { value: 'gpt-4o', label: '🌐 GPT-4o (Modèle Phare)' },
          { value: 'gpt-4o-mini', label: '⚡ GPT-4o Mini (Rapide)' },
          { value: 'gpt-4-turbo', label: '🧠 GPT-4 Turbo' },
          { value: 'o3-mini', label: '🔬 o3-mini (Raisonnement)' },
        ]
      };
    }

    return {
      provider: 'openai' as const,
      label: 'Clé Directe (Format OpenAI)',
      badgeColor: 'bg-navy-600 text-white',
      models: [
        { value: 'gpt-4o', label: '🌐 GPT-4o' },
        { value: 'gpt-4o-mini', label: '⚡ GPT-4o Mini' },
        { value: 'deepseek-chat', label: '🔬 DeepSeek Chat' },
        { value: 'gemini-2.5-flash', label: '⚡ Gemini 2.5 Flash' },
      ]
    };
  };

  const handleOpenAiModal = () => {
    if (!aiRawInput.trim()) {
      setAiRawInput(htmlContent);
    }
    setAiModalOpen(true);
  };

  const handleRunAi = async () => {
    if (aiInputType === 'text' && !aiRawInput.trim()) {
      setAiError('Veuillez coller le texte ou le code HTML brut du cours à analyser.');
      return;
    }
    if (aiInputType === 'pdfUrl' && !aiPdfUrl.trim()) {
      setAiError('Veuillez saisir ou coller l\'URL du fichier PDF à télécharger.');
      return;
    }

    setAiProcessing(true);
    setAiError(null);

    let activeApiKey = '';
    let effectiveProvider: string = aiProvider;

    if (aiProvider === 'google_ai_studio') {
      activeApiKey = googleAiKey.trim();
    } else if (aiProvider === 'openrouter') {
      activeApiKey = openRouterKey.trim();
    } else {
      activeApiKey = directApiKey.trim();
      const detected = detectApiProvider(activeApiKey);
      effectiveProvider = detected.provider;
    }

    if (!activeApiKey) {
      setAiError('Veuillez saisir une clé API valide.');
      setAiProcessing(false);
      return;
    }

    if (typeof window !== 'undefined') {
      if (googleAiKey.trim()) localStorage.setItem('asmedix_google_ai_key', googleAiKey.trim());
      if (openRouterKey.trim()) localStorage.setItem('asmedix_openrouter_key', openRouterKey.trim());
      if (directApiKey.trim()) localStorage.setItem('asmedix_direct_api_key', directApiKey.trim());
    }

    try {
      const spec = specialtiesList.find(s => s.id === specialtyId);
      const payload: any = {
        provider: effectiveProvider,
        apiKey: activeApiKey,
        model: selectedAiModel,
        specialty: spec?.name || 'Médecine',
        year: year !== '' ? Number(year) : undefined
      };

      if (aiInputType === 'pdfUrl') {
        payload.pdfUrl = aiPdfUrl.trim();
      } else {
        payload.content = aiRawInput;
      }

      const res = await fetch('/api/admin/ai/format-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch (_parseErr) {
        throw new Error(`Le serveur a renvoyé une réponse HTML au lieu de JSON (Code HTTP ${res.status}). Si vous utilisez un lien PDF, assurez-vous qu'il s'agit d'un lien de téléchargement direct et non d'une page Web.`);
      }

      if (!res.ok || !data.success || !data.result) {
        throw new Error(data.error || 'Erreur lors de l\'analyse par l\'Assistant IA');
      }

      const resObj = data.result;
      if (resObj.title) setTitle(resObj.title);
      if (resObj.subtitle) setSubtitle(resObj.subtitle);
      if (resObj.description) setDescription(resObj.description);
      if (resObj.htmlContent) setHtmlContent(resObj.htmlContent);

      const providerLabel = effectiveProvider.toUpperCase();
      setSuccessNotice(`🚀 Cours intégralement structuré et formaté au design AS-MEDIX par l'IA (${providerLabel}) ! (Titre, sous-titre, description et HTML générés)`);
      setAiModalOpen(false);
    } catch (err: any) {
      setAiError(err.message || 'Erreur d\'exécution de l\'Assistant IA');
    } finally {
      setAiProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'content') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setErrorMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      const safeBlob = new Blob([buffer], { type: file.type || 'application/octet-stream' });
      const safeName = (file.name || 'file').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_.-]/g, "_");
      const formData = new FormData();
      formData.append('file', safeBlob, safeName);
      formData.append('folder', target === 'cover' ? 'covers' : 'attachments');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors du téléversement');
      }

      if (target === 'cover') {
        setCoverImage(data.url);
        setSuccessNotice(`Image téléversée avec succès dans Supabase Cloud !`);
      } else {
        if (file.type.startsWith('image/')) {
          insertSnippet(`\n<div class="my-4 text-center">\n  <img src="${data.url}" alt="${file.name}" class="rounded-2xl max-w-full mx-auto shadow-md border border-navy-200 dark:border-navy-700" />\n  <p class="text-xs text-navy-500 mt-1 italic">${file.name}</p>\n</div>\n`);
        } else {
          insertSnippet(`\n<div class="p-4 my-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between gap-3">\n  <div class="flex items-center gap-2">\n    <span class="text-xl">📄</span>\n    <div>\n      <p class="text-xs font-bold text-navy-900 dark:text-white">${file.name}</p>\n      <p class="text-[10px] text-navy-500">Document hébergé sur Supabase Cloud Storage</p>\n    </div>\n  </div>\n  <a href="${data.url}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all">\n    Consulter / Télécharger\n  </a>\n</div>\n`);
        }
        setSuccessNotice(`Fichier "${file.name}" téléversé dans Supabase et inséré dans le cours !`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors du téléversement vers Supabase');
    } finally {
      setUploadingFile(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSetViewMode = (mode: 'code' | 'split' | 'preview') => {
    setViewMode(mode);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).setViewMode = handleSetViewMode;
    }
    return () => {
      if (typeof window !== 'undefined') {
        try {
          delete (window as any).setViewMode;
        } catch (_) {}
      }
    };
  }, []);

  const defaultTemplate = `<section id="intro" class="mb-8">
  <h2 class="text-2xl font-bold text-navy-950 dark:text-white mb-3">1. Introduction & Définition</h2>
  <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
    Insérez ici le contenu introductif et les définitions clés de la pathologie médicale.
  </p>
  <div class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200">
    💡 <strong>Perle Clinique :</strong> Règle sémiologique fondamentale à retenir pour le concours.
  </div>
</section>

<section id="clinique" class="mb-8">
  <h2 class="text-2xl font-bold text-navy-950 dark:text-white mb-3">2. Présentation Clinique & Diagnostic</h2>
  <ul class="list-disc pl-6 space-y-2 text-navy-700 dark:text-navy-300">
    <li><strong>Signe clinique n°1 :</strong> Symptomatologie d'apparition aiguë</li>
    <li><strong>Examen physique :</strong> Auscultation et constantes vitales</li>
  </ul>
</section>

<section id="traitement" class="mb-8">
  <h2 class="text-2xl font-bold text-navy-950 dark:text-white mb-3">3. Prise en Charge Thérapeutique</h2>
  <div class="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 dark:bg-rose-950/30 text-xs sm:text-sm text-rose-900 dark:text-rose-200 mb-4">
    🚨 <strong>Alerte Rouge Urgence :</strong> Signes de gravité nécessitant une hospitalisation immédiate en USIC/Réanimation.
  </div>
  <p class="text-navy-700 dark:text-navy-300 leading-relaxed">
    Mesures symptomatiques et étiologiques de première intention selon les recommandations nationales algériennes.
  </p>
</section>`;

  const [htmlContent, setHtmlContent] = useState(defaultTemplate);

  // Fetch dynamic specialties
  useEffect(() => {
    fetch('/api/specialties')
      .then(r => r.json())
      .then(d => {
        if (d.specialties && Array.isArray(d.specialties) && d.specialties.length > 0) {
          setSpecialtiesList(d.specialties);
        }
      })
      .catch(() => {});
  }, []);

  // Load existing course if editing
  useEffect(() => {
    if (!courseId) return;

    let isMounted = true;
    async function loadCourse() {
      try {
        setInitialLoading(true);
        const res = await fetch(`/api/admin/courses?id=${encodeURIComponent(courseId!)}`);
        if (!res.ok) {
          throw new Error('Impossible de charger le cours spécifié.');
        }
        const data = await res.json();
        const c = data.course;
        if (!c || !isMounted) return;

        setTitle(c.title || '');
        setSubtitle(c.subtitle || '');
        setDescription(c.description || '');
        if (c.year) setYear(Number(c.year));
        else setYear('');
        setSpecialtyId(c.specialtyId || 'cardio');
        setAuthor(c.author || 'Pr. Karim Benali');
        setAuthorTitle(c.authorTitle || 'Chef de Service Hospitalo-Universitaire');
        setCoverImage(c.coverImage || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200');
        setDifficulty(c.difficulty || 'Incontournable');
        setFaculty(c.faculty || 'ORAN');
        setSource(c.source || 'Externat');
        setRang(c.rang || 'Rang A');
        setEstimatedDuration(c.estimatedDuration || '35 min');
        setAccessLevel(c.accessLevel || 'FREE');
        setTagsInput(Array.isArray(c.tags) ? c.tags.join(', ') : (c.tags || ''));
        setIsPublished(Boolean(c.published));
        setHtmlContent(c.htmlContent || defaultTemplate);
        setCurrentSlug(c.slug || '');
      } catch (err: any) {
        if (isMounted) setErrorMessage(err.message || 'Erreur lors du chargement');
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    }

    loadCourse();
    return () => { isMounted = false; };
  }, [courseId]);

  // Snippet inserter into textarea
  const insertSnippet = (snippetHtml: string) => {
    if (!textareaRef.current) {
      setHtmlContent(prev => prev + '\n' + snippetHtml);
      return;
    }
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const current = el.value;
    const updated = current.substring(0, start) + snippetHtml + current.substring(end);
    setHtmlContent(updated);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + snippetHtml.length, start + snippetHtml.length);
    }, 50);
  };

  const handleAutoFormat = () => {
    const formatted = autoFormatCourseHtml(htmlContent);
    setHtmlContent(formatted.htmlContent);
    setSuccessNotice("✨ Code HTML mis en forme automatiquement avec le design AS MEDIX (0 perte de texte) !");
  };

  const handleAutoExtractMetadata = (htmlToParse?: string) => {
    const targetHtml = htmlToParse !== undefined ? htmlToParse : htmlContent;
    const meta = extractMetadataFromHtml(targetHtml);
    let count = 0;

    if (meta.title) {
      setTitle(meta.title);
      count++;
    }
    if (meta.subtitle) {
      setSubtitle(meta.subtitle);
      count++;
    }
    if (meta.description) {
      setDescription(meta.description);
      count++;
    }

    if (count > 0) {
      setSuccessNotice(`✨ ${count} champ(s) (Titre, Sous-titre, Description) extrait(s) automatiquement du code HTML ! Vous pouvez les modifier ci-dessous.`);
    } else {
      setErrorMessage("⚠️ Aucun titre ou paragraphe significatif n'a pu être extrait du code HTML.");
    }
  };

  const handleHtmlPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && (pastedText.includes('<') || pastedText.length > 40)) {
      setTimeout(() => {
        handleAutoExtractMetadata(pastedText);
      }, 100);
    }
  };

  const handleSave = async (publishNow: boolean) => {
    if (!title.trim()) {
      alert('Veuillez renseigner le titre du cours.');
      return;
    }

    setSaving(true);
    setSuccessNotice(null);
    setErrorMessage(null);

    const finalHtml = convertMode === 'THEME' ? autoFormatCourseHtml(htmlContent).htmlContent : htmlContent;
    if (convertMode === 'THEME') {
      setHtmlContent(finalHtml);
    }

    const spec = specialtiesList.find(s => s.id === specialtyId) || ALL_SPECIALTIES.find(s => s.id === specialtyId);
    const computedSlug = currentSlug || title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const payload: any = {
        title,
        subtitle,
        slug: computedSlug,
        year: year !== '' ? Number(year) : undefined,
        specialtyId,
        specialtyName: spec?.name || 'Cardiologie',
        author,
        authorTitle,
        description,
        coverImage,
        difficulty,
        faculty,
        source,
        rang,
        estimatedDuration,
        accessLevel,
        tags,
        published: publishNow,
        htmlContent: finalHtml,
      };

      if (isEditMode) {
        payload.id = courseId;
        payload.action = 'update';
      }

      const res = await fetch('/api/admin/courses', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      setIsPublished(publishNow);
      if (data.course?.slug) setCurrentSlug(data.course.slug);

      setSuccessNotice(isEditMode 
        ? (publishNow ? 'Cours mis à jour et publié avec succès !' : 'Modifications enregistrées !')
        : (publishNow ? 'Nouveau cours publié avec succès !' : 'Brouillon enregistré avec succès !')
      );

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Auto redirect after 1.5s if newly created
      if (!isEditMode) {
        setTimeout(() => {
          router.push('/admin/cours');
        }, 1200);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-xs font-bold text-navy-500">Chargement des données du cours...</p>
      </div>
    );
  }

  const selectedSpec = ALL_SPECIALTIES.find(s => s.id === specialtyId);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-200 dark:border-navy-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cours"
            className="p-2 rounded-xl bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300 hover:text-brand-600 transition-colors"
            title="Retour à la liste des cours"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">{getSpecialtyEmoji(specialtyId)}</span>
              <h1 className="text-xl font-black text-navy-950 dark:text-white">
                {isEditMode ? `Modifier : ${title || 'Cours sans titre'}` : 'Nouveau Cours Médical'}
              </h1>
            </div>
            <p className="text-xs text-navy-500">
              {isEditMode ? 'Mise à jour en temps réel avec aperçu immédiat.' : 'Conception de cours conforme aux standards universitaires.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleOpenAiModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer border border-purple-400/30"
            title="Ouvrir l'Assistant IA (Google AI Studio & OpenRouter) pour formater et extraire le cours"
          >
            <Bot className="w-4 h-4 text-purple-200 animate-bounce" />
            <span>🤖 Assistant IA Médical (Gemini & OpenRouter)</span>
          </button>

          {currentSlug && (
            <Link
              href={`/cours/${currentSlug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-navy-100 hover:bg-navy-200 dark:bg-navy-800 dark:hover:bg-navy-750 text-navy-700 dark:text-navy-200 transition-all border border-navy-200 dark:border-navy-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Voir côté étudiant</span>
            </Link>
          )}

          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-navy-300 dark:border-navy-700 text-navy-800 dark:text-white hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer brouillon'}
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>{isEditMode ? (isPublished ? 'Mettre à jour' : 'Publier le cours') : 'Publier le cours'}</span>
          </button>
        </div>
      </div>

      {/* Prominent Floating AI Assistant Hero Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-navy-900 text-white border border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black bg-purple-500/20 text-purple-200 border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Générateur Automatique de Cours par IA Médicale</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Collez un Poly / PDF brut ➔ L'IA extrait le Titre, Sous-titre & HTML AS-MEDIX
            </h2>
            <p className="text-xs text-purple-200/90 leading-relaxed">
              Support complet de <strong>Google AI Studio (Gemini 2.5 Flash / Pro)</strong> et <strong>OpenRouter API</strong> (Gemini, Claude, GPT-4o, DeepSeek). Formatage 100% automatique avec les conteneurs d'alertes médicales et perles cliniques.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAiModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500 hover:from-amber-300 hover:to-indigo-400 text-navy-950 font-black text-xs shadow-lg hover:shadow-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer border border-amber-300/40"
          >
            <Wand2 className="w-4 h-4 text-navy-950 animate-spin" />
            <span>Lancer l'Assistant IA Main-Libre 🚀</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Course Metadata (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
            <h3 className="text-xs font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <span>Informations Générales</span>
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-navy-700 dark:text-navy-300">
                  Titre du cours *
                </label>
                <button
                  type="button"
                  onClick={() => handleAutoExtractMetadata()}
                  className="text-[10px] font-bold text-amber-700 dark:text-amber-300 hover:text-amber-800 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60 transition-all"
                  title="Extraire automatiquement le titre, sous-titre et la description depuis le code HTML"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Auto-remplir de l'HTML</span>
                </button>
              </div>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="ex: Le Rétrécissement Aortique"
                className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1">
                Sous-titre / Thématique
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="ex: Étiologie, auscultation et gradient écho"
                className="w-full px-3.5 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1">
                Description synthétique
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Bref résumé clinique du cours présenté aux étudiants..."
                className="w-full px-3.5 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
              />
            </div>

            {/* Medical Year (Optional) */}
            <div>
              <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-black text-brand-600 dark:text-brand-400">
                  <School className="w-3.5 h-3.5" />
                  Année d'Études Médicales (Optionnel)
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Filtre les modules</span>
              </label>
              <select
                value={year}
                onChange={e => {
                  const val = e.target.value;
                  const yr = val ? Number(val) : '';
                  setYear(yr);
                  const filtered = yr ? specialtiesList.filter(s => s.year === yr) : specialtiesList;
                  if (filtered.length > 0 && !filtered.some(s => s.id === specialtyId)) {
                    setSpecialtyId(filtered[0].id);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-brand-500/40 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-950/20 text-xs font-black text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">🌐 Sans année spécifique / Module Transversal</option>
                {MEDICAL_YEARS.map(y => (
                  <option key={y.year} value={y.year}>
                    🎓 {y.name} ({y.cycle})
                  </option>
                ))}
              </select>
            </div>

            {/* Specialty & Faculty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1">
                  Module / Spécialité *
                </label>
                <select
                  value={specialtyId}
                  onChange={e => setSpecialtyId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {specialtiesList.filter(s => !year || s.year === year || !s.year).length === 0 ? (
                    <option value="" disabled>Aucun module disponible</option>
                  ) : (
                    specialtiesList
                      .filter(s => !year || s.year === year || !s.year)
                      .map(s => (
                        <option key={s.id} value={s.id}>
                          {getSpecialtyEmoji(s.id)} {s.name} {s.year ? `(${s.year}A)` : '(Transversal)'}
                        </option>
                      ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1">
                  Faculté Cible *
                </label>
                <select
                  value={faculty}
                  onChange={e => setFaculty(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-amber-50 dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="ORAN">🏛️ Oran (Chalabi)</option>
                  <option value="SIDI_BEL_ABBES">🏛️ Sidi Bel Abbès</option>
                  <option value="TOUS">🌐 Tronc Commun / Tous</option>
                </select>
              </div>
            </div>

            {/* Source & Rang */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1">
                  Source Référence
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  placeholder="ex: Externat, SIAU"
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-semibold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1">
                  Rang Concours
                </label>
                <select
                  value={rang}
                  onChange={e => setRang(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Rang A">Rang A (Incontournable)</option>
                  <option value="Rang B">Rang B (Spécialisé)</option>
                  <option value="Rang C">Rang C (Approfondi)</option>
                </select>
              </div>
            </div>

            {/* Difficulty & Access Level */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1">
                  Difficulté
                </label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Fondamental">Fondamental</option>
                  <option value="Incontournable">Incontournable</option>
                  <option value="Avancé">Avancé</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1">
                  Accès
                </label>
                <select
                  value={accessLevel}
                  onChange={e => setAccessLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="FREE">GRATUIT (0 DA)</option>
                  <option value="PRO">PRO (4 500 DA)</option>
                  <option value="PREMIUM">PREMIUM (7 000 DA)</option>
                </select>
              </div>
            </div>

            {/* Duration & Cover Image */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1">
                  Durée estimée
                </label>
                <input
                  type="text"
                  value={estimatedDuration}
                  onChange={e => setEstimatedDuration(e.target.value)}
                  placeholder="35 min"
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-navy-700 dark:text-navy-300">
                    Image de couverture
                  </label>
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    disabled={uploadingFile}
                    className="text-[10px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 disabled:opacity-50"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{uploadingFile ? 'Upload...' : 'Uploader'}</span>
                  </button>
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, 'cover')}
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  placeholder="https://... ou uploadez un fichier"
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Author & Academic Title */}
            <div>
              <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1">
                Auteur & Titre Hospitalo-Universitaire
              </label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Nom du médecin/professeur"
                className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white mb-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="text"
                value={authorTitle}
                onChange={e => setAuthorTitle(e.target.value)}
                placeholder="Titre académique (ex: Chef de Clinique)"
                className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1">
                Mots-clés / Tags (séparés par virgules)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Urgences, Diagnostic, Algérie"
                className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Content Editor & Real-Time Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* View Mode Bar + Medical Snippets (Sticky Toolbar) */}
          <div className="sticky top-14 z-30 p-3 rounded-2xl bg-white/95 dark:bg-navy-900/95 backdrop-blur-md border border-navy-100 dark:border-navy-800 shadow-md space-y-3 transition-all">
            <div className="flex items-center justify-between flex-wrap gap-2">
              {/* Mode Toggles */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-navy-100/70 dark:bg-navy-800 border border-navy-200 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => handleSetViewMode('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === 'code'
                      ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-900 shadow-sm'
                      : 'text-navy-600 dark:text-navy-400 hover:text-navy-950 dark:hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code HTML</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSetViewMode('split')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === 'split'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-navy-600 dark:text-navy-400 hover:text-navy-950 dark:hover:text-white'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Côte à côte (Split)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSetViewMode('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === 'preview'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-navy-600 dark:text-navy-400 hover:text-navy-950 dark:hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Aperçu Étudiant</span>
                </button>
              </div>

              <div className="text-[11px] text-navy-400 font-medium">
                {viewMode === 'split' ? '⚡ Toolbar Fixée • Aperçu instantané à droite' : '⚡ Toolbar Fixée au Défilement'}
              </div>
            </div>

            {/* Theme Conversion Choice Selector Bar */}
            <div className="pt-2 border-t border-navy-100 dark:border-navy-800 flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-navy-700 dark:text-navy-300 text-[11px]">
                  🎨 Rendu & Intégration Code :
                </span>
                <button
                  type="button"
                  onClick={() => setConvertMode('THEME')}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 ${
                    convertMode === 'THEME'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-navy-50 dark:bg-navy-800 text-navy-600 dark:text-navy-300 border border-navy-200 dark:border-navy-700 hover:text-navy-950 dark:hover:text-white'
                  }`}
                  title="Applique automatiquement le thème AS MEDIX sur les balises brutes sans altérer le texte"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>✨ Thème Officiel (Auto-Format 0 Perte)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConvertMode('RAW')}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 ${
                    convertMode === 'RAW'
                      ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-900 shadow-sm'
                      : 'bg-navy-50 dark:bg-navy-800 text-navy-600 dark:text-navy-300 border border-navy-200 dark:border-navy-700 hover:text-navy-950 dark:hover:text-white'
                  }`}
                  title="Conserve le code HTML/CSS brut exactement tel quel sans aucune modification"
                >
                  <Code className="w-3 h-3" />
                  <span>📄 Code HTML/CSS Brut D'origine</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAutoExtractMetadata()}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
                  title="Extraire le Titre, Sous-titre et Description depuis le code HTML"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>🔍 Auto-extraire Titre & Description</span>
                </button>

                {convertMode === 'THEME' && (
                  <button
                    type="button"
                    onClick={handleAutoFormat}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-xs flex items-center gap-1 transition-all"
                    title="Convertir immédiatement le code actuel vers le thème officiel sans supprimer ni ajouter d'information"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>Convertir Maintenant</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Insertion Toolbar */}
            <div className="pt-2 border-t border-navy-100 dark:border-navy-800 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-navy-400 uppercase mr-1">Insérer :</span>
              
              <button
                type="button"
                onClick={() => insertSnippet('\n<h2 class="text-2xl font-bold text-navy-950 dark:text-white mb-3">Titre de Section</h2>\n')}
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-navy-50 hover:bg-navy-100 dark:bg-navy-800 dark:hover:bg-navy-750 text-navy-700 dark:text-navy-300 border border-navy-200 dark:border-navy-700"
              >
                H2 Titre
              </button>

              <button
                type="button"
                onClick={() => insertSnippet('\n<h3 class="text-lg font-bold text-navy-900 dark:text-white mb-2">Sous-titre</h3>\n')}
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-navy-50 hover:bg-navy-100 dark:bg-navy-800 dark:hover:bg-navy-750 text-navy-700 dark:text-navy-300 border border-navy-200 dark:border-navy-700"
              >
                H3 Sous-titre
              </button>

              <button
                type="button"
                onClick={() => insertSnippet('\n<div class="note p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 my-4">\n  💡 <strong>Note / Perle Clinique :</strong> Règle sémiologique ou mnémotechnique essentielle.\n</div>\n')}
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
              >
                💡 Note / Perle
              </button>

              <button
                type="button"
                onClick={() => insertSnippet('\n<div class="rappel p-4 rounded-2xl bg-amber-50/80 border border-amber-200 dark:bg-amber-950/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200 my-4">\n  📌 <strong>Rappel :</strong> Rappel physiopathologique ou prérequis de 3ème année.\n</div>\n')}
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
              >
                📌 Rappel
              </button>

              <button
                type="button"
                onClick={() => insertSnippet('\n<div class="piege p-4 rounded-2xl bg-orange-50/80 border border-orange-200 dark:bg-orange-950/30 text-xs sm:text-sm text-orange-900 dark:text-orange-200 my-4">\n  ⚠️ <strong>Piège Concours :</strong> Attention à la confusion fréquente dans les propositions QCM !\n</div>\n')}
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
              >
                ⚠️ Piège
              </button>

              <button
                type="button"
                onClick={() => insertSnippet('\n<div class="urgence p-4 rounded-2xl bg-rose-50/80 border border-rose-200 dark:bg-rose-950/30 text-xs sm:text-sm text-rose-900 dark:text-rose-200 my-4">\n  🚨 <strong>Alerte Urgence :</strong> Signes de gravité nécessitant une conduite à tenir immédiate.\n</div>\n')}
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
              >
                🚨 Urgence
              </button>

              <button
                type="button"
                onClick={() => insertSnippet('\n<div class="traitement p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/30 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 my-4">\n  💊 <strong>Traitement :</strong> Posologies, contre-indications et durée du traitement.\n</div>\n')}
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              >
                💊 Traitement
              </button>

              <button
                type="button"
                onClick={() => insertSnippet('\n<div class="point-cle p-4 rounded-2xl bg-sky-50/70 border border-sky-200 dark:bg-sky-950/30 text-xs sm:text-sm text-sky-900 dark:text-sky-200 my-4">\n  ⭐ <strong>Point Clé :</strong> Synthèse incontournable du chapitre.\n</div>\n')}
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
              >
                ⭐ Point Clé
              </button>

              <button
                type="button"
                onClick={() => insertSnippet('\n<button onclick="if(document.fullscreenElement){document.exitFullscreen()}else{document.documentElement.requestFullscreen()}" class="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 my-4">\n  🖥️ Basculer en Plein Écran\n</button>\n')}
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
              >
                🖥️ Bouton Plein Écran
              </button>

              <button
                type="button"
                onClick={() => insertSnippet('\n<div class="qcm-interactive-card p-5 my-6 rounded-2xl bg-navy-900 text-white border border-navy-700 shadow-lg">\n  <div class="flex items-center justify-between mb-3">\n    <span class="text-xs font-black uppercase tracking-wider text-amber-400">❓ QCM Entraînement #1</span>\n    <span class="text-[10px] font-bold bg-navy-800 px-2 py-0.5 rounded text-navy-300">Externat Oran</span>\n  </div>\n  <p class="font-bold text-sm text-white mb-4">Quel est le traitement de première intention du syndrome coronaire aigu avec sus-décalage du segment ST à H2 ?</p>\n  <div class="space-y-2 text-xs mb-4">\n    <label class="flex items-center gap-3 p-2.5 rounded-xl bg-navy-800/80 border border-navy-700 hover:bg-navy-750 cursor-pointer transition-all">\n      <input type="checkbox" class="w-4 h-4 rounded text-brand-500" />\n      <span>A. Angioplastie coronaire transluminale primaire</span>\n    </label>\n    <label class="flex items-center gap-3 p-2.5 rounded-xl bg-navy-800/80 border border-navy-700 hover:bg-navy-750 cursor-pointer transition-all">\n      <input type="checkbox" class="w-4 h-4 rounded text-brand-500" />\n      <span>B. Fibrinolyse IV aux urgences</span>\n    </label>\n    <label class="flex items-center gap-3 p-2.5 rounded-xl bg-navy-800/80 border border-navy-700 hover:bg-navy-750 cursor-pointer transition-all">\n      <input type="checkbox" class="w-4 h-4 rounded text-brand-500" />\n      <span>C. Traitement médical seul par Aspirine + Clopidogrel</span>\n    </label>\n  </div>\n  <details class="text-xs bg-navy-950 p-3 rounded-xl border border-navy-800 text-emerald-400">\n    <summary class="font-bold cursor-pointer hover:underline text-white">Voir la réponse & explication</summary>\n    <p class="mt-2 text-navy-200"><strong>Réponse exacte : A.</strong> L\'angioplastie primaire est le traitement de choix si réalisable dans les 120 minutes suivant le premier contact médical.</p>\n  </details>\n</div>\n')}
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
              >
                ❓ QCM Intégré
              </button>

              <button
                type="button"
                onClick={() => insertSnippet('\n<table class="w-full my-4 text-xs border-collapse border border-navy-200 dark:border-navy-700">\n  <thead>\n    <tr class="bg-navy-100 dark:bg-navy-800">\n      <th class="p-2 border border-navy-200 dark:border-navy-700 text-left">Critère</th>\n      <th class="p-2 border border-navy-200 dark:border-navy-700 text-left">Étiologie A</th>\n      <th class="p-2 border border-navy-200 dark:border-navy-700 text-left">Étiologie B</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td class="p-2 border border-navy-200 dark:border-navy-700 font-bold">Terrain</td>\n      <td class="p-2 border border-navy-200 dark:border-navy-700">Sujet jeune</td>\n      <td class="p-2 border border-navy-200 dark:border-navy-700">Sujet âgé avec FdR</td>\n    </tr>\n  </tbody>\n</table>\n')}
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-navy-50 hover:bg-navy-100 dark:bg-navy-800 dark:hover:bg-navy-750 text-navy-700 dark:text-navy-300 border border-navy-200 dark:border-navy-700"
              >
                📊 Tableau
              </button>

              <button
                type="button"
                onClick={() => contentFileInputRef.current?.click()}
                disabled={uploadingFile}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 flex items-center gap-1.5 disabled:opacity-50"
                title="Téléverser un document ou image directement dans Supabase"
              >
                <Upload className="w-3 h-3 text-brand-600" />
                <span>{uploadingFile ? 'Envoi Supabase...' : '☁️ Uploader Fichier vers Supabase'}</span>
              </button>
              <input
                ref={contentFileInputRef}
                type="file"
                onChange={e => handleFileUpload(e, 'content')}
                className="hidden"
              />
            </div>
          </div>

          {/* Editors according to viewMode */}
          {viewMode === 'code' && (
            <div className="bg-white dark:bg-navy-900 p-4 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-soft">
              <textarea
                ref={textareaRef}
                value={htmlContent}
                onChange={e => setHtmlContent(e.target.value)}
                onPaste={handleHtmlPaste}
                rows={26}
                className="w-full font-mono text-xs text-navy-900 dark:text-navy-100 bg-navy-50/60 dark:bg-navy-950 p-4 rounded-2xl border border-navy-200 dark:border-navy-800 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed resize-y"
              />
            </div>
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* Left pane: Code */}
              <div className="bg-white dark:bg-navy-900 p-4 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-soft">
                <div className="text-[11px] font-bold text-navy-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" />
                  <span>Éditeur Code Source HTML</span>
                </div>
                <textarea
                  ref={textareaRef}
                  value={htmlContent}
                  onChange={e => setHtmlContent(e.target.value)}
                onPaste={handleHtmlPaste}
                  rows={26}
                  className="w-full font-mono text-xs text-navy-900 dark:text-navy-100 bg-navy-50/60 dark:bg-navy-950 p-3 rounded-2xl border border-navy-200 dark:border-navy-800 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed resize-y"
                />
              </div>

              {/* Right pane: Live Real-Time Preview */}
              <div className="bg-white dark:bg-navy-900 p-6 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-soft min-h-[500px] max-h-[700px] overflow-y-auto">
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 pb-2 border-b border-navy-100 dark:border-navy-800">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Aperçu Étudiant en Direct</span>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-brand-100 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 mr-2">
                    {selectedSpec?.name || 'Spécialité'}
                  </span>
                  <span className="text-[10px] font-bold text-navy-400">
                    {faculty === 'ORAN' ? 'Faculté d\'Oran' : faculty === 'SIDI_BEL_ABBES' ? 'Faculté Sidi Bel Abbès' : 'Toutes Facultés'}
                  </span>
                  <h1 className="text-2xl font-black text-navy-950 dark:text-white mt-1">
                    {title || 'Titre du Cours...'}
                  </h1>
                  {subtitle && (
                    <p className="text-xs text-navy-500 dark:text-navy-400 mt-1">{subtitle}</p>
                  )}
                </div>

                <div 
                  className="prose dark:prose-invert max-w-none text-navy-900 dark:text-navy-100 text-xs sm:text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            </div>
          )}

          {viewMode === 'preview' && (
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="pb-6 border-b border-navy-100 dark:border-navy-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/50">
                      {getSpecialtyEmoji(specialtyId)} {selectedSpec?.name || 'Cardiologie'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300">
                      {rang}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                      {accessLevel}
                    </span>
                  </div>

                  <h1 className="text-3xl font-black text-navy-950 dark:text-white">
                    {title || 'Titre du Cours'}
                  </h1>
                  {subtitle && (
                    <p className="text-sm font-medium text-navy-500 dark:text-navy-400 mt-1.5">{subtitle}</p>
                  )}

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-navy-50 dark:border-navy-800/60 text-xs text-navy-400">
                    <div>Auteur : <strong className="text-navy-700 dark:text-navy-200">{author}</strong></div>
                    <div>Source : <strong className="text-navy-700 dark:text-navy-200">{source}</strong></div>
                    <div>Durée : <strong className="text-navy-700 dark:text-navy-200">{estimatedDuration}</strong></div>
                  </div>
                </div>

                <div
                  className="prose dark:prose-invert max-w-none text-navy-900 dark:text-navy-100 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* UNIFIED AI ASSISTANT MODAL (GOOGLE AI STUDIO & OPENROUTER) */}
      {/* ========================================================================= */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-navy-100 dark:border-navy-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-navy-950 dark:text-white flex items-center gap-2">
                    Assistant IA Médical AS-MEDIX
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      Multi-Moteur ⚡
                    </span>
                  </h3>
                  <p className="text-xs text-navy-500 dark:text-navy-400">
                    Extrait le Titre, Sous-titre, Description, Points Clés & Code HTML AS-MEDIX en 1 clic.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="p-1.5 rounded-xl text-navy-400 hover:text-navy-700 dark:hover:text-white hover:bg-navy-100 dark:hover:bg-navy-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {aiError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {/* Provider Selector Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-navy-700 dark:text-navy-300">
                Fournisseur IA (Choix du Moteur) :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAiProvider('google_ai_studio');
                    setSelectedAiModel('gemini-2.5-flash');
                  }}
                  className={`p-3 rounded-2xl border-2 text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                    aiProvider === 'google_ai_studio'
                      ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 text-brand-950 dark:text-white shadow-sm'
                      : 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800/60 text-navy-600 dark:text-navy-400 hover:border-navy-300'
                  }`}
                >
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✨
                  </div>
                  <div>
                    <div className="text-xs font-black flex items-center gap-1">
                      <span>Google AI</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold">Gratuit</span>
                    </div>
                    <p className="text-[10px] text-navy-500 dark:text-navy-400 mt-0.5">
                      Gemini 2.5 Flash / Pro.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAiProvider('openrouter');
                    setSelectedAiModel('google/gemini-2.5-flash');
                  }}
                  className={`p-3 rounded-2xl border-2 text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                    aiProvider === 'openrouter'
                      ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-white shadow-sm'
                      : 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800/60 text-navy-600 dark:text-navy-400 hover:border-navy-300'
                  }`}
                >
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    🌐
                  </div>
                  <div>
                    <div className="text-xs font-black flex items-center gap-1">
                      <span>OpenRouter</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500 text-white font-bold">Hub</span>
                    </div>
                    <p className="text-[10px] text-navy-500 dark:text-navy-400 mt-0.5">
                      Gemini, Claude, GPT, DeepSeek.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAiProvider('direct_api');
                    const detected = detectApiProvider(directApiKey);
                    if (detected.models.length > 0) {
                      setSelectedAiModel(detected.models[0].value);
                    }
                  }}
                  className={`p-3 rounded-2xl border-2 text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                    aiProvider === 'direct_api'
                      ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-white shadow-sm'
                      : 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800/60 text-navy-600 dark:text-navy-400 hover:border-navy-300'
                  }`}
                >
                  <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ⚡
                  </div>
                  <div>
                    <div className="text-xs font-black flex items-center gap-1">
                      <span>Clé API Directe</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-600 text-white font-bold">Auto</span>
                    </div>
                    <p className="text-[10px] text-navy-500 dark:text-navy-400 mt-0.5">
                      Détection OpenAI, Claude, DeepSeek...
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Provider Configuration (Key & Model) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-navy-50/70 dark:bg-navy-950/50 border border-navy-100 dark:border-navy-800">
              {aiProvider === 'google_ai_studio' && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-amber-500" />
                        <span>Clé API Google AI Studio</span>
                      </label>
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-amber-600 hover:underline flex items-center gap-0.5"
                      >
                        <span>Obtenir une clé</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <input
                      type="password"
                      value={googleAiKey}
                      onChange={e => setGoogleAiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-[10px] text-navy-400 mt-1">Sauvegardée localement sur votre navigateur.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1 flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-amber-500" />
                      <span>Modèle Gemini</span>
                    </label>
                    <select
                      value={selectedAiModel}
                      onChange={e => setSelectedAiModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="gemini-2.5-flash">⚡ Gemini 2.5 Flash (Ultra Rapide & Recommandé)</option>
                      <option value="gemini-2.5-pro">🧠 Gemini 2.5 Pro (Haute Raisonnement)</option>
                      <option value="gemini-1.5-flash">🚀 Gemini 1.5 Flash</option>
                    </select>
                  </div>
                </>
              )}

              {aiProvider === 'openrouter' && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-purple-500" />
                        <span>Clé API OpenRouter</span>
                      </label>
                      <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-purple-600 hover:underline flex items-center gap-0.5"
                      >
                        <span>Obtenir clé OpenRouter</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <input
                      type="password"
                      value={openRouterKey}
                      onChange={e => setOpenRouterKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-[10px] text-navy-400 mt-1">Sauvegardée localement sur votre navigateur.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1 flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-purple-500" />
                      <span>Modèle IA OpenRouter</span>
                    </label>
                    <select
                      value={selectedAiModel}
                      onChange={e => setSelectedAiModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="google/gemini-2.5-flash">⚡ Gemini 2.5 Flash (Ultra Rapide & Recommandé)</option>
                      <option value="anthropic/claude-3.5-haiku">🧠 Claude 3.5 Haiku (Haute Précision)</option>
                      <option value="openai/gpt-4o-mini">🚀 GPT-4o Mini (OpenAI)</option>
                      <option value="deepseek/deepseek-r1">🔬 DeepSeek R1 (Raisonnement)</option>
                    </select>
                  </div>
                </>
              )}

              {aiProvider === 'direct_api' && (() => {
                const detected = detectApiProvider(directApiKey);
                return (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 flex items-center gap-1">
                          <Key className="w-3.5 h-3.5 text-teal-500" />
                          <span>Clé API Directe</span>
                        </label>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${detected.badgeColor}`}>
                          {detected.label}
                        </span>
                      </div>
                      <input
                        type="password"
                        value={directApiKey}
                        onChange={e => {
                          const val = e.target.value;
                          setDirectApiKey(val);
                          const det = detectApiProvider(val);
                          if (det.models.length > 0 && !det.models.some(m => m.value === selectedAiModel)) {
                            setSelectedAiModel(det.models[0].value);
                          }
                        }}
                        placeholder="Collez votre clé (sk-..., AIzaSy..., sk-or-v1-..., sk-ant-..., sk-dsk-...)"
                        className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <p className="text-[10px] text-navy-400 mt-1">
                        Plateforme auto-détectée par le préfixe de votre clé API.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-700 dark:text-navy-300 mb-1 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-teal-500" />
                        <span>Modèles Détectés ({detected.models.length})</span>
                      </label>
                      <select
                        value={selectedAiModel}
                        onChange={e => setSelectedAiModel(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        {detected.models.map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Content Input Mode Selector (Text vs PDF Link) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-navy-700 dark:text-navy-300">
                  Source du cours à convertir (100% Préservation du Contenu) :
                </label>
                <div className="flex items-center gap-1 bg-navy-100 dark:bg-navy-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAiInputType('text')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      aiInputType === 'text'
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'text-navy-600 dark:text-navy-300 hover:text-navy-950'
                    }`}
                  >
                    📝 Texte / HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiInputType('pdfUrl')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      aiInputType === 'pdfUrl'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-navy-600 dark:text-navy-300 hover:text-navy-950'
                    }`}
                  >
                    🔗 Lien PDF Direct
                  </button>
                </div>
              </div>

              {aiInputType === 'text' ? (
                <div>
                  <textarea
                    rows={6}
                    value={aiRawInput}
                    onChange={e => setAiRawInput(e.target.value)}
                    placeholder="Collez ici l'intégralité du texte du cours, polycopié ou code HTML brut..."
                    className="w-full font-mono text-xs text-navy-900 dark:text-navy-100 bg-navy-50/70 dark:bg-navy-950 p-3 rounded-2xl border border-navy-200 dark:border-navy-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
                  />
                  <p className="text-[10px] text-navy-400 mt-1">
                    ✨ 100% du contenu copié sera préservé et sublimé avec la toolbar et les encadrés colorés.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📄</span>
                    <div>
                      <p className="text-xs font-bold text-purple-950 dark:text-purple-200">
                        Conversion Directe depuis un Lien Web PDF
                      </p>
                      <p className="text-[10px] text-navy-500">
                        Le serveur téléchargera le fichier PDF, en extraira 100% du texte et le convertira en présentation AS-MEDIX.
                      </p>
                    </div>
                  </div>
                  <input
                    type="url"
                    value={aiPdfUrl}
                    onChange={e => setAiPdfUrl(e.target.value)}
                    placeholder="https://exemple.com/cours-cardiologie.pdf ou lien Supabase Storage"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-navy-800 text-xs font-mono text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-100 dark:border-navy-800">
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                disabled={aiProcessing}
                className="px-4 py-2 rounded-xl text-xs font-bold text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleRunAi}
                disabled={aiProcessing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {aiProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyse & Formatage IA en cours...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-purple-200" />
                    <span>🚀 Analyser & Formater le Cours avec l'IA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewCourseBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-xs font-bold text-navy-500">Chargement de l'éditeur...</p>
      </div>
    }>
      <CourseEditorContent />
    </Suspense>
  );
}
