import type { Scenario } from '@/data/scenarios'

export type ChatMessage = {
  role: string
  content: string
}

type FallbackQA = {
  id: string
  answer: string
  patterns?: string[]
  keywords?: string[]
}

type FallbackScenario = {
  key: string
  titleMatchers: string[]
  complaintMatchers: string[]
  qa: FallbackQA[]
  defaultAnswer: string
}

/** Maps scenario ids in data/scenarios.ts to FALLBACK_SCENARIOS keys (stable even if titles change). */
const SCENARIO_ID_TO_FALLBACK_KEY: Record<string, string> = {
  'chest-pain-er': 'chest-pain-er',
  'sudden-headache-er': 'sudden-severe-headache',
  'acute-sob-er': 'acute-shortness-of-breath',
  'rlq-abdominal-pain': 'rlq-abdominal-pain',
  'fever-confusion': 'fever-confusion',
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
}

function uniqueWords(text: string): string[] {
  return Array.from(new Set(normalize(text).split(' ').filter(Boolean)))
}

function includesPhrase(text: string, phrase: string): boolean {
  return normalize(text).includes(normalize(phrase))
}

/**
 * Scores how well a doctor question matches a preset Q&A row.
 * Priority: exact pattern match (full question) > substring phrase match (longer patterns score higher) > keyword hits.
 */
function scoreQuestion(question: string, qa: FallbackQA): number {
  const normalized = normalize(question)
  let score = 0

  for (const pattern of qa.patterns || []) {
    const np = normalize(pattern)
    if (!np) continue
    if (normalized === np) {
      score += 100
      continue
    }
    if (includesPhrase(normalized, pattern)) {
      score += 12 + Math.min(Math.floor(np.length / 4), 18)
    }
  }

  const questionWords = new Set(uniqueWords(normalized))
  for (const keyword of qa.keywords || []) {
    if (questionWords.has(normalize(keyword))) {
      score += 3
    }
  }

  return score
}

function detectScenarioBucket(scenario: Scenario): FallbackScenario | null {
  const mappedKey = SCENARIO_ID_TO_FALLBACK_KEY[scenario.id]
  if (mappedKey) {
    const mapped = FALLBACK_SCENARIOS.find((b) => b.key === mappedKey)
    if (mapped) return mapped
  }

  const title = normalize(scenario?.title || '')
  const chiefComplaint = normalize(scenario?.patientPersona?.chiefComplaint || '')
  const combined = `${title} ${chiefComplaint}`

  let best: FallbackScenario | null = null
  let bestScore = 0

  for (const bucket of FALLBACK_SCENARIOS) {
    let score = 0

    for (const matcher of bucket.titleMatchers) {
      if (includesPhrase(combined, matcher)) score += 10
    }

    for (const matcher of bucket.complaintMatchers) {
      if (includesPhrase(combined, matcher)) score += 8
    }

    if (score > bestScore) {
      best = bucket
      bestScore = score
    }
  }

  return best
}

export function getPresetPatientResponse(
  scenario: Scenario,
  messages: ChatMessage[]
): string {
  const lastDoctorMessage =
    [...messages].reverse().find((m) => m.role === 'doctor' || m.role === 'user')
      ?.content || ''

  if (!lastDoctorMessage) {
    return "I'm not sure what you're asking."
  }

  const bucket = detectScenarioBucket(scenario)

  if (!bucket) {
    return "I'm not really sure how to answer that, but I can tell you more about how I'm feeling if you ask in a different way."
  }

  let bestQA: FallbackQA | null = null
  let bestScore = 0

  for (const qa of bucket.qa) {
    const score = scoreQuestion(lastDoctorMessage, qa)
    if (score > bestScore) {
      bestScore = score
      bestQA = qa
    }
  }

  if (!bestQA || bestScore < 5) {
    return bucket.defaultAnswer
  }

  return bestQA.answer
}

