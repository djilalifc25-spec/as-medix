export const SPECIALTY_EMOJIS: Record<string, string> = {
  cardio: '❤️',
  pneumo: '🫁',
  neuro: '🧠',
  nephro: '🫧',
  endocrino: '⚡',
  gastro: '🍏',
  pediatrie: '👶',
  gyneco: '🌸',
  dermato: '✨',
  infectieux: '🦠',
  hemato: '🩸',
  rhumato: '🦴',
  psy: '🕊️',
  ophtalmo: '👁️',
  orl: '👂',
  urgences: '🚨',
  chirurgie: '✂️',
  uro: '💧',
  ortho: '🦾',
  interne: '🧬',
};

export const getSpecialtyEmoji = (specId?: string): string => {
  if (!specId) return '🩺';
  return SPECIALTY_EMOJIS[specId] || '🩺';
};
