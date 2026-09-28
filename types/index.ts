export type UserRole = 'USER' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';

export type PlanType = 'FREE' | 'PRO' | 'PREMIUM';

export type MedicalProfession = 'Étudiant' | 'Interne' | 'Médecin' | 'Autre';

export type FacultyType = 'TOUS' | 'ORAN' | 'SIDI_BEL_ABBES';

export type MedicalYear = 1 | 2 | 3 | 4 | 5 | 6;

export const MEDICAL_YEARS = [
  { year: 1 as MedicalYear, name: '1ère Année', cycle: 'PCEM 1', label: '1ère Année (PCEM1)' },
  { year: 2 as MedicalYear, name: '2ème Année', cycle: 'PCEM 2', label: '2ème Année (PCEM2)' },
  { year: 3 as MedicalYear, name: '3ème Année', cycle: 'DCEM 1', label: '3ème Année (DCEM1)' },
  { year: 4 as MedicalYear, name: '4ème Année', cycle: 'DCEM 2', label: '4ème Année (DCEM2)' },
  { year: 5 as MedicalYear, name: '5ème Année', cycle: 'DCEM 3', label: '5ème Année (DCEM3)' },
  { year: 6 as MedicalYear, name: '6ème Année', cycle: 'DCEM 4', label: '6ème Année (DCEM4)' },
];

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  password?: string;
  profession: MedicalProfession;
  faculty?: FacultyType;
  specialty?: string;
  role: UserRole;
  plan: PlanType;
  status: 'active' | 'suspended' | 'pending';
  activeSessionId?: string;
  lastDevice?: string;
  phone?: string;
  createdAt: string;
  lastActive: string;
  licenseKey?: string;
  subscriptionStartedAt?: string;
  subscriptionExpiresAt?: string;
  usage: {
    coursesViewedMonth: number;
    qcmsAnsweredMonth: number;
    fichesViewedMonth: number;
    catViewedMonth: number;
    casesViewedMonth: number;
    resetDate: string;
  };
}

