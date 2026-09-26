import {
  User, Course, Fiche, QCM, CATProtocol, ClinicalCase, ECGRecord, Medication,
  Specialty, PlatformSettings, QCMAttempt, NotificationItem, UserProgression, PaymentRequest, UserMessage, GardeProtocol, StudyReminder
} from '@/types';
import { ALL_SPECIALTIES, INITIAL_USERS, INITIAL_SETTINGS } from './seedData';
import { INITIAL_COURSES } from './seedCourses';
import { INITIAL_QCMS } from './seedQcm';
import { INITIAL_CAT } from './seedCat';
import { INITIAL_CLINICAL_CASES } from './seedClinicalCases';
import { INITIAL_ECG_RECORDS } from './seedEcg';
import { INITIAL_MEDICATIONS } from './seedMedications';
import { INITIAL_FICHES } from './seedFiches';

let fsModule: any = null;
let pathModule: any = null;
let DB_FILE_PATH = '';

if (typeof window === 'undefined') {
  try {
    fsModule = require('fs');
    pathModule = require('path');
    DB_FILE_PATH = pathModule.join(process.cwd(), 'data', 'asmedix_db.json');
  } catch (e) {}
}

interface DatabaseSchema {
  users: User[];
  courses: Course[];
  fiches: Fiche[];
  qcms: QCM[];
  qcmAttempts: QCMAttempt[];
  catProtocols: CATProtocol[];
  clinicalCases: ClinicalCase[];
  ecgRecords: ECGRecord[];
  medications: Medication[];
  specialties: Specialty[];
  settings: PlatformSettings;
  notifications: NotificationItem[];
  reminders?: StudyReminder[];
  paymentRequests?: PaymentRequest[];
  userMessages?: UserMessage[];
  gardeProtocols?: GardeProtocol[];
  // Sources stored per scope: key = "specialtyId" | "specialtyId__courseId" | "__global__"
  customSources?: Record<string, string[]>;
}

class DatabaseStore {
  private data: DatabaseSchema;
  private initialized = false;

  constructor() {
    this.data = this.getDefaultData();
    this.init();
  }