const FALLBACK_SCENARIOS: FallbackScenario[] = [
  {
    key: 'chest-pain-er',
    titleMatchers: ['chest pain in the er', 'chest pain'],
    complaintMatchers: ['chest pain', 'walking up stairs'],
    defaultAnswer:
      "I'm really scared — I've got this awful pressure in the middle of my chest that started when I was walking upstairs about half an hour ago. I'm sweaty, nauseous, and I can't catch my breath right. I've never had anything like this.",
    qa: [
      {
        id: 'feeling-open',
        answer:
          "I started having this really heavy pressure in the middle of my chest about 30 minutes ago while I was walking upstairs. It hasn’t gone away, and I feel kind of short of breath and sweaty. It just feels really intense and different from anything I’ve had before.",
        patterns: [
          'can you tell me more about what you re feeling',
          'can you tell me more about what you\'re feeling',
          'tell me more about what you re feeling',
          'tell me more about your symptoms',
          'tell me more about your symptom',
        ],
        keywords: ['feeling', 'more', 'tell', 'symptoms', 'symptom'],
      },
      {
        id: 'chief-complaint',
        answer:
          "What brought me in is this crushing chest thing that hit me while I was walking upstairs. I work construction — I'm used to being winded, but this isn't normal. I'm also sweaty and nauseous, and my left arm feels weird.",
        patterns: [
          'what brought you in today',
          'what brought you in',
          'what brings you in',
          'what happened',
          'what seems to be the problem',
          'why are you here',
          'tell me what is going on',
        ],
        keywords: ['problem', 'today', 'here', 'complaint', 'brought'],
      },
      {
        id: 'quality',
        answer:
          "It feels like a heavy, crushing pressure right in my chest, almost like something is sitting on it. It’s not sharp, more like a deep squeezing feeling. It’s pretty constant and really uncomfortable.",
        patterns: [
          'what does it feel like',
          'what kind of pain is it',
          'can you describe it more',
          'describe it more',
          'describe the pain',
          'is it sharp dull pressure burning',
        ],
        keywords: ['feel', 'describe', 'kind', 'pain', 'like'],
      },
      {
        id: 'onset',
        answer:
          "It started about 30 minutes ago when I was going up the stairs. It came on pretty suddenly and hasn’t improved since then. It’s been constant the whole time.",
        patterns: [
          'when did this start',
          'when did it start',
          'how long has this been going on',
          'how long has it been going on',
          'what were you doing when it started',
        ],
        keywords: ['when', 'start', 'started', 'onset', 'doing', 'long'],
      },
      {
        id: 'trajectory',
        answer:
          "It’s been pretty constant, maybe getting a little worse over time. It definitely hasn’t gotten better at all. If anything, it feels more intense now than when it first started.",
        patterns: [
          'has it been getting better or worse',
          'getting better or worse',
          'better or worse',
          'has the pain changed over time',
          'pain changed over time',
        ],
        keywords: ['better', 'worse', 'changed', 'time'],
      },
      {
        id: 'location',
        answer:
          "It’s right in the center of my chest, kind of behind my breastbone. It feels deep inside, not like something on the surface. That’s where it’s strongest.",
        patterns: [
          'where exactly do you feel it',
          'where is the pain',
          'where does it hurt',
          'where is it located',
          'show me where it hurts',
          'can you point to where it hurts',
          'point to where it hurts',
        ],
        keywords: ['where', 'location', 'located', 'hurt', 'point'],
      },
      {
        id: 'radiation',
        answer:
          "Yeah, I feel it going into my left arm and sometimes up into my jaw. It’s not as strong there, but it definitely spreads. That’s what really worried me.",
        patterns: [
          'does it go anywhere else',
          'does the pain travel',
          'does it radiate',
          'does the pain radiate',
          'go anywhere else',
          'move anywhere',
        ],
        keywords: ['radiate', 'travel', 'arm', 'jaw', 'else'],
      },
      {
        id: 'associated-sob-nausea-sweat',
        answer:
          "Yes, I feel short of breath and a bit nauseous. I’ve also been sweating a lot even though I’m not doing anything right now. It all came on around the same time as the chest pain.",
        patterns: [
          'any shortness of breath nausea or sweating',
          'shortness of breath nausea or sweating',
          'shortness of breath nausea sweating',
          'any other symptoms',
          'other symptoms',
        ],
        keywords: ['shortness', 'breath', 'nausea', 'sweating', 'symptoms'],
      },
      {
        id: 'worse',
        answer:
          "It seemed to start when I was exerting myself, like walking upstairs. Moving around doesn’t help, and it still hurts even when I sit still. Nothing I’ve done has made it better.",
        patterns: [
          'does anything make it worse',
          'what makes it worse',
          'anything make it worse',
          'does movement make it worse',
          'worse with activity',
          'what makes it better or worse',
          'better or worse',
        ],
        keywords: ['worse', 'activity', 'exertion', 'movement', 'better'],
      },
      {
        id: 'better',
        answer:
          "Not really — I stopped and sat down, but the pressure is still there. I haven't taken anything that helped.",
        patterns: [
          'what makes it better',
          'anything help',
          'anything relieve it',
          'does rest help',
          'does anything help',
        ],
        keywords: ['better', 'relieve', 'help', 'rest'],
      },
      {
        id: 'past-medical',
        answer:
          "I have high blood pressure and high cholesterol. I’ve been told to watch my heart because of that. I’ve been dealing with those for a few years now.",
        patterns: [
          'do you have any medical conditions',
          'any past medical history',
          'past medical history',
          'medical problems',
          'any conditions',
          'do you have any health problems',
        ],
        keywords: ['medical', 'history', 'conditions', 'problems', 'past'],
      },
      {
        id: 'medications',
        answer:
          "I take medication for my blood pressure, but I’ll admit I don’t always take it consistently. I’m not on anything else regularly. I don’t have any allergies that I know of.",
        patterns: [
          'do you take any medications',
          'what meds do you take',
          'what medicines do you take',
          'what medications are you on',
          'do you take anything',
        ],
        keywords: ['medications', 'medicines', 'meds', 'take'],
      },
      {
        id: 'severity',
        answer:
          "On a scale of 1 to 10, it's up there — like a 9. I've had aches before; this is different. I've never had chest pain this bad before.",
        patterns: [
          'how bad is it',
          'rate the pain',
          'pain scale',
          'from 1 to 10',
        ],
        keywords: ['bad', 'severe', 'scale', '10'],
      },
      {
        id: 'shortness-breath',
        answer:
          "Yeah — I feel like I can't get enough air. I'm not gasping like I ran a marathon, but I'm winded and tight.",
        patterns: [
          'do you have shortness of breath',
          'are you short of breath',
          'trouble breathing',
        ],
        keywords: ['shortness', 'breath', 'breathing'],
      },
      {
        id: 'nausea',
        answer:
          "I feel queasy — like I could vomit. Haven't thrown up yet, but my stomach is upset.",
        patterns: ['are you nauseous', 'do you feel sick', 'nausea'],
        keywords: ['nausea', 'nauseous', 'sick'],
      },
      {
        id: 'sweating',
        answer:
          "I'm sweating a lot — cold, clammy sweat. My shirt's damp. That's not normal for me.",
        patterns: ['are you sweating', 'did you get sweaty', 'diaphoresis'],
        keywords: ['sweat', 'sweating', 'diaphoresis'],
      },
      {
        id: 'fever',
        answer:
          "I don't think I have a fever — I haven't felt hot and cold like with the flu. No real cough either.",
        patterns: ['do you have fever', 'any fever', 'recent illness', 'any cough'],
        keywords: ['fever', 'cough', 'sick', 'illness'],
      },
      {
        id: 'allergies',
        answer: "Not that I know of — no bad reactions to medicines that I remember.",
        patterns: ['any allergies', 'allergic to anything', 'drug allergies'],
        keywords: ['allergies', 'allergic'],
      },
      {
        id: 'smoking',
        answer:
          "Yeah, I smoke — about a pack a day. I know I shouldn't, especially with my pressure and cholesterol.",
        patterns: [
          'do you smoke',
          'smoking history',
          'tobacco use',
          'do you use cigarettes',
        ],
        keywords: ['smoke', 'smoking', 'tobacco', 'cigarettes'],
      },
      {
        id: 'family-history',
        answer:
          "Heart stuff runs in my family — my dad had a heart attack in his early 60s. That's part of why I'm so worried right now.",
        patterns: [
          'family history',
          'anyone in your family have heart disease',
          'heart attack in family',
        ],
        keywords: ['family', 'father', 'heart', 'attack'],
      },
      {
        id: 'before',
        answer:
          "Never like this. I've had sore muscles and heartburn before — this feels different. Scarier.",
        patterns: [
          'have you had this before',
          'has this happened before',
          'similar pain before',
        ],
        keywords: ['before', 'previous', 'similar'],
      },
      {
        id: 'trauma',
        answer:
          "No — I didn't fall, get hit in the chest, or anything like that. It just started with the stairs.",
        patterns: ['any trauma', 'did you fall', 'injury', 'hurt yourself'],
        keywords: ['trauma', 'injury', 'fall'],
      },
    ],
  },

  {
    key: 'sudden-severe-headache',
    titleMatchers: ['sudden severe headache', 'severe headache', 'headache'],
    complaintMatchers: [
      'sudden headache',
      'headache started one hour ago',
      'neck hurts',
      'worst headache',
      'worst headache of my life',
    ],
    defaultAnswer:
      "This headache came out of nowhere an hour ago — worst pain I've ever had. My neck is stiff, light kills me, and I feel sick and feverish. I'm terrified.",
    qa: [
      {
        id: 'feeling-open',
        answer:
          "I suddenly got this really intense headache about an hour ago, and it came on really fast. It’s been getting worse, and my neck feels stiff too. I also feel kind of nauseous and sensitive to light.",
        patterns: [
          'can you tell me more about what you re feeling',
          'can you tell me more about what you\'re feeling',
          'tell me more about what you re feeling',
          'tell me more about your symptoms',
          'tell me more about your symptom',
        ],
        keywords: ['feeling', 'more', 'tell', 'symptoms', 'symptom'],
      },
      {
        id: 'chief-complaint',
        answer:
          "What brought me in is this sudden, brutal headache — like a switch flipped. My neck is stiff, I can't stand bright light, and I've been running hot and cold. I need help — I've never felt anything close to this.",
        patterns: [
          'what brought you in today',
          'what brought you in',
          'what seems to be the problem',
          'why are you here',
          'what happened',
        ],
        keywords: ['problem', 'headache', 'today', 'brought'],
      },
      {
        id: 'quality',
        answer:
          "It feels like a severe, pounding pain all over my head. It’s not just one spot, it’s kind of everywhere. It’s honestly one of the worst headaches I’ve ever had.",
        patterns: [
          'what does it feel like',
          'what kind of pain is it',
          'can you describe it more',
          'describe it more',
          'describe the headache',
        ],
        keywords: ['feel', 'describe', 'pounding', 'kind', 'pain'],
      },
      {
        id: 'onset',
        answer:
          "It started about an hour ago, very suddenly. I wasn’t doing anything unusual when it happened. It just came on out of nowhere.",
        patterns: [
          'when did this start',
          'when did it start',
          'how long has it been going on',
          'how long has this been going on',
          'was it sudden',
        ],
        keywords: ['when', 'start', 'sudden', 'hour', 'long'],
      },
      {
        id: 'trajectory',
        answer:
          "It’s definitely been getting worse since it started. It hasn’t improved at all. The pain just keeps building.",
        patterns: [
          'has it been getting better or worse',
          'getting better or worse',
          'better or worse',
          'has the pain changed over time',
          'pain changed over time',
        ],
        keywords: ['better', 'worse', 'changed', 'time'],
      },
      {
        id: 'location',
        answer:
          "It feels like it’s all over my head, not just one side. It’s kind of a whole-head pain. My neck also hurts and feels really stiff.",
        patterns: [
          'where exactly do you feel it',
          'where is the pain',
          'where is the headache',
          'what part of your head hurts',
          'can you point to where it hurts',
          'point to where it hurts',
        ],
        keywords: ['where', 'head', 'location', 'point'],
      },
      {
        id: 'radiation',
        answer:
          "It doesn’t really travel like arm or leg pain would. It just feels like my whole head is affected, and my neck is really stiff too. It all kind of feels connected.",
        patterns: [
          'does it go anywhere else',
          'does the pain travel',
          'does it radiate',
          'does the pain radiate',
          'go anywhere else',
          'move anywhere',
        ],
        keywords: ['radiate', 'travel', 'move', 'else'],
      },
      {
        id: 'associated-sob-nausea-sweat',
        answer:
          "I do feel nauseous, but I haven’t really noticed shortness of breath. I’ve had some chills along with the headache. The nausea seems to come and go.",
        patterns: [
          'any shortness of breath nausea or sweating',
          'shortness of breath nausea or sweating',
          'shortness of breath nausea sweating',
          'any other symptoms',
          'other symptoms',
        ],
        keywords: ['shortness', 'breath', 'nausea', 'sweating', 'symptoms'],
      },
      {
        id: 'worse',
        answer:
          "Bright lights definitely make it worse, and moving my head is uncomfortable. It feels worse when I try to sit up or look around. I just want to lie still.",
        patterns: [
          'does anything make it worse',
          'what makes it worse',
          'anything make it worse',
          'worse with activity',
          'what makes it better or worse',
        ],
        keywords: ['worse', 'better', 'anything'],
      },
      {
        id: 'past-medical',
        answer:
          "I don’t really have any major medical problems. I’ve never had headaches like this before. I’m generally pretty healthy.",
        patterns: [
          'do you have any medical conditions',
          'any past medical history',
          'past medical history',
          'medical problems',
          'any conditions',
        ],
        keywords: ['medical', 'conditions', 'history', 'past'],
      },
      {
        id: 'medications',
        answer:
          "I don’t take any regular medications. I might take something like ibuprofen occasionally, but nothing daily. I don’t have any known allergies.",
        patterns: [
          'do you take any medications',
          'what meds do you take',
          'what medicines do you take',
          'what medications are you on',
        ],
        keywords: ['medications', 'medicines', 'meds', 'take'],
      },
      {
        id: 'severity',
        answer:
          "Ten out of ten — and I mean it. This is the worst headache of my life. I'm not being dramatic.",
        patterns: ['how bad is it', 'pain scale', 'from 1 to 10', 'rate it'],
        keywords: ['bad', 'scale', '10', 'worst'],
      },
      {
        id: 'neck',
        answer:
          "Yes — my neck is stiff and painful. It hurts to bend it forward. That scares me as much as the headache.",
        patterns: [
          'does your neck hurt',
          'neck pain',
          'neck stiffness',
          'is your neck stiff',
        ],
        keywords: ['neck', 'stiff', 'stiffness'],
      },
      {
        id: 'photophobia',
        answer:
          "Even the lights in here feel like knives. I need it dark.",
        patterns: [
          'does light bother you',
          'bright lights make it worse',
          'photophobia',
        ],
        keywords: ['light', 'lights', 'bright', 'photophobia'],
      },
      {
        id: 'fever',
        answer:
          "I've felt feverish — hot and then chills. I haven't taken my temperature at home carefully, but I feel sick all over.",
        patterns: ['do you have fever', 'any fever', 'chills'],
        keywords: ['fever', 'chills'],
      },
      {
        id: 'nausea',
        answer:
          "Yes — I'm nauseous. I haven't thrown up yet but I'm close.",
        patterns: ['nausea', 'are you nauseous', 'have you vomited'],
        keywords: ['nausea', 'nauseous', 'vomit'],
      },
      {
        id: 'weak',
        answer:
          "I feel wiped out — weak, shaky, like I can barely sit up. It's not just the pain; my whole body feels wrong.",
        patterns: ['are you weak', 'fatigue', 'tired'],
        keywords: ['weak', 'tired', 'fatigue'],
      },
      {
        id: 'injury',
        answer:
          "No — I didn't hit my head, fall, or anything. I was resting when this started.",
        patterns: ['head injury', 'trauma', 'did you fall', 'hit your head'],
        keywords: ['injury', 'trauma', 'head'],
      },
      {
        id: 'before',
        answer:
          "Never — I get the occasional mild headache, but nothing like this. No migraines that I know of.",
        patterns: [
          'have you had this before',
          'similar headache before',
          'history of migraines',
        ],
        keywords: ['before', 'similar', 'migraines'],
      },
      {
        id: 'seizure',
        answer: "No seizure history — I've never had one.",
        patterns: ['history of seizures', 'any seizure history'],
        keywords: ['seizure', 'seizures'],
      },
      {
        id: 'allergies',
        answer:
          "No known drug allergies that I'm aware of.",
        patterns: ['any allergies', 'drug allergies', 'allergic to anything'],
        keywords: ['allergies', 'allergic'],
      },
      {
        id: 'social',
        answer:
          "I share an apartment with a roommate — we both work, so I'm around people at the office too. Nothing weird travel-wise lately, just normal life.",
        patterns: [
          'do you live with anyone',
          'where do you live',
          'social history',
          'living situation',
        ],
        keywords: ['live', 'roommate', 'apartment', 'work'],
      },
    ],
  },

  {
    key: 'acute-shortness-of-breath',
    titleMatchers: ['acute shortness of breath', 'shortness of breath'],
    complaintMatchers: ['sudden onset shortness of breath', 'trouble breathing'],
    defaultAnswer:
      "I can't breathe right — it came on fast today. My chest feels tight, I'm winded even sitting, and I'm scared. I flew recently and one leg's been feeling off.",
    qa: [
      {
        id: 'feeling-open',
        answer:
          "I suddenly started feeling really short of breath earlier today. It feels like I can’t get enough air in, even when I try to take deep breaths. It’s making me a bit anxious because it came on so quickly.",
        patterns: [
          'can you tell me more about what you re feeling',
          'can you tell me more about what you\'re feeling',
          'tell me more about what you re feeling',
          'tell me more about your symptoms',
          'tell me more about your symptom',
        ],
        keywords: ['feeling', 'more', 'tell', 'symptoms', 'symptom'],
      },
      {
        id: 'chief-complaint',
        answer:
          "What brought me in is I can't breathe like normal — it hit suddenly and I'm not getting better. I feel tight in the chest and I'm anxious because I can't get air.",
        patterns: [
          'what brought you in today',
          'what brought you in',
          'what seems to be the problem',
          'what happened',
          'why are you here',
        ],
        keywords: ['problem', 'breathing', 'shortness', 'brought'],
      },
      {
        id: 'quality',
        answer:
          "It feels like tightness in my chest and like I’m not getting enough air. I keep trying to take deep breaths, but it doesn’t feel satisfying. It’s not really pain, more like pressure and difficulty breathing.",
        patterns: [
          'what does it feel like',
          'what kind of pain is it',
          'can you describe it more',
          'describe it more',
          'describe what you re feeling',
          'describe the breathing',
        ],
        keywords: ['feel', 'describe', 'like', 'kind', 'pain'],
      },
      {
        id: 'onset',
        answer:
          "It started suddenly today, not gradually. One moment I was fine, and then I just felt like I couldn’t breathe properly. It’s been going on since then.",
        patterns: [
          'when did this start',
          'when did it start',
          'how long has it been going on',
          'how long has this been going on',
          'did it start suddenly',
        ],
        keywords: ['when', 'start', 'suddenly', 'long'],
      },
      {
        id: 'trajectory',
        answer:
          "It’s stayed about the same or maybe slightly worse. It definitely hasn’t improved. I still feel pretty uncomfortable.",
        patterns: [
          'has it been getting better or worse',
          'getting better or worse',
          'better or worse',
          'has the pain changed over time',
          'pain changed over time',
        ],
        keywords: ['better', 'worse', 'changed', 'time'],
      },
      {
        id: 'location',
        answer:
          "It’s not really in one spot like pain would be. It feels like my whole chest is tight. The main issue is just not being able to breathe well.",
        patterns: [
          'where exactly do you feel it',
          'where do you feel it',
          'where is the discomfort',
          'can you point to where it hurts',
          'point to where it hurts',
        ],
        keywords: ['where', 'feel', 'chest', 'point'],
      },
      {
        id: 'radiation',
        answer:
          "It doesn’t really spread anywhere. It’s mostly just in my chest with the breathing problem. I haven’t noticed it going into my arms or anything like that.",
        patterns: [
          'does it go anywhere else',
          'does the pain travel',
          'does it radiate',
          'does the pain radiate',
          'go anywhere else',
        ],
        keywords: ['anywhere', 'else', 'radiate', 'travel'],
      },
      {
        id: 'associated-sob-nausea-sweat',
        answer:
          "I definitely feel short of breath, that’s the main issue. I haven’t really felt nauseous, but I do feel a bit uneasy. I haven’t noticed much sweating.",
        patterns: [
          'any shortness of breath nausea or sweating',
          'shortness of breath nausea or sweating',
          'shortness of breath nausea sweating',
          'any other symptoms',
          'other symptoms',
        ],
        keywords: ['shortness', 'breath', 'nausea', 'sweating', 'symptoms'],
      },
      {
        id: 'worse',
        answer:
          "Moving around definitely makes it worse. Even small activity makes me feel more out of breath. Sitting still helps a little, but not completely.",
        patterns: [
          'does anything make it worse',
          'what makes it worse',
          'worse with walking',
          'worse with activity',
          'what makes it better or worse',
        ],
        keywords: ['worse', 'walking', 'activity', 'movement', 'better'],
      },
      {
        id: 'better',
        answer:
          "Sitting and trying to slow my breathing down helps a tiny bit, but I'm still short of breath. I wouldn't say I'm comfortable.",
        patterns: ['what makes it better', 'anything help', 'rest help'],
        keywords: ['better', 'help', 'rest'],
      },
      {
        id: 'medical-history',
        answer:
          "I don’t have any major lung problems that I know of. I’ve generally been healthy. Nothing like this has happened before.",
        patterns: [
          'do you have any medical conditions',
          'any past medical history',
          'past medical history',
          'medical problems',
          'health conditions',
        ],
        keywords: ['medical', 'history', 'conditions', 'past'],
      },
      {
        id: 'medications',
        answer:
          "I’m not on any regular medications. I don’t take anything daily. No known allergies either.",
        patterns: [
          'do you take any medications',
          'what meds do you take',
          'medications',
          'medicines',
          'what do you take',
        ],
        keywords: ['medications', 'medicines', 'meds', 'take'],
      },
      {
        id: 'chest-pain',
        answer:
          "I wouldn't describe it as classic crushing chest pain — it's more tight and hurts when I breathe in deep. The breathing is what's scaring me most.",
        patterns: ['any chest pain', 'does your chest hurt', 'pleuritic'],
        keywords: ['chest', 'pain'],
      },
      {
        id: 'severity',
        answer:
          "Bad — I feel like I might pass out if I push myself. I'm not fine. Maybe an 8 out of 10 for how scary it feels.",
        patterns: ['how bad is it', 'severity', 'from 1 to 10'],
        keywords: ['bad', 'severe', 'breath'],
      },
      {
        id: 'cough',
        answer:
          "Not really — maybe a little dry cough trying to catch my breath, but nothing like bronchitis.",
        patterns: ['do you have a cough', 'coughing'],
        keywords: ['cough'],
      },
      {
        id: 'fever',
        answer:
          "I haven't felt really feverish — no big chills. Maybe a little warm but not like the flu.",
        patterns: ['fever', 'any fever', 'recent illness'],
        keywords: ['fever', 'illness'],
      },
      {
        id: 'wheezing',
        answer:
          "I don't hear wheezing like an asthma attack — it's more I can't get air in.",
        patterns: ['are you wheezing', 'wheezing'],
        keywords: ['wheezing', 'wheeze'],
      },
      {
        id: 'leg',
        answer:
          "One leg — the calf — has felt swollen and sore compared to the other. I didn't think much of it until all this breathing trouble.",
        patterns: [
          'leg swelling',
          'any swelling in your legs',
          'calf pain',
          'leg pain',
        ],
        keywords: ['leg', 'swelling', 'calf'],
      },
      {
        id: 'allergies',
        answer: "No known allergies to medicines.",
        patterns: ['allergies', 'allergic to anything'],
        keywords: ['allergies', 'allergic'],
      },
      {
        id: 'smoking',
        answer:
          "I smoked years ago but quit — not a current heavy smoker.",
        patterns: ['do you smoke', 'smoking history', 'tobacco'],
        keywords: ['smoke', 'smoking', 'tobacco'],
      },
      {
        id: 'travel',
        answer:
          "I was on a long flight recently — stuck sitting for hours. That's when my leg started feeling weird.",
        patterns: [
          'recent travel',
          'long car ride',
          'plane ride',
          'were you immobile recently',
        ],
        keywords: ['travel', 'plane', 'car', 'immobile'],
      },
      {
        id: 'before',
        answer:
          "No — I've been short of breath with exertion before, but not like this out of the blue.",
        patterns: ['have you had this before', 'similar episode before'],
        keywords: ['before', 'similar'],
      },
    ],
  },

  {
    key: 'rlq-abdominal-pain',
    titleMatchers: [
      'right lower quadrant abdominal pain',
      'abdominal pain',
      'right lower quadrant',
    ],
    complaintMatchers: ['abdominal pain', 'right side', 'stomach hurts'],
    defaultAnswer:
      "My stomach's been killing me since earlier — it started near my belly button and moved to the lower right. Sharp pain, worse when I walk. I'm nauseous and haven't eaten.",
    qa: [
      {
        id: 'feeling-open',
        answer:
          "My stomach started hurting earlier today, and it’s gotten worse over time. It started near my belly button but now it’s more on the lower right side. It hurts more when I move or walk.",
        patterns: [
          'can you tell me more about what you re feeling',
          'can you tell me more about what you\'re feeling',
          'tell me more about what you re feeling',
          'tell me more about your symptoms',
          'tell me more about your symptom',
        ],
        keywords: ['feeling', 'more', 'tell', 'symptoms', 'symptom'],
      },
      {
        id: 'chief-complaint',
        answer:
          "What brought me in is bad stomach pain that started around my belly button and settled in my right lower abdomen. I'm a college student — I tried to tough it out but it's getting worse.",
        patterns: [
          'what brought you in today',
          'what brought you in',
          'what seems to be the problem',
          'what happened',
          'why are you here',
        ],
        keywords: ['problem', 'stomach', 'pain', 'brought'],
      },
      {
        id: 'quality',
        answer:
          "It feels like a sharp, constant pain. It’s not cramping, more like a stabbing feeling. It’s pretty uncomfortable and doesn’t go away.",
        patterns: [
          'what does it feel like',
          'what kind of pain is it',
          'can you describe it more',
          'describe it more',
          'describe the pain',
        ],
        keywords: ['sharp', 'feel', 'describe', 'kind', 'pain'],
      },
      {
        id: 'onset',
        answer:
          "It started earlier today, kind of gradually. At first it was mild, but it kept getting worse. Now it’s pretty strong.",
        patterns: [
          'when did this start',
          'when did it start',
          'when did this begin',
          'how long',
          'how long has this been going on',
        ],
        keywords: ['when', 'start', 'begin', 'long'],
      },
      {
        id: 'trajectory',
        answer:
          "It’s definitely been getting worse over time. It hasn’t improved at all. It’s more painful now than when it started.",
        patterns: [
          'has it been getting better or worse',
          'getting better or worse',
          'better or worse',
          'has the pain changed over time',
          'pain changed over time',
        ],
        keywords: ['better', 'worse', 'changed', 'time'],
      },
      {
        id: 'location',
        answer:
          "Right now it’s mostly in the lower right side of my abdomen. That’s where it hurts the most. It’s very specific to that area now.",
        patterns: [
          'where exactly do you feel it',
          'where is the pain',
          'where does it hurt',
          'show me where it hurts',
          'can you point to where it hurts',
          'point to where it hurts',
        ],
        keywords: ['where', 'location', 'right', 'point'],
      },
      {
        id: 'radiation',
        answer:
          "It started more in the middle near my belly button, but then moved to the lower right side. Now it mostly stays there. It doesn’t really spread anywhere else.",
        patterns: [
          'does it go anywhere else',
          'does the pain travel',
          'does it radiate',
          'does the pain radiate',
          'go anywhere else',
        ],
        keywords: ['anywhere', 'else', 'radiate', 'travel'],
      },
      {
        id: 'migration',
        answer:
          "Yeah — classic weird story — it began periumbilical, around my belly button, then moved to the RLQ. That's what freaked me out.",
        patterns: [
          'did the pain move',
          'has the location changed',
          'where did it start',
          'did it migrate',
        ],
        keywords: ['move', 'moved', 'belly', 'button', 'right'],
      },
      {
        id: 'associated-sob-nausea-sweat',
        answer:
          "I’ve been feeling nauseous and I did throw up once. I haven’t noticed shortness of breath or sweating. The nausea started after the pain got worse.",
        patterns: [
          'any shortness of breath nausea or sweating',
          'shortness of breath nausea or sweating',
          'shortness of breath nausea sweating',
          'any other symptoms',
          'other symptoms',
        ],
        keywords: ['shortness', 'breath', 'nausea', 'sweating', 'symptoms'],
      },
      {
        id: 'worse',
        answer:
          "Moving around or walking definitely makes it worse. Even small movements can make it hurt more. Lying still helps a little.",
        patterns: [
          'does anything make it worse',
          'what makes it worse',
          'worse with movement',
          'worse walking',
          'what makes it better or worse',
        ],
        keywords: ['worse', 'walking', 'moving', 'movement', 'better'],
      },
      {
        id: 'better',
        answer:
          "Lying on my side with my knees bent helps a little. Nothing makes it go away.",
        patterns: ['what makes it better', 'anything help', 'relieve it'],
        keywords: ['better', 'help', 'relieve'],
      },
      {
        id: 'medical-history',
        answer:
          "I don’t have any medical problems that I know of. I’ve been pretty healthy overall. No major issues before this.",
        patterns: [
          'do you have any medical conditions',
          'any past medical history',
          'past medical history',
          'medical problems',
          'health conditions',
        ],
        keywords: ['medical', 'history', 'conditions', 'past'],
      },
      {
        id: 'medications',
        answer:
          "I don’t take any regular medications. I haven’t needed anything daily. I don’t have any allergies that I know of.",
        patterns: [
          'do you take any medications',
          'what meds do you take',
          'medications',
          'medicines',
          'what do you take',
        ],
        keywords: ['medications', 'medicines', 'meds', 'take'],
      },
      {
        id: 'severity',
        answer:
          "Pretty bad — like an 8 out of 10. Enough that I couldn't focus in class.",
        patterns: ['how bad is it', 'from 1 to 10', 'pain scale'],
        keywords: ['bad', 'scale', '8', '10'],
      },
      {
        id: 'nausea',
        answer: "Yeah — I'm nauseous. I threw up once.",
        patterns: ['nausea', 'are you nauseous', 'feel sick'],
        keywords: ['nausea', 'nauseous', 'sick'],
      },
      {
        id: 'vomiting',
        answer: "Once — dry heaves mostly, little came up.",
        patterns: ['have you vomited', 'any vomiting', 'throw up'],
        keywords: ['vomit', 'vomited', 'throw'],
      },
      {
        id: 'appetite',
        answer:
          "Zero appetite — the thought of food makes me feel sicker.",
        patterns: ['appetite', 'are you hungry', 'loss of appetite'],
        keywords: ['appetite', 'hungry', 'eat'],
      },
      {
        id: 'fever',
        answer:
          "I felt warm at home — low-grade. I didn't take it perfectly accurately.",
        patterns: ['fever', 'any fever', 'temperature'],
        keywords: ['fever', 'temperature'],
      },
      {
        id: 'diarrhea',
        answer: "No diarrhea — bowel movements have been pretty normal.",
        patterns: ['diarrhea', 'loose stool'],
        keywords: ['diarrhea', 'stool'],
      },
      {
        id: 'urinary',
        answer:
          "No burning when I pee, no frequency like a UTI.",
        patterns: ['pain with urination', 'burning urination', 'urinary symptoms'],
        keywords: ['urination', 'pee', 'burning', 'urinary'],
      },
      {
        id: 'trauma',
        answer:
          "No injury — I didn't get hit in the stomach or fall.",
        patterns: ['any injury', 'trauma', 'did you fall'],
        keywords: ['injury', 'trauma'],
      },
      {
        id: 'surgeries',
        answer: "Never had abdominal surgery.",
        patterns: ['any surgeries', 'have you had surgery before'],
        keywords: ['surgery', 'surgeries'],
      },
      {
        id: 'allergies',
        answer: "No allergies to meds that I know of.",
        patterns: ['allergies', 'allergic to anything'],
        keywords: ['allergies', 'allergic'],
      },
    ],
  },

  {
    key: 'fever-confusion',
    titleMatchers: ['fever and confusion', 'confusion'],
    complaintMatchers: ['fever', 'confusion', 'acute confusion'],
    defaultAnswer:
      "I don't feel right — I'm burning up and my daughter says I'm not making sense. Everything's foggy. I'm weak and scared.",
    qa: [
      {
        id: 'feeling-open',
        answer:
          "I’ve been feeling very weak and confused, like I can’t think clearly. I’ve also had a fever, and everything just feels off. It’s been hard to focus on things.",
        patterns: [
          'can you tell me more about what you re feeling',
          'can you tell me more about what you\'re feeling',
          'tell me more about what you re feeling',
          'tell me more about your symptoms',
          'tell me more about your symptom',
        ],
        keywords: ['feeling', 'more', 'tell', 'symptoms', 'symptom'],
      },
      {
        id: 'chief-complaint',
        answer:
          "What brought me in — according to my daughter — is I've had a high fever and I'm not myself. I'm muddled, shaky, and I feel sick all over. I know something's wrong.",
        patterns: [
          'what brought you in today',
          'what brought you in',
          'what seems to be the problem',
          'why are you here',
          'what happened',
        ],
        keywords: ['problem', 'fever', 'confused', 'brought'],
      },
      {
        id: 'quality',
        answer:
          "It’s not really pain, it’s more like my head feels foggy. I feel tired and a bit disoriented. I just don’t feel like myself.",
        patterns: [
          'what does it feel like',
          'what kind of pain is it',
          'can you describe it more',
          'describe it more',
          'describe what you re feeling',
        ],
        keywords: ['feel', 'describe', 'like', 'kind', 'pain'],
      },
      {
        id: 'onset',
        answer:
          "It started recently, maybe over the last day or so. I can’t remember the exact time. It just gradually got worse.",
        patterns: [
          'when did this start',
          'when did it start',
          'how long has this been going on',
          'how long has it been going on',
        ],
        keywords: ['when', 'start', 'long'],
      },
      {
        id: 'trajectory',
        answer:
          "It seems like it’s been getting worse. I feel more confused now than before. I’m having a harder time thinking clearly.",
        patterns: [
          'has it been getting better or worse',
          'getting better or worse',
          'better or worse',
          'has the pain changed over time',
          'pain changed over time',
        ],
        keywords: ['better', 'worse', 'changed', 'time'],
      },
      {
        id: 'location',
        answer:
          "It’s more in my head, like mentally. I don’t have a specific spot of pain. It’s more of a general feeling of confusion and weakness.",
        patterns: [
          'where exactly do you feel it',
          'where do you feel it',
          'where is the discomfort',
          'can you point to where it hurts',
          'point to where it hurts',
        ],
        keywords: ['where', 'feel', 'point'],
      },
      {
        id: 'radiation',
        answer:
          "It doesn’t really spread anywhere like pain would. It’s more of an overall feeling in my body. I just feel weak all over.",
        patterns: [
          'does it go anywhere else',
          'does the pain travel',
          'does it radiate',
          'does the pain radiate',
          'go anywhere else',
        ],
        keywords: ['anywhere', 'else', 'radiate', 'travel'],
      },
      {
        id: 'associated-sob-nausea-sweat',
        answer:
          "I’ve had a fever and felt weak, but not much shortness of breath. I don’t think I’ve been very nauseous. I just feel tired and unwell.",
        patterns: [
          'any shortness of breath nausea or sweating',
          'shortness of breath nausea or sweating',
          'shortness of breath nausea sweating',
          'any other symptoms',
          'other symptoms',
        ],
        keywords: ['shortness', 'breath', 'nausea', 'sweating', 'symptoms'],
      },
      {
        id: 'worse',
        answer:
          "It seems worse when I try to think or move around too much. I get more confused when I try to focus. Resting helps a little.",
        patterns: [
          'does anything make it worse',
          'what makes it worse',
          'anything make it worse',
          'what makes it better or worse',
        ],
        keywords: ['worse', 'anything', 'better'],
      },
      {
        id: 'medical-history',
        answer:
          "I have some medical problems, but I can’t remember all the details right now. I’ve had health issues before. I usually manage them with medication.",
        patterns: [
          'do you have any medical conditions',
          'any past medical history',
          'past medical history',
          'medical problems',
        ],
        keywords: ['medical', 'history', 'conditions', 'past'],
      },
      {
        id: 'medications',
        answer:
          "I do take some medications, but I can’t remember all their names right now. I take them regularly at home. I don’t think I have any allergies.",
        patterns: [
          'do you take any medications',
          'what meds do you take',
          'medications',
          'medicines',
          'what do you take',
        ],
        keywords: ['medications', 'medicines', 'meds', 'take'],
      },
      {
        id: 'fever',
        answer:
          "Yes — I've been burning up. Chills too. My family said I felt hot.",
        patterns: ['fever', 'any fever', 'temperature'],
        keywords: ['fever', 'temperature'],
      },
      {
        id: 'confusion',
        answer:
          "I know I'm not thinking clearly — I'm mixing things up, asking the same thing twice. That's not normal for me.",
        patterns: ['are you confused', 'what do you mean by confusion', 'mental status'],
        keywords: ['confused', 'confusion', 'mental'],
      },
      {
        id: 'weakness',
        answer:
          "I'm weak — I can barely walk to the bathroom. My legs feel like jelly.",
        patterns: ['weak', 'fatigue', 'tired'],
        keywords: ['weak', 'fatigue', 'tired'],
      },
      {
        id: 'cough',
        answer:
          "Not really — a little throat tickle maybe, but no bad cough.",
        patterns: ['cough', 'are you coughing'],
        keywords: ['cough'],
      },
      {
        id: 'urinary',
        answer:
          "Yes — it burns when I pee, and I've been going more often. That's been part of today.",
        patterns: ['burning urination', 'pain with urination', 'urinary symptoms'],
        keywords: ['burning', 'urination', 'pee', 'urinary'],
      },
      {
        id: 'abd-pain',
        answer:
          "My belly's not the main thing — a little achy maybe, but not like bad appendicitis pain or anything.",
        patterns: ['abdominal pain', 'belly pain'],
        keywords: ['abdominal', 'belly', 'pain'],
      },
      {
        id: 'allergies',
        answer:
          "I don't think I'm allergic to medicines — nothing I remember.",
        patterns: ['allergies', 'allergic to anything'],
        keywords: ['allergies', 'allergic'],
      },
    ],
  },
]