export interface Specialty {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  iconName: string;
  color: string;
  description: string;
  year?: MedicalYear; // 1 | 2 | 3 | 4 | 5 | 6
  faculty?: FacultyType; // 'TOUS' | 'ORAN' | 'SIDI_BEL_ABBES'
  totalCourses: number;
  totalQcms: number;
  totalCat: number;
  totalFiches: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  specialtyId: string;
  specialtyName: string;
  author: string;
  authorTitle: string;
  description: string;
  coverImage?: string;
  difficulty: 'Fondamental' | 'Incontournable' | 'Avancé';
  faculty?: FacultyType; // ORAN | SIDI_BEL_ABBES | TOUS
  year?: MedicalYear; // 1 | 2 | 3 | 4 | 5 | 6
  source?: string; // e.g. "Externat", "SIAU", "Livre Hygiène", "Hypercours"
  rang: 'Rang A' | 'Rang B' | 'Rang C';
  estimatedDuration: string; // e.g. "35 min"
  tags: string[];
  accessLevel: PlanType;
  published: boolean;
  viewsCount: number;
  likesCount: number;
  qcmCount: number;
  tableOfContents: { id: string; title: string; level: number }[];
  htmlContent: string;
  summaryPoints?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Fiche {
  id: string;
  slug: string;
  title: string;
  specialtyId: string;
  specialtyName: string;
  category: string;
  estimatedReadTime: string;
  keyTakeaways: string[];
  accessLevel: PlanType;
  published: boolean;
  htmlContent: string;
  updatedAt: string;
}

export interface QCMOption {
  id: string;
  text: string;
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface StructuredSource {
  name: string;
  subSources: string[];
}

export interface QCM {
  id: string;
  title: string;
  specialtyId: string;
  specialtyName: string;
  courseId?: string;
  courseTitle?: string;
  faculty?: FacultyType; // ORAN | SIDI_BEL_ABBES | TOUS
  year?: MedicalYear | number; // 1-6 or exam session year (e.g. 2019)
  source?: string; // e.g. "Externat - 2019", "Hypercours"
  parentSource?: string; // e.g. "Externat"
  subSource?: string; // e.g. "2019"
  rang: 'Rang A' | 'Rang B';
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  type: 'SINGLE' | 'MULTIPLE' | 'TRUE_FALSE';
  vignette: string; // Clinical vignette
  question: string;
  options: QCMOption[];
  correctAnswers: number[]; // e.g. [0, 2] for A and C
  explanation: string;
  explanationHtml?: string;
  vignetteHtml?: string; // Detailed physiological and clinical rationale
  reference: string; // e.g. "Collège National de Cardiologie, ECNi 2024"
  tags: string[];
  accessLevel: PlanType;
}

export interface QCMAttempt {
  id: string;
  userId: string;
  qcmId: string;
  userAnswers: number[];
  isCorrect: boolean;
  scorePercentage: number;
  timeSpentSeconds: number;
  attemptedAt: string;
}

export interface CATProtocol {
  id: string;
  slug: string;
  title: string;
  specialtyId: string;
  specialtyName: string;
  urgencyLevel: 'Urgence Vitale' | 'Urgence Relative' | 'Prise en charge réglée';
  summary: string;
  evaluationInitiale: string[];
  signesDeGravite: string[];
  diagnosticCritères: string[];
  examensComplementaires: string[];
  conduiteImmediate: string[];
  traitementSpecifique: string[];
  orientation: string;
  redFlags: string[];
  clinicalPearls: string[];
  conduiteHtml?: string;
  cliniqueHtml?: string;
  urgenceHtml?: string;
  protocoleHtml?: string;
  bilanHtml?: string;
  alertes?: string;
  synopsis?: string;
  category?: string;
  severity?: string;
  ordonnance?: { drug: string; dose: string; poso: string; qty: string }[];
  conseils?: string;
  page?: string;
  accessLevel: PlanType;
  published: boolean;
  updatedAt: string;
}

export interface ClinicalCaseStep {
  id: string;
  stepNumber: number;
  title: string;
  patientDataAddition?: {
    history?: string;
    vitals?: Record<string, string>;
    labs?: Record<string, string>;
    imaging?: string;
  };
  promptQuestion: string;
  options: { id: string; text: string; feedback: string; isCorrect: boolean }[];
  explanation: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  specialtyId: string;
  specialtyName: string;
  difficulty: 'Interne' | 'Externe' | 'Expert';
  patientProfile: {
    age: number;
    gender: 'Homme' | 'Femme';
    motif: string;
    antecedents: string[];
  };
  steps: ClinicalCaseStep[];
  accessLevel: PlanType;
  published: boolean;
  caseHtml?: string;
  debrief?: string;
}

export interface ECGRecord {
  svgHtml?: string;
  id: string;
  title: string;
  category: 'Trouble du rythme' | 'Ischémie' | 'Conduction' | 'Hypertrophie' | 'Troubles électrolytiques' | 'Urgence';
  imageUrl: string;
  clinicalContext: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Expert';
  isDailyChallenge?: boolean;
  keyFindings: string[];
  interpretation: string;
  diagnosticDetails: string;
  accessLevel: PlanType;
}

export interface Medication {
  id: string;
  dci: string; // Dénomination Commune Internationale
  commercialNames: string[]; // Algerian brands e.g. Augmentin, Clavulin
  therapeuticClass: string;
  dosageForms: string[];
  indications: string[];
  contraindications: string[];
  interactions: string[];
  standardPosology: string;
  algerianCommercialStatus: 'Disponible en pharmacie' | 'Usage hospitalier strict' | 'Sous ATU';
  notes: string;
}

export interface UserProgression {
  totalCoursesCompleted: number;
  totalFichesRead: number;
  totalQcmAnswered: number;
  averageQcmScore: number;
  currentStreakDays: number;
  totalHoursStudied: number;
  specialtiesProgress: {
    specialtyId: string;
    specialtyName: string;
    completedCourses: number;
    totalCourses: number;
    qcmSuccessRate: number;
  }[];
  weakPoints: {
    specialtyName: string;
    topic: string;
    successRate: number;
    recommendedQcmCount: number;
  }[];
}

export type ReminderTag = 'piege' | 'a_revoir' | 'difficile' | 'priorite_concours';

export interface StudyReminder {
  id: string;
  userId: string;
  targetType: 'qcm' | 'cours' | 'cat' | 'fiche';
  targetId: string;
  targetTitle: string;
  specialtyId?: string;
  specialtyName?: string;
  tag: ReminderTag;
  tagLabel: string;
  userNote?: string;
  scheduledFor: string;
  intervalDays?: number;
  status: 'pending' | 'completed' | 'dismissed';
  createdAt: string;
  completedAt?: string;
  notificationSent?: boolean;
}

export interface ReminderStats {
  totalActive: number;
  dueTodayCount: number;
  piegesCount: number;
  qcmsCount: number;
  coursCount: number;
  retentionRate: number;
  byTag: Record<ReminderTag, number>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'system' | 'course' | 'streak' | 'qcm' | 'reminder';
  read: boolean;
  linkUrl?: string;
  userId?: string;
}

export interface PlatformSettings {
  platformName: string;
  whatsappNumber?: string;
  secondaryPhone?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  telegramUrl?: string;
  baridimobRip?: string;
  ccpNumber?: string;
  accountHolder?: string;
  supportEmail?: string;
  freeLimits: {
    maxCourses: number;
    maxFiches: number;
    maxQcmPerMonth: number;
    maxCat: number;
    maxCases: number;
    maxEcg: number;
  };
  pricing: {
    freePriceDa: number;
    proPriceDa: number;
    premiumPriceDa: number;
  };
  aiConfig: {
    provider: 'openai' | 'anthropic' | 'google' | 'ollama' | 'mock';
    modelName: string;
    enabled: boolean;
  };
  aiAssistantConfig?: {
    enabled: boolean;
    provider: 'google' | 'openrouter' | 'openai' | 'deepseek';
    apiKey: string;
    modelName: string;
    temperature: number;
    systemPrompt: string;
    maxTokens: number;
  };
  fnsReaderConfig?: {
    enabled: boolean;
    provider: 'google_vision' | 'openrouter_vision' | 'openai_vision' | 'custom_ocr';
    apiKey: string;
    modelName: string;
    extractTables: boolean;
    extractKeyPoints: boolean;
    autoGenerateSummary: boolean;
    ocrEngine: 'gemini_vision' | 'tesseract' | 'cloud_vision';
  };
  maintenanceMode: boolean;
  registrationsOpen: boolean;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestedPlan: PlanType;
  paymentMethod: 'BaridiMob' | 'CCP';
  transactionRef: string;
  receiptImageUrl?: string;
  notes?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  approvedAt?: string;
}

export interface PrescriptionItem {
  dci: string;
  brandAlgeria: string;
  form: string;
  posology: string;
  duration: string;
  notes?: string;
}

export interface OrdonnanceTemplate {
  id: string;
  title: string;
  specialtyId: string;
  specialtyName: string;
  indication: string;
  patientType: 'Adulte' | 'Pédiatrie' | 'Femme Enceinte' | 'Sujet Âgé';
  items: PrescriptionItem[];
  patientAdvice: string[];
  redFlagsToWatch: string[];
}

export interface UserMessage {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  profession?: string;
  subject: string;
  category: 'Question Médicale' | 'Support Technique' | 'Abonnement / Paiement' | 'Suggestion' | 'Autre';
  message: string;
  status: 'UNREAD' | 'IN_PROGRESS' | 'RESOLVED';
  replyNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface GardeProtocol {
  id: string;
  slug: string;
  title: string;
  category: string;
  iconName?: string;
  badge?: string;
  description: string;
  htmlContent: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}