  private getDefaultData(): DatabaseSchema {
    return {
      users: [...INITIAL_USERS],
      courses: [...INITIAL_COURSES],
      fiches: [...INITIAL_FICHES],
      qcms: [...INITIAL_QCMS],
      qcmAttempts: [
        {
          id: 'att_1',
          userId: 'usr_demo_free',
          qcmId: 'qcm_tb_1',
          userAnswers: [2],
          isCorrect: true,
          scorePercentage: 100,
          timeSpentSeconds: 45,
          attemptedAt: '2026-09-04T18:30:00Z'
        },
        {
          id: 'att_2',
          userId: 'usr_demo_free',
          qcmId: 'qcm_rm_2',
          userAnswers: [0, 1], // Missed some
          isCorrect: false,
          scorePercentage: 50,
          timeSpentSeconds: 62,
          attemptedAt: '2026-09-04T19:00:00Z'
        }
      ],
      catProtocols: [...INITIAL_CAT],
      clinicalCases: [...INITIAL_CLINICAL_CASES],
      ecgRecords: [...INITIAL_ECG_RECORDS],
      medications: [...INITIAL_MEDICATIONS],
      specialties: [...ALL_SPECIALTIES],
      settings: { ...INITIAL_SETTINGS },
      notifications: [
        {
          id: 'notif_1',
          title: 'Nouveau cours disponible',
          message: 'Un nouveau tracé ECG a été ajouté à la bibliothèque.',
          date: '2026-09-04T10:00:00Z',
          type: 'course' as const,
          read: false,
          linkUrl: '/ecg'
        }
      ],
      paymentRequests: [
        {
          id: 'pay_demo_1',
          userId: 'usr_demo_free',
          userName: 'Étudiant Démo',
          userEmail: 'etudiant@asmedix.dz',
          requestedPlan: 'PRO',
          paymentMethod: 'BaridiMob',
          transactionRef: 'BM-20260905-9941',
          notes: 'Reçu de paiement 4500 DA BaridiMob',
          status: 'PENDING',
          createdAt: '2026-09-05T10:00:00Z'
        }
      ],
      userMessages: [
        {
          id: 'msg_demo_1',
          userId: 'usr_demo_free',
          userName: 'Dr. Karim Benali',
          userEmail: 'karim.benali@gmail.com',
          userPhone: '0555123456',
          profession: 'Interne en Médecine',
          subject: 'Demande de précision sur l\'Ordonnance HTA Sévère',
          category: 'Question Médicale',
          message: 'Bonjour Docteur, dans la fiche conduite à tenir sur l\'HTA sévère avec souffrance viscérale, le délai d\'abaissement de la PAM suggéré est de 20% à 25% à la première heure. Est-ce qu\'on privilégie la Nicardipine IVSE en première intention dans le service de garde d\'Oran ? Merci d\'avance !',
          status: 'UNREAD',
          createdAt: '2026-09-05T14:20:00Z'
        },
        {
          id: 'msg_demo_2',
          userId: 'usr_demo_free',
          userName: 'Dr. Yasmine Saidi',
          userEmail: 'yasmine.saidi@yahoo.fr',
          userPhone: '0770987654',
          profession: 'Médecin Généraliste',
          subject: 'Validation reçu BaridiMob Forfait PRO Résidanat',
          category: 'Abonnement / Paiement',
          message: 'Salam Alaikom, je viens d\'effectuer le virement BaridiMob pour le forfait annuel PRO (4500 DA). J\'ai joint le numéro de transaction BM-20260905-9941. Pouvez-vous activer mon accès aux annales résidanat expliquées ?',
          status: 'IN_PROGRESS',
          replyNote: 'Transaction en cours de vérification avec le bordereau CCP.',
          createdAt: '2026-09-05T11:05:00Z'
        }
      ],
      gardeProtocols: [
        {
          id: 'garde_demo_1',
          slug: 'protocole-choc-anaphylactique-h24',
          title: 'Protocole Urgence Choc Anaphylactique H24',
          category: 'Urgences Vitales',
          iconName: 'Siren',
          badge: 'URGENCE VITALE',
          description: 'Conduite immédiate, posologie Adrénaline IM/IVSE et remplissage vasculaire aux urgences.',
          htmlContent: `<div class="p-6 rounded-3xl bg-gradient-to-br from-rose-900 via-rose-800 to-slate-900 text-white space-y-6 shadow-xl border border-rose-500/30">
  <div class="flex items-center justify-between border-b border-rose-500/30 pb-4">
    <div className="flex items-center gap-3">
      <span className="p-3 bg-rose-500/20 text-rose-300 rounded-2xl border border-rose-400/30 text-xl">🚨</span>
      <div>
        <h2 className="text-xl font-black tracking-tight text-white">Choc Anaphylactique - Prise en Charge Réflexe UMC</h2>
        <p className="text-xs text-rose-200">Recommandations Nationales d'Urgence H24 • Urgence Vitale Absolue</p>
      </div>
    </div>
    <span className="px-3 py-1 bg-rose-500 text-white text-xs font-black rounded-full uppercase tracking-wider animate-pulse">
      Urgence Absolue
    </span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
      <h3 class="font-bold text-rose-300 text-sm flex items-center gap-2">
        ⚡ 1. Adrénaline IM (1ère Intention Immédiate)
      </h3>
      <ul class="text-xs space-y-1.5 text-rose-100 leading-relaxed">
        <li>• <strong>Adulte :</strong> <strong>0.5 mg IM</strong> (soit 0.5 mL de la solution 1 mg/mL 1/1000e) en face antéro-latérale de la cuisse.</li>
        <li>• <strong>Enfant :</strong> <strong>0.01 mg/kg IM</strong> (max 0.3 mg) à renouveler toutes les 5 à 15 min si non réponse.</li>
        <li>• <i>Ne jamais attendre l'avis de réanimation pour injecter l'Adrénaline IM !</i></li>
      </ul>
    </div>

    <div class="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
      <h3 class="font-bold text-rose-300 text-sm flex items-center gap-2">
        💧 2. Remplissage & Libération des Voies Aériennes
      </h3>
      <ul class="text-xs space-y-1.5 text-rose-100 leading-relaxed">
        <li>• Position décubitus dorsal avec jambes surélevées (sauf si détresse respiratoire majeure = demi-assis).</li>
        <li>• O2 au masque haute concentration 10-15 L/min.</li>
        <li>• Remplissage Cristalloïdes (Ringer Lacté) : <strong>20 mL/kg en bolus</strong> rapide sur 15 min.</li>
      </ul>
    </div>
  </div>

  <div class="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200 leading-relaxed">
    <strong class="text-rose-400 font-bold block mb-1">⚠️ Erreurs Fatales à Éviter :</strong>
    Ne pas administrer les corticoïdes ou antihistaminiques en remplacement de l'Adrénaline (délai d'action Corticoïdes = 4 à 6 heures). L'Adrénaline est le SEUL traitement de première intention du choc anaphylactique.
  </div>
</div>`,
          published: true,
          createdAt: '2026-09-06T00:00:00Z',
          updatedAt: '2026-09-06T00:00:00Z'
        },
        {
          id: 'garde_demo_2',
          slug: 'protocole-oedeme-aigu-poumon-oap',
          title: 'Protocole OAP Cardiogénique aux Urgences',
          category: 'Cardio-Respiratoire',
          iconName: 'HeartPulse',
          badge: 'H24',
          description: 'Triade VNI / Furosémide IV / Dinitrate d\'Isosorbide et titration PAM.',
          htmlContent: `<div class="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white space-y-6 shadow-xl border border-indigo-500/30">
  <div class="flex items-center justify-between border-b border-indigo-500/30 pb-4">
    <div class="flex items-center gap-3">
      <span class="p-3 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-400/30 text-xl">🫀</span>
      <div>
        <h2 className="text-xl font-black tracking-tight text-white">OAP Cardiogénique - Protocole d'Urgence H24</h2>
        <p className="text-xs text-indigo-200">Prise en charge de la poussée hypertensive et défaillance gauche</p>
      </div>
    </div>
    <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-black rounded-full uppercase tracking-wider">
      Cardiologie H24
    </span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
    <div class="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
      <h4 class="font-bold text-indigo-300">1. Position & Oxygène</h4>
      <p class="text-indigo-100">Position <strong>stricte assise</strong>, jambes pendantes. Oxygénothérapie au masque ou VNI (CPAP 5-10 cmH2O) si SpO2 &lt; 90%.</p>
    </div>

    <div class="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
      <h4 class="font-bold text-indigo-300">2. Dérivés Nitrés (Risordan)</h4>
      <p class="text-indigo-100">Si PAS &gt; 110 mmHg : Spray sublingual 2 bouffées puis <strong>Risordan IVSE 1 à 4 mg/h</strong> à titrer selon la PAS.</p>
    </div>

    <div class="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
      <h4 class="font-bold text-indigo-300">3. Diurétique de l'Anse (Lasilix)</h4>
      <p class="text-indigo-100">Furosémide (Lasilix) <strong>40 à 80 mg IV direct</strong> (ou 2x la dose habituelle du patient en IV direct).</p>
    </div>
  </div>
</div>`,
          published: true,
          createdAt: '2026-09-06T00:00:00Z',
          updatedAt: '2026-09-06T00:00:00Z'
        }
      ]
    };
  }

