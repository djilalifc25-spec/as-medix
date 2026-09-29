/**
 * Intelligent Medical QCM Parser Engine
 * Handles PDF text, raw exam text, and separate Answer Key files (Grilles de réponses numérotées).
 */

export interface ParsedOption {
  letter: string;
  text: string;
  isCorrect: boolean;
}

export interface ParsedQcmItem {
  id: string;
  tempNum: number; // Question number e.g. 1, 2, 3
  title: string;
  vignetteText: string;
  question: string;
  options: ParsedOption[];
  explanationHtml: string;
  isVerified: boolean;
  source?: string;
  parentSource?: string;
  subSource?: string;
  specialtyId?: string;
  courseId?: string;
  courseTitle?: string;
  year?: number;
}

/**
 * Parses raw answer key text (e.g. "1. A, C\n2. B\n3. A D E")
 * Returns a map of Question Number -> Array of correct letters ["A", "C"]
 */
export function parseAnswerKey(keyText: string): Map<number, string[]> {
  const answerMap = new Map<number, string[]>();
  if (!keyText || typeof keyText !== 'string') return answerMap;

  const lines = keyText.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Matches formats like: "1: A, C", "Q1. A B C", "1 - AC", "1) A, D", "1=A,B"
    const match = trimmed.match(/^(?:QCM|Q|Question)?\s*(\d+)[\s.:#=)–-]+(.*)/i);
    if (match) {
      const qNum = parseInt(match[1], 10);
      const rawAnsStr = match[2].toUpperCase();
      
      // Extract all A, B, C, D, E letters from the string
      const letters: string[] = [];
      const letterMatches = rawAnsStr.match(/[A-E]/g);
      if (letterMatches) {
        for (const l of letterMatches) {
          if (!letters.includes(l)) letters.push(l);
        }
      }

      if (qNum > 0 && letters.length > 0) {
        answerMap.set(qNum, letters.sort());
      }
    }
  }

  return answerMap;
}

/**
 * Parses raw text extracted from PDF or pasted exam text into structured QCMs.
 * Merges with optional answer key map.
 */
export function parseQcmDocument(rawText: string, answerKeyText?: string): ParsedQcmItem[] {
  if (!rawText || typeof rawText !== 'string') return [];

  const answerKeyMap = answerKeyText ? parseAnswerKey(answerKeyText) : new Map<number, string[]>();

  // Normalize line breaks
  const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split text by QCM blocks: lines starting with "QCM 1", "Question 1", "Q1.", or "1." followed by text
  const blockHeaderRegex = /(?:^|\n)(?=(?:QCM|Q|Question|\d+)\s*[\d.:#–-]+\s*[^A-Ea-e\n])/gi;
  
  // Split into chunks
  let rawBlocks = text.split(blockHeaderRegex).filter(b => b.trim().length > 10);

  // Fallback: If split produced only 1 chunk or nothing, attempt splitting by "QCM" or numbers
  if (rawBlocks.length <= 1) {
    rawBlocks = text.split(/\n\s*(?=\d+[\s.:\)-]\s+[A-Z\u00C0-\u00FF])/gi).filter(b => b.trim().length > 10);
  }

  const result: ParsedQcmItem[] = [];

  let autoNumCounter = 1;

  for (const block of rawBlocks) {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) continue;

    // Detect Question Number
    const numMatch = trimmedBlock.match(/^(?:QCM|Q|Question)?\s*(\d+)/i);
    const qNum = numMatch ? parseInt(numMatch[1], 10) : autoNumCounter;
    autoNumCounter++;

    // Separate Question Text from Options and Inline Explanations
    // Options regex matching A), B., C -, A :, A - ...
    const optionSplitRegex = /(?:^|\n)\s*([A-Ea-e])[\).\s:-]\s*/g;
    
    const optionMatches = Array.from(trimmedBlock.matchAll(optionSplitRegex));

    let questionText = trimmedBlock;
    let vignetteText = '';
    const optionsList: ParsedOption[] = [];
    let inlineExplanation = '';
    let inlineCorrectLetters: string[] = [];

    if (optionMatches.length > 0) {
      // Everything before first option is Question / Vignette
      const firstOptIndex = optionMatches[0].index || 0;
      questionText = trimmedBlock.substring(0, firstOptIndex).trim();

      // Clean leading QCM number header from question text
      questionText = questionText.replace(/^(?:QCM|Q|Question)?\s*\d+[\s.:#=)–-]*/i, '').trim();

      // Process options
      for (let i = 0; i < optionMatches.length; i++) {
        const currMatch = optionMatches[i];
        const letter = currMatch[1].toUpperCase();
        const startIdx = (currMatch.index || 0) + currMatch[0].length;
        const endIdx = (i < optionMatches.length - 1) ? (optionMatches[i + 1].index || trimmedBlock.length) : trimmedBlock.length;

        let optContent = trimmedBlock.substring(startIdx, endIdx).trim();

        // Check if last option contains Inline Answer / Explanation (e.g. "Réponse : A, C")
        const inlineAnsMatch = optContent.match(/(?:\n|\s)+(?:Réponse|Correction|Corrigé|Explication|Justification|Ref)\s*[:=]\s*(.*)/i);
        if (inlineAnsMatch) {
          const ansString = inlineAnsMatch[1];
          optContent = optContent.substring(0, optContent.indexOf(inlineAnsMatch[0])).trim();
          
          inlineExplanation = inlineAnsMatch[0].trim();
          const foundLetters = ansString.toUpperCase().match(/[A-E]/g);
          if (foundLetters) {
            inlineCorrectLetters = Array.from(new Set(foundLetters));
          }
        }

        if (optContent) {
          optionsList.push({
            letter,
            text: optContent,
            isCorrect: false, // Will be set next
          });
        }
      }
    } else {
      // Clean leading number
      questionText = questionText.replace(/^(?:QCM|Q|Question)?\s*\d+[\s.:#=)–-]*/i, '').trim();
    }

    // Determine correct letters for this question:
    // Priority 1: External Answer Key Map
    // Priority 2: Inline Correct Letters extracted from text
    const correctLetters = answerKeyMap.has(qNum) 
      ? answerKeyMap.get(qNum)! 
      : inlineCorrectLetters;

    // Mark options as correct if letter in correctLetters
    optionsList.forEach(opt => {
      if (correctLetters.includes(opt.letter)) {
        opt.isCorrect = true;
      }
    });

    // Default to standard 5 options A,B,C,D,E if fewer extracted
    if (optionsList.length < 2) {
      const existingLetters = optionsList.map(o => o.letter);
      ['A', 'B', 'C', 'D', 'E'].forEach(l => {
        if (!existingLetters.includes(l)) {
          optionsList.push({ letter: l, text: `Proposition ${l}`, isCorrect: false });
        }
      });
      optionsList.sort((a, b) => a.letter.localeCompare(b.letter));
    }

    // If vignette exists (e.g. "Patient de 45 ans..."), separate vignette vs question
    if (questionText.length > 120 && questionText.includes('\n')) {
      const parts = questionText.split('\n');
      vignetteText = parts.slice(0, parts.length - 1).join('\n').trim();
      questionText = parts[parts.length - 1].trim();
    }

    result.push({
      id: `parsed_qcm_${Date.now()}_${qNum}_${Math.random().toString(36).substring(2, 6)}`,
      tempNum: qNum,
      title: `QCM #${qNum}`,
      vignetteText: vignetteText || '',
      question: questionText || `Question #${qNum}`,
      options: optionsList,
      explanationHtml: inlineExplanation 
        ? `<p><strong>Correction / Explication :</strong> ${inlineExplanation}</p>`
        : `<p><strong>Explication :</strong> QCM #${qNum} conforme au programme officiel.</p>`,
      isVerified: correctLetters.length > 0,
    });
  }

  return result;
}
