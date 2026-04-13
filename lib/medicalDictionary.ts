/**
 * Local medical term → one-sentence definitions (high school level).
 * Used in demo mode without AI; keys must be lowercase.
 */
export const medicalDictionary: Record<string, string> = {
  lisinopril:
    'A medication used to treat high blood pressure and heart problems.',
  troponin:
    'A protein in the blood that increases when there is damage to the heart muscle.',
  angina: 'Chest pain caused by reduced blood flow to the heart.',
  hypertension: 'High blood pressure.',
  hypotension: 'Low blood pressure.',
  aspirin:
    'A common medication that reduces pain, fever, and blood clotting.',
  penicillin: 'An antibiotic used to treat many bacterial infections.',
  cholesterol: 'A fat-like substance in the blood linked to heart disease.',
  diabetes:
    'A disease where blood sugar is too high because the body cannot use insulin properly.',
  insulin:
    'A hormone that helps cells take in sugar from the blood to lower blood sugar.',
  ecg: 'A test that records the electrical activity of the heart.',
  ekg: 'A test that records the electrical activity of the heart.',
  stemi:
    'A severe heart attack pattern seen on an ECG with a specific type of ST elevation.',
  myocardial: 'Relating to the muscle tissue of the heart.',
  infarction: 'Tissue death caused by loss of blood supply.',
  dyspnea: 'Shortness of breath or difficulty breathing.',
  tachycardia: 'A heart rate that is faster than normal at rest.',
  bradycardia: 'A heart rate that is slower than normal.',
  nausea: 'A feeling that you may vomit.',
  vomiting: 'Forcefully emptying the stomach through the mouth.',
  diaphoresis: 'Sweating that is more than usual, often from illness or stress.',
  pneumonia: 'An infection that inflames the air sacs in the lungs.',
  appendicitis: 'Inflammation of the appendix, often causing right lower abdominal pain.',
  sepsis:
    'A life-threatening body response to infection that can affect many organs.',
  infection: 'Illness caused by bacteria, viruses, or other germs.',
  inflammation: 'Redness, swelling, heat, and pain as the body reacts to injury or infection.',
  migraine: 'A recurring headache that is often severe and may include nausea or light sensitivity.',
  stroke:
    'Damage to the brain from loss of blood flow or bleeding in the brain.',
  subarachnoid:
    'Referring to the space around the brain where bleeding can occur in some emergencies.',
  hemorrhage: 'Bleeding; escape of blood from a vessel.',
  embolism: 'A blocked blood vessel, often by a blood clot that traveled there.',
  thrombosis: 'A blood clot forming inside a blood vessel.',
  dvt: 'A blood clot in a deep vein, often in the leg.',
  pulmonary: 'Relating to the lungs.',
  pleuritic: 'Related to sharp chest pain that worsens with breathing.',
  hemoptysis: 'Coughing up blood from the lungs or airways.',
  uti: 'An infection in the urinary system, such as the bladder or kidneys.',
  dehydration: 'Not enough fluid in the body for normal function.',
  arrhythmia: 'An abnormal heart rhythm.',
  murmur: 'An extra sound heard when listening to the heart with a stethoscope.',
  auscultation: 'Listening to sounds inside the body, usually with a stethoscope.',
  troponins: 'Blood proteins measured to check for heart muscle damage.',
  oxygen: 'A gas in air that the lungs take in for the body to use for energy.',
  saturation: 'How full the blood is with oxygen, often measured as a percentage.',
  'blood pressure':
    'The force of blood pushing against the walls of the arteries.',
  'shortness of breath':
    'Feeling like you cannot get enough air or have to work harder to breathe.',
  'heart attack':
    'When part of the heart muscle is damaged because its blood supply is blocked.',
  'blood clot':
    'A clump of blood that can block a vessel and stop blood flow.',
  'chest x-ray':
    'An imaging test that shows the lungs, heart outline, and bones in the chest.',
  'ct scan':
    'A detailed imaging test that uses X-rays and computers to show structures inside the body.',
  'heart rate': 'How many times the heart beats per minute.',
  'blood sugar': 'The amount of glucose in the blood.',
}

/** Strip trailing/leading punctuation for lookup (keeps internal hyphens). */
export function normalizeDictionaryToken(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/^['"([{]+/, '')
    .replace(/['")\]}.,;:!?]+$/, '')
    .trim()
}

function tryPluralVariants(w: string): string | undefined {
  if (w.length < 3) return undefined
  if (medicalDictionary[w]) return medicalDictionary[w]
  if (w.endsWith('ies') && w.length > 4) {
    const y = w.slice(0, -3) + 'y'
    if (medicalDictionary[y]) return medicalDictionary[y]
  }
  if (w.endsWith('es') && w.length > 3) {
    const a = w.slice(0, -2)
    if (medicalDictionary[a]) return medicalDictionary[a]
    const b = w.slice(0, -1)
    if (medicalDictionary[b]) return medicalDictionary[b]
  }
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) {
    const s = w.slice(0, -1)
    if (medicalDictionary[s]) return medicalDictionary[s]
  }
  return undefined
}

/** Single-word or normalized token lookup (handles common plurals). */
export function lookupDictionaryWord(rawWord: string): string | undefined {
  const w = normalizeDictionaryToken(rawWord)
  if (!w) return undefined
  if (medicalDictionary[w]) return medicalDictionary[w]
  return tryPluralVariants(w)
}

/**
 * Lookup for API / free-text: full phrase (lowercased), multi-word keys, then single-word variants.
 */
export function lookupDictionaryAny(raw: string): string | undefined {
  let t = raw.trim().toLowerCase().replace(/\s+/g, ' ')
  t = t.replace(/^['"([{]+/, '').replace(/['")\]}.,;:!?]+$/, '').trim()
  if (!t) return undefined
  if (medicalDictionary[t]) return medicalDictionary[t]
  if (!t.includes(' ')) return lookupDictionaryWord(t)
  return undefined
}