  private init() {
    try {
      if (!fsModule || !pathModule || !DB_FILE_PATH) {
        this.initialized = true;
        return;
      }
      const dir = pathModule.dirname(DB_FILE_PATH);
      if (!fsModule.existsSync(dir)) {
        fsModule.mkdirSync(dir, { recursive: true });
      }

        if (fsModule.existsSync(DB_FILE_PATH)) {
        const fileContent = fsModule.readFileSync(DB_FILE_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
        if (!this.data.specialties) this.data.specialties = [];
        // Ensure all 45 specialties across the 6 years are present with their year assignment
        for (const seedSpec of ALL_SPECIALTIES) {
          const existing = this.data.specialties.find(s => s.id === seedSpec.id);
          if (!existing) {
            this.data.specialties.push({ ...seedSpec });
          } else if (!existing.year) {
            existing.year = seedSpec.year;
            existing.faculty = existing.faculty || seedSpec.faculty || 'TOUS';
          }
        }
        this.updateSpecialtyCounts();
        this.updateCourseQcmCounts();
        this.save();
      } else {
        this.updateSpecialtyCounts();
        this.updateCourseQcmCounts();
        this.save();
      }
      this.initialized = true;
    } catch (e) {
      console.error('Error initializing database store:', e);
      this.data = this.getDefaultData();
      this.updateSpecialtyCounts();
      this.updateCourseQcmCounts();
    }
  }

  private isSaving = false;
  private pendingSave = false;

  private save() {
    try {
      if (!fsModule || !pathModule || !DB_FILE_PATH) return;
      const dir = pathModule.dirname(DB_FILE_PATH);
      if (!fsModule.existsSync(dir)) {
        fsModule.mkdirSync(dir, { recursive: true });
      }

      // Anti-collision atomic write:
      // 1. Write payload to unique temp file
      const tmpPath = `${DB_FILE_PATH}.tmp.${process.pid}.${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const payload = JSON.stringify(this.data, null, 2);
      fsModule.writeFileSync(tmpPath, payload, 'utf-8');

      // 2. Atomic rename (POSIX atomic, safe on Linux/Hostinger VPS and Windows)
      try {
        fsModule.renameSync(tmpPath, DB_FILE_PATH);
      } catch (renameErr) {
        // Fallback for Windows file locks if another thread has open handle
        fsModule.writeFileSync(DB_FILE_PATH, payload, 'utf-8');
        try { fsModule.unlinkSync(tmpPath); } catch {}
      }
    } catch (e) {
      console.error('Failed to persist database to disk:', e);
    }
  }

  public getUsers(): User[] {
    try {
      if (fsModule && pathModule && DB_FILE_PATH && fsModule.existsSync(DB_FILE_PATH)) {
        const fileContent = fsModule.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed.users && Array.isArray(parsed.users)) {
          this.data.users = parsed.users;
        }
      }
    } catch {}
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  public deleteUser(id: string): boolean {
    const prevLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    if (this.data.users.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- COURSES ---
  public getCourses(): Course[] {
    return this.data.courses;
  }

  public getCourseBySlug(slug: string): Course | undefined {
    return this.data.courses.find(c => c.slug === slug);
  }

  public getCourseById(id: string): Course | undefined {
    return this.data.courses.find(c => c.id === id);
  }

  public createCourse(course: Course): Course {
    this.data.courses.unshift(course);
    this.updateSpecialtyCounts();
    this.updateCourseQcmCounts();
    this.save();
    return course;
  }

  public updateCourse(id: string, updates: Partial<Course>): Course | undefined {
    const idx = this.data.courses.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.data.courses[idx] = { ...this.data.courses[idx], ...updates, updatedAt: new Date().toISOString() };
    if ('year' in updates && (updates.year === undefined || updates.year === null || (updates.year as any) === 'none' || (updates.year as any) === '')) {
      delete this.data.courses[idx].year;
    }
    this.updateSpecialtyCounts();
    this.updateCourseQcmCounts();
    this.save();
    return this.data.courses[idx];
  }

  public deleteCourse(id: string): boolean {
    const prevLen = this.data.courses.length;
    this.data.courses = this.data.courses.filter(c => c.id !== id);
    if (this.data.courses.length !== prevLen) {
      this.updateSpecialtyCounts();
      this.updateCourseQcmCounts();
      this.save();
      return true;
    }
    return false;
  }

  public duplicateCourse(id: string): Course | undefined {
    const original = this.getCourseById(id);
    if (!original) return undefined;
    const newCourse: Course = {
      ...original,
      id: `cours_${Date.now()}`,
      slug: `${original.slug}-copie-${Math.floor(Math.random() * 1000)}`,
      title: `${original.title} (Copie)`,
      published: false,
      viewsCount: 0,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.courses.unshift(newCourse);
    this.updateSpecialtyCounts();
    this.updateCourseQcmCounts();
    this.save();
    return newCourse;
  }

  // --- FICHES ---
  public getFiches(): Fiche[] {
    return this.data.fiches;
  }

  public getFicheBySlug(slug: string): Fiche | undefined {
    return this.data.fiches.find(f => f.slug === slug);
  }

  public createFiche(fiche: Fiche): Fiche {
    this.data.fiches.push(fiche);
    this.updateSpecialtyCounts();
    this.save();
    return fiche;
  }

  public deleteFiche(id: string): boolean {
    const prev = this.data.fiches.length;
    this.data.fiches = this.data.fiches.filter(f => f.id !== id);
    if (this.data.fiches.length !== prev) {
      this.updateSpecialtyCounts();
      this.save();
      return true;
    }
    return false;
  }

  // --- QCMS ---
  public getQcms(): QCM[] {
    return this.data.qcms;
  }

  public getQcmById(id: string): QCM | undefined {
    return this.data.qcms.find(q => q.id === id);
  }

  public createQcm(qcm: QCM): QCM {
    this.data.qcms.push(qcm);
    this.updateSpecialtyCounts();
    this.updateCourseQcmCounts();
    this.save();
    return qcm;
  }

  public updateQcm(id: string, updates: Partial<QCM>): QCM | undefined {
    const idx = this.data.qcms.findIndex(q => q.id === id);
    if (idx === -1) return undefined;
    this.data.qcms[idx] = { ...this.data.qcms[idx], ...updates };
    if ('year' in updates && (updates.year === undefined || updates.year === null || (updates.year as any) === 'none' || (updates.year as any) === '')) {
      delete this.data.qcms[idx].year;
    }
    this.updateSpecialtyCounts();
    this.updateCourseQcmCounts();
    this.save();
    return this.data.qcms[idx];
  }

  public deleteQcm(id: string): boolean {
    const prev = this.data.qcms.length;
    this.data.qcms = this.data.qcms.filter(q => q.id !== id);
    if (this.data.qcms.length !== prev) {
      this.updateSpecialtyCounts();
      this.updateCourseQcmCounts();
      this.save();
      return true;
    }
    return false;
  }

  public recordAttempt(attempt: QCMAttempt): QCMAttempt {
    this.data.qcmAttempts.push(attempt);
    // update user usage
    const user = this.getUserById(attempt.userId);
    if (user) {
      user.usage.qcmsAnsweredMonth += 1;
      this.save();
    }
    this.save();
    return attempt;
  }

  public getUserAttempts(userId: string): QCMAttempt[] {
    return this.data.qcmAttempts.filter(a => a.userId === userId);
  }

  // --- CAT ---
  public getCatProtocols(): CATProtocol[] {
    return this.data.catProtocols;
  }

  public getCatBySlug(slug: string): CATProtocol | undefined {
    return this.data.catProtocols.find(c => c.slug === slug);
  }

  public createCatProtocol(cat: CATProtocol): CATProtocol {
    this.data.catProtocols.push(cat);
    this.updateSpecialtyCounts();
    this.save();
    return cat;
  }

  public updateCatProtocol(id: string, updates: Partial<CATProtocol>): CATProtocol | undefined {
    const idx = this.data.catProtocols.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.data.catProtocols[idx] = { ...this.data.catProtocols[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.catProtocols[idx];
  }

  public deleteCatProtocol(id: string): boolean {
    const prev = this.data.catProtocols.length;
    this.data.catProtocols = this.data.catProtocols.filter(c => c.id !== id);
    if (this.data.catProtocols.length !== prev) {
      this.updateSpecialtyCounts();
      this.save();
      return true;
    }
    return false;
  }

  // --- CLINICAL CASES ---
  public getClinicalCases(): ClinicalCase[] {
    return this.data.clinicalCases;
  }

  public getClinicalCaseById(id: string): ClinicalCase | undefined {
    return this.data.clinicalCases.find(c => c.id === id);
  }

  public createClinicalCase(c: ClinicalCase): ClinicalCase {
    this.data.clinicalCases.push(c);
    this.save();
    return c;
  }

  public deleteClinicalCase(id: string): boolean {
    const prev = this.data.clinicalCases.length;
    this.data.clinicalCases = this.data.clinicalCases.filter(c => c.id !== id);
    if (this.data.clinicalCases.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // --- ECG ---
  public getEcgRecords(): ECGRecord[] {
    return this.data.ecgRecords;
  }

  public getEcgById(id: string): ECGRecord | undefined {
    return this.data.ecgRecords.find(e => e.id === id);
  }

  public getDailyEcg(): ECGRecord | undefined {
    return this.data.ecgRecords.find(e => e.isDailyChallenge) || this.data.ecgRecords[0];
  }

  public createEcgRecord(ecg: ECGRecord): ECGRecord {
    if (ecg.isDailyChallenge) {
      this.data.ecgRecords.forEach(e => { e.isDailyChallenge = false; });
    }
    this.data.ecgRecords.unshift(ecg);
    this.save();
    return ecg;
  }

  public deleteEcgRecord(id: string): boolean {
    const prev = this.data.ecgRecords.length;
    this.data.ecgRecords = this.data.ecgRecords.filter(e => e.id !== id);
    if (this.data.ecgRecords.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // --- MEDICATIONS ---
  public getMedications(): Medication[] {
    return this.data.medications;
  }

  public searchMedications(query: string): Medication[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.data.medications;
    return this.data.medications.filter(m =>
      m.dci.toLowerCase().includes(q) ||
      m.commercialNames.some(cn => cn.toLowerCase().includes(q)) ||
      m.therapeuticClass.toLowerCase().includes(q)
    );
  }

  public createMedication(med: Medication): Medication {
    this.data.medications.push(med);
    this.save();
    return med;
  }

  public updateMedication(id: string, updates: Partial<Medication>): Medication | undefined {
    const idx = this.data.medications.findIndex(m => m.id === id);
    if (idx === -1) return undefined;
    this.data.medications[idx] = { ...this.data.medications[idx], ...updates };
    this.save();
    return this.data.medications[idx];
  }

  public deleteMedication(id: string): boolean {
    const prev = this.data.medications.length;
    this.data.medications = this.data.medications.filter(m => m.id !== id);
    if (this.data.medications.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // --- SPECIALTIES ---
  public getSpecialties(): Specialty[] {
    return this.data.specialties || [];
  }

  public getSpecialtyBySlug(slug: string): Specialty | undefined {
    return (this.data.specialties || []).find(s => s.slug === slug || s.id === slug);
  }

  public createSpecialty(spec: Specialty): Specialty {
    if (!this.data.specialties) this.data.specialties = [];
    this.data.specialties.push(spec);
    this.updateSpecialtyCounts();
    this.save();
    return spec;
  }

  public updateSpecialty(id: string, updates: Partial<Specialty>): Specialty | undefined {
    if (!this.data.specialties) return undefined;
    const idx = this.data.specialties.findIndex(s => s.id === id || s.slug === id);
    if (idx === -1) return undefined;
    this.data.specialties[idx] = { ...this.data.specialties[idx], ...updates };
    if ('year' in updates && (updates.year === undefined || updates.year === null || (updates.year as any) === 'none')) {
      delete this.data.specialties[idx].year;
    }
    this.updateSpecialtyCounts();
    this.save();
    return this.data.specialties[idx];
  }

  public deleteSpecialty(id: string): boolean {
    if (!this.data.specialties) return false;
    const prev = this.data.specialties.length;
    this.data.specialties = this.data.specialties.filter(s => s.id !== id && s.slug !== id);
    if (this.data.specialties.length !== prev) {
      this.updateSpecialtyCounts();
      this.save();
      return true;
    }
    return false;
  }

  public updateSpecialtyCounts() {
    this.data.specialties = this.data.specialties.map(spec => {
      const courses = this.data.courses.filter(c => c.specialtyId === spec.id).length;
      const qcms = this.data.qcms.filter(q => q.specialtyId === spec.id).length;
      const cat = this.data.catProtocols.filter(c => c.specialtyId === spec.id).length;
      const fiches = this.data.fiches.filter(f => f.specialtyId === spec.id).length;
      return {
        ...spec,
        totalCourses: courses,
        totalQcms: qcms,
        totalCat: cat,
        totalFiches: fiches
      };
    });
  }

  public updateCourseQcmCounts() {
    this.data.courses = this.data.courses.map(course => {
      const count = this.data.qcms.filter(q => q.courseId === course.id).length;
      return {
        ...course,
        qcmCount: count
      };
    });
  }

  // --- STATS PAR COURS, PAR SPÉCIALITÉ ET PAR SOURCE ---
  public getUserQcmStats(userId?: string, customQcms?: QCM[]) {
    const attempts = userId ? this.getUserAttempts(userId) : this.data.qcmAttempts;
    const allQcms = customQcms || this.data.qcms;

    // Set of distinct QCM IDs user has attempted & correctly answered
    const doneQcmIdSet = new Set<string>();
    const correctQcmIdSet = new Set<string>();
    for (const a of attempts) {
      doneQcmIdSet.add(a.qcmId);
      if (a.isCorrect) {
        correctQcmIdSet.add(a.qcmId);
      }
    }
    const doneQcmIds = Array.from(doneQcmIdSet);
    const correctQcmIds = Array.from(correctQcmIdSet);

    // 1. Stats par spécialité
    const statsBySpecialty: Record<string, { totalQcms: number; doneQcms: number; correctQcms: number }> = {};
    for (const spec of this.data.specialties) {
      const specQcms = allQcms.filter(q => q.specialtyId === spec.id);
      const done = specQcms.filter(q => doneQcmIdSet.has(q.id)).length;
      const correct = specQcms.filter(q => correctQcmIdSet.has(q.id)).length;
      statsBySpecialty[spec.id] = {
        totalQcms: specQcms.length,
        doneQcms: done,
        correctQcms: correct
      };
    }

    // 2. Stats par cours
    const statsByCourse: Record<string, { totalQcms: number; doneQcms: number; correctQcms: number }> = {};
    for (const course of this.data.courses) {
      const courseQcms = allQcms.filter(q => q.courseId === course.id);
      const done = courseQcms.filter(q => doneQcmIdSet.has(q.id)).length;
      const correct = courseQcms.filter(q => correctQcmIdSet.has(q.id)).length;
      statsByCourse[course.id] = {
        totalQcms: courseQcms.length,
        doneQcms: done,
        correctQcms: correct
      };
    }

    // 3. Stats par source
    const statsBySource: Record<string, { totalQcms: number; doneQcms: number; correctQcms: number }> = {};
    for (const q of allQcms) {
      const src = (q.source || 'Autre').trim();
      if (!statsBySource[src]) {
        statsBySource[src] = { totalQcms: 0, doneQcms: 0, correctQcms: 0 };
      }
      statsBySource[src].totalQcms += 1;
      if (doneQcmIdSet.has(q.id)) {
        statsBySource[src].doneQcms += 1;
      }
      if (correctQcmIdSet.has(q.id)) {
        statsBySource[src].correctQcms += 1;
      }
    }

    return {
      totalQcms: allQcms.length,
      totalAnswered: doneQcmIds.length,
      totalCorrect: correctQcmIds.length,
      doneQcmIds,
      correctQcmIds,
      statsBySpecialty,
      statsByCourse,
      statsBySource,
      recentAttempts: [...attempts].reverse().slice(0, 20)
    };
  }

  // --- PROGRESSION & WEAK POINTS ---
  public getUserProgression(userId: string): UserProgression {
    const attempts = this.getUserAttempts(userId);
    const totalQcmAnswered = attempts.length;
    const correctAttempts = attempts.filter(a => a.isCorrect).length;
    const averageScore = totalQcmAnswered > 0 ? Math.round((correctAttempts / totalQcmAnswered) * 100) : 74;

    const specialtiesProgress = this.data.specialties.map(spec => {
      const specQcms = attempts.filter(a => {
        const q = this.getQcmById(a.qcmId);
        return q?.specialtyId === spec.id;
      });
      const specCorrect = specQcms.filter(a => a.isCorrect).length;
      const rate = specQcms.length > 0 ? Math.round((specCorrect / specQcms.length) * 100) : 65;
      const totalCourses = this.data.courses.filter(c => c.specialtyId === spec.id).length || 10;
      return {
        specialtyId: spec.id,
        specialtyName: spec.name,
        completedCourses: spec.id === 'cardio' ? 4 : spec.id === 'pneumo' ? 5 : 2,
        totalCourses,
        qcmSuccessRate: rate
      };
    });

    return {
      totalCoursesCompleted: 7,
      totalFichesRead: 14,
      totalQcmAnswered: totalQcmAnswered > 0 ? totalQcmAnswered : 42,
      averageQcmScore: averageScore,
      currentStreakDays: 8,
      totalHoursStudied: 26,
      specialtiesProgress,
      weakPoints: [
        {
          specialtyName: 'Cardiologie',
          topic: 'Valvulopathies & Écho-Doppler',
          successRate: 42,
          recommendedQcmCount: 15
        },
        {
          specialtyName: 'Néphrologie',
          topic: 'Insuffisance Rénale Aiguë & Troubles Ioniques',
          successRate: 48,
          recommendedQcmCount: 12
        },
        {
          specialtyName: 'Neurologie',
          topic: 'AVC & Scores d\'imagerie neurovasculaire',
          successRate: 55,
          recommendedQcmCount: 10
        }
      ]
    };
  }

  // --- SETTINGS ---
  public getSettings(): PlatformSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<PlatformSettings>): PlatformSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId?: string): NotificationItem[] {
    const list = this.data.notifications || [];
    if (!userId) return list;
    return list.filter(item => !item.userId || item.userId === userId);
  }

  public markNotificationRead(id: string): void {
    if (!this.data.notifications) this.data.notifications = [];
    const n = this.data.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.save();
    }
  }

  public markAllNotificationsRead(userId?: string): void {
    if (!this.data.notifications) this.data.notifications = [];
    this.data.notifications.forEach(item => {
      if (!userId || !item.userId || item.userId === userId) {
        item.read = true;
      }
    });
    this.save();
  }

  public addNotification(notification: NotificationItem): void {
    if (!this.data.notifications) this.data.notifications = [];
    this.data.notifications.unshift(notification);
    this.save();
  }

  public deleteNotification(id: string): boolean {
    if (!this.data.notifications) return false;
    const prev = this.data.notifications.length;
    this.data.notifications = this.data.notifications.filter(item => item.id !== id);
    if (this.data.notifications.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // --- STUDY REMINDERS & TRAP MARKERS ---
  public getReminders(userId?: string): StudyReminder[] {
    const list = this.data.reminders || [];
    if (!userId) return list;
    return list.filter(r => r.userId === userId);
  }

  public getReminderById(id: string): StudyReminder | null {
    if (!this.data.reminders) return null;
    return this.data.reminders.find(r => r.id === id) || null;
  }

  public saveReminder(reminder: StudyReminder): StudyReminder {
    if (!this.data.reminders) this.data.reminders = [];
    const index = this.data.reminders.findIndex(r => r.id === reminder.id);
    if (index >= 0) {
      this.data.reminders[index] = reminder;
    } else {
      this.data.reminders.unshift(reminder);
    }
    this.save();
    return reminder;
  }

  public updateReminder(id: string, updates: Partial<StudyReminder>): StudyReminder | null {
    if (!this.data.reminders) return null;
    const item = this.data.reminders.find(r => r.id === id);
    if (!item) return null;
    Object.assign(item, updates);
    this.save();
    return item;
  }

  public deleteReminder(id: string): boolean {
    if (!this.data.reminders) return false;
    const prev = this.data.reminders.length;
    this.data.reminders = this.data.reminders.filter(r => r.id !== id);
    if (this.data.reminders.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  public checkAndTriggerDueReminders(userId?: string): NotificationItem[] {
    if (!this.data.reminders) return [];
    if (!this.data.notifications) this.data.notifications = [];
    
    const now = new Date();
    const generated: NotificationItem[] = [];

    this.data.reminders.forEach(reminder => {
      if (
        reminder.status === 'pending' &&
        !reminder.notificationSent &&
        (!userId || reminder.userId === userId)
      ) {
        const sched = new Date(reminder.scheduledFor);
        if (sched <= now) {
          reminder.notificationSent = true;
          
          let linkUrl = '/dashboard';
          if (reminder.targetType === 'qcm') {
            linkUrl = `/qcm-session?qcmId=${reminder.targetId}`;
          } else if (reminder.targetType === 'cours') {
            linkUrl = `/cours/${reminder.targetId}`;
          } else if (reminder.targetType === 'cat') {
            linkUrl = `/cat/${reminder.targetId}`;
          }

          const tagPrefix = reminder.tag === 'piege' 
            ? '⚠️ Piège à Réviser' 
            : reminder.tag === 'priorite_concours' 
              ? '🎯 Priorité Concours' 
              : '🔔 Rappel de Révision';

          const notif: NotificationItem = {
            id: `notif_rem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            title: `${tagPrefix} : ${reminder.specialtyName || 'Médecine'}`,
            message: reminder.userNote 
              ? `« ${reminder.userNote} » - À revoir : ${reminder.targetTitle}`
              : `Il est l'heure de réviser : ${reminder.targetTitle}`,
            date: new Date().toISOString(),
            type: 'reminder',
            read: false,
            linkUrl
          };

          this.data.notifications.unshift(notif);
          generated.push(notif);
        }
      }
    });

    if (generated.length > 0) {
      this.save();
    }

    return generated;
  }

  public getPaymentRequests(): PaymentRequest[] {
    try {
      if (fsModule && pathModule && DB_FILE_PATH && fsModule.existsSync(DB_FILE_PATH)) {
        const fileContent = fsModule.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed.paymentRequests && Array.isArray(parsed.paymentRequests)) {
          this.data.paymentRequests = parsed.paymentRequests;
        }
      }
    } catch {}
    return this.data.paymentRequests || [];
  }

  public addPaymentRequest(req: Omit<PaymentRequest, 'id' | 'createdAt' | 'status'>): PaymentRequest {
    if (!this.data.paymentRequests) this.data.paymentRequests = [];
    const newReq: PaymentRequest = {
      ...req,
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    this.data.paymentRequests.unshift(newReq);

    // Update user status to pending
    const user = this.getUserById(req.userId);
    if (user) {
      this.updateUser(user.id, { status: 'pending' as any });
    }

    this.save();
    return newReq;
  }

  public approvePaymentRequest(requestId: string, adminId: string): boolean {
    if (!this.data.paymentRequests) return false;
    const req = this.data.paymentRequests.find(r => 
      r.id === requestId || 
      r.transactionRef === requestId || 
      (r.userEmail && r.userEmail.toLowerCase() === requestId.toLowerCase()) ||
      (r.userId && r.userId === requestId)
    );
    if (!req) return false;

    req.status = 'APPROVED';
    req.approvedAt = new Date().toISOString();

    // Unlock the requested plan for the student!
    const user = this.getUserById(req.userId) || this.getUserByEmail(req.userEmail);
    if (user) {
      this.updateUser(user.id, {
        plan: req.requestedPlan,
        status: 'active'
      });

      this.addNotification({
        id: `notif_${Date.now()}`,
        title: '🎉 Accès PRO Validé par l\'Administration !',
        message: `Votre versement ${req.paymentMethod} a été vérifié et confirmé. Votre forfait ${req.requestedPlan} est désormais 100% actif.`,
        date: new Date().toISOString(),
        type: 'system',
        read: false,
        linkUrl: '/profil'
      });
    }

    this.save();
    return true;
  }

  public rejectPaymentRequest(requestId: string): boolean {
    if (!this.data.paymentRequests) return false;
    const req = this.data.paymentRequests.find(r => 
      r.id === requestId || 
      r.transactionRef === requestId || 
      (r.userEmail && r.userEmail.toLowerCase() === requestId.toLowerCase()) ||
      (r.userId && r.userId === requestId)
    );
    if (!req) return false;

    req.status = 'REJECTED';
    this.save();
    return true;
  }

  public deletePaymentRequest(requestId: string): boolean {
    if (!this.data.paymentRequests) return false;
    const prev = this.data.paymentRequests.length;
    this.data.paymentRequests = this.data.paymentRequests.filter(r => 
      r.id !== requestId && 
      r.transactionRef !== requestId && 
      (!r.userEmail || r.userEmail.toLowerCase() !== requestId.toLowerCase()) &&
      (!r.userId || r.userId !== requestId)
    );
    if (this.data.paymentRequests.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // --- USER MESSAGES & ADMIN INBOX ---
  public getUserMessages(): UserMessage[] {
    return this.data.userMessages || [];
  }

  public addUserMessage(msg: Omit<UserMessage, 'id' | 'createdAt' | 'status'>): UserMessage {
    if (!this.data.userMessages) this.data.userMessages = [];
    const newMsg: UserMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      status: 'UNREAD',
      createdAt: new Date().toISOString()
    };
    this.data.userMessages.unshift(newMsg);
    this.save();

    // Create a notification for admin
    this.addNotification({
      id: `notif_admin_msg_${Date.now()}`,
      title: `📩 Nouveau message de ${msg.userName}`,
      message: `${msg.category}: ${msg.subject}`,
      date: new Date().toISOString(),
      type: 'system',
      read: false,
      linkUrl: '/admin/messages'
    });

    return newMsg;
  }

  public updateUserMessageStatus(id: string, status: 'UNREAD' | 'IN_PROGRESS' | 'RESOLVED', replyNote?: string): boolean {
    if (!this.data.userMessages) return false;
    const msg = this.data.userMessages.find(m => m.id === id);
    if (!msg) return false;

    msg.status = status;
    if (replyNote !== undefined) msg.replyNote = replyNote;
    if (status === 'RESOLVED') msg.resolvedAt = new Date().toISOString();

    this.save();
    return true;
  }

  public deleteUserMessage(id: string): boolean {
    if (!this.data.userMessages) return false;
    const prev = this.data.userMessages.length;
    this.data.userMessages = this.data.userMessages.filter(m => m.id !== id);
    if (this.data.userMessages.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // --- MODE GARDE PROTOCOLS (HTML EDITABLE) ---
  public getGardeProtocols(): GardeProtocol[] {
    return this.data.gardeProtocols || [];
  }

  public getGardeProtocolById(id: string): GardeProtocol | undefined {
    return (this.data.gardeProtocols || []).find(g => g.id === id || g.slug === id);
  }

  public createGardeProtocol(protocol: GardeProtocol): GardeProtocol {
    if (!this.data.gardeProtocols) this.data.gardeProtocols = [];
    this.data.gardeProtocols.unshift(protocol);
    this.save();
    return protocol;
  }

  public updateGardeProtocol(id: string, updates: Partial<GardeProtocol>): GardeProtocol | undefined {
    if (!this.data.gardeProtocols) return undefined;
    const idx = this.data.gardeProtocols.findIndex(g => g.id === id);
    if (idx === -1) return undefined;
    this.data.gardeProtocols[idx] = {
      ...this.data.gardeProtocols[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.gardeProtocols[idx];
  }

  public deleteGardeProtocol(id: string): boolean {
    if (!this.data.gardeProtocols) return false;
    const prev = this.data.gardeProtocols.length;
    this.data.gardeProtocols = this.data.gardeProtocols.filter(g => g.id !== id);
    if (this.data.gardeProtocols.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // --- CUSTOM SOURCES (PER SPECIALTY / COURSE) ---

  private static readonly DEFAULT_GLOBAL_SOURCES = ['Externat', 'Annales Résidanat', 'Hypercours', 'QCM CNP', 'SIAU', 'Livre Hygiène'];

  /** Make sure customSources map exists */
  private ensureSources(): Record<string, string[]> {
    if (!this.data.customSources) {
      this.data.customSources = {
        __global__: [...DatabaseStore.DEFAULT_GLOBAL_SOURCES]
      };
    }
    return this.data.customSources;
  }

  /** Build a scope key from optional specialty + course + faculty (ORAN | SIDI_BEL_ABBES | TOUS) */
  private static scopeKey(specialty?: string, course?: string, faculty?: string): string {
    let base = '__global__';
    if (specialty && course) base = `${specialty}__${course}`;
    else if (specialty) base = specialty;

    if (faculty && faculty !== 'TOUS') {
      return `${base}::${faculty}`;
    }
    return base;
  }

  /**
   * Get sources for a given scope and faculty.
   * Merges:
   * - Course sources (faculty-specific + common)
   * - Specialty sources (faculty-specific + common)
   * - Global sources (faculty-specific + common)
   */
  public getCustomSources(specialty?: string, course?: string, faculty?: string): string[] {
    const map = this.ensureSources();
    const globalCommon = map['__global__'] || [...DatabaseStore.DEFAULT_GLOBAL_SOURCES];
    const globalOran = map['__global__::ORAN'] || [];
    const globalSba = map['__global__::SIDI_BEL_ABBES'] || [];

    const result: string[] = [];

    // Helper to push sources from a key
    const addKey = (k: string) => {
      const arr = map[k];
      if (arr && Array.isArray(arr)) {
        for (const s of arr) {
          if (!result.includes(s)) result.push(s);
        }
      }
    };

    // 1. Course level
    if (specialty && course) {
      if (faculty === 'ORAN') {
        addKey(`${specialty}__${course}::ORAN`);
        addKey(`${specialty}__${course}`);
      } else if (faculty === 'SIDI_BEL_ABBES') {
        addKey(`${specialty}__${course}::SIDI_BEL_ABBES`);
        addKey(`${specialty}__${course}`);
      } else {
        addKey(`${specialty}__${course}`);
        addKey(`${specialty}__${course}::ORAN`);
        addKey(`${specialty}__${course}::SIDI_BEL_ABBES`);
      }
    }

    // 2. Specialty level
    if (specialty) {
      if (faculty === 'ORAN') {
        addKey(`${specialty}::ORAN`);
        addKey(specialty);
      } else if (faculty === 'SIDI_BEL_ABBES') {
        addKey(`${specialty}::SIDI_BEL_ABBES`);
        addKey(specialty);
      } else {
        addKey(specialty);
        addKey(`${specialty}::ORAN`);
        addKey(`${specialty}::SIDI_BEL_ABBES`);
      }
    }

    // 3. Global level
    if (faculty === 'ORAN') {
      for (const s of [...globalOran, ...globalCommon]) {
        if (!result.includes(s)) result.push(s);
      }
    } else if (faculty === 'SIDI_BEL_ABBES') {
      for (const s of [...globalSba, ...globalCommon]) {
        if (!result.includes(s)) result.push(s);
      }
    } else {
      for (const s of [...globalCommon, ...globalOran, ...globalSba]) {
        if (!result.includes(s)) result.push(s);
      }
    }

    return Array.from(new Set(result));
  }

  /** Get ONLY sources defined at an exact scope & faculty (no merging) — for admin display */
  public getSourcesAt(specialty?: string, course?: string, faculty?: string): string[] {
    const map = this.ensureSources();
    const key = DatabaseStore.scopeKey(specialty, course, faculty);
    return map[key] || [];
  }

  /** Add a source to a given scope & faculty */
  public addCustomSource(sourceName: string, specialty?: string, course?: string, faculty?: string): string[] {
    const map = this.ensureSources();
    const key = DatabaseStore.scopeKey(specialty, course, faculty);
    if (!map[key]) map[key] = [];
    const clean = sourceName.trim();
    if (clean && !map[key].includes(clean)) {
      map[key].push(clean);
      this.save();
    }
    return map[key];
  }

  /** Delete a source from a given scope & faculty */
  public deleteCustomSource(sourceName: string, specialty?: string, course?: string, faculty?: string): string[] {
    const map = this.ensureSources();
    const key = DatabaseStore.scopeKey(specialty, course, faculty);
    if (!map[key]) return [];
    map[key] = map[key].filter(s => s !== sourceName);
    this.save();
    return map[key];
  }

  /** Get all scopes that have custom sources, for the admin overview */
  public getAllSourceScopes(): { key: string; specialty?: string; course?: string; faculty?: string; sources: string[] }[] {
    const map = this.ensureSources();
    return Object.entries(map).map(([key, sources]) => {
      const [base, fac] = key.split('::');
      const faculty = fac || undefined;
      const parts = base.split('__');
      if (parts.length === 2) return { key, specialty: parts[0], course: parts[1], faculty, sources };
      return { key, specialty: parts[0], faculty, sources };
    });
  }

  /** Password reset token and 6-digit OTP verification management */
  private resetTokens: Record<string, { token: string; code: string; email: string; userId: string; expiresAt: number }> = {};

  public createPasswordResetToken(email: string, userId: string): { token: string; code: string } {
    const fullToken = `rst_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // e.g. "728491"
    this.resetTokens[fullToken] = {
      token: fullToken,
      code,
      email: email.toLowerCase().trim(),
      userId,
      expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
    };
    return { token: fullToken, code };
  }

  public verifyPasswordResetToken(token: string): { valid: boolean; email?: string; userId?: string } {
    const entry = this.resetTokens[token];
    if (!entry) return { valid: false };
    if (Date.now() > entry.expiresAt) {
      delete this.resetTokens[token];
      return { valid: false };
    }
    return { valid: true, email: entry.email, userId: entry.userId };
  }

  public verifyResetCode(email: string, code: string): { valid: boolean; token?: string; userId?: string } {
    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.replace(/\s+/g, '');
    for (const key of Object.keys(this.resetTokens)) {
      const entry = this.resetTokens[key];
      if (entry && entry.email === cleanEmail && entry.code === cleanCode) {
        if (Date.now() > entry.expiresAt) {
          delete this.resetTokens[key];
          return { valid: false };
        }
        return { valid: true, token: entry.token, userId: entry.userId };
      }
    }
    return { valid: false };
  }

  public consumePasswordReset(tokenOrEmail: string): boolean {
    const clean = tokenOrEmail.toLowerCase().trim();
    if (this.resetTokens[clean]) {
      delete this.resetTokens[clean];
      return true;
    }
    for (const key of Object.keys(this.resetTokens)) {
      const val = this.resetTokens[key];
      if (val && (val.email === clean || val.token === clean)) {
        delete this.resetTokens[key];
        return true;
      }
    }
    return false;
  }
}

// Singleton global instance
export const db = new DatabaseStore();

