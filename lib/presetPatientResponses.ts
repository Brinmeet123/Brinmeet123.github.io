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
          "I'm honestly pretty frightened. There's this heavy, squeezing feeling right in the center of my chest, kind of behind my breastbone, and it's spreading into my left arm and up toward my jaw. I'm drenched in sweat, I feel sick to my stomach, and I can't get a good breath. It all started when I was walking up the stairs at work — maybe 30 minutes ago — and it hasn't let up.",
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
          "It's not a little pinch — it's a deep, heavy pressure, like someone's standing on my chest. Kind of crushing. I wouldn't call it stabbing; it's more squeezing, and it feels really wrong.",
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
          "It started about 30 minutes ago while I was walking up the stairs — not sprinting, just normal steps. I had to stop and lean on the railing. Before that I felt fine.",
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
          "If anything it's gotten worse — or at least it hasn't gotten better. I'm not someone who runs to the ER, but this feels like it's ramping up, not fading.",
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
          "It's mostly right in the center of my chest, kind of behind my breastbone. It feels deep — not like a skin thing or a pulled muscle on the side. That's where the worst of it is.",
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
          "Yeah — it goes into my left arm, kind of heavy and achy, and I also feel it up along my jaw on the left. It's not just one tiny dot; it spreads.",
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
          "Yes to all of that — I'm short of breath even when I try to slow my breathing down, I feel nauseous like I might throw up, and I've been sweating through my shirt. Clammy, cold sweat.",
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
          "Walking and any exertion make it worse — that's how it started. Even talking too much right now winds me. Nothing has really made it go away; sitting and trying to calm down helps a tiny bit, but not much.",
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
          "I've got high blood pressure and my cholesterol runs high — my doctor's been on me about diet and meds for years. No diabetes that I know of. This isn't from a fall or anything; I didn't injure my chest.",
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
          "I'm supposed to take something for blood pressure and a statin for cholesterol — honestly I miss doses more than I should, especially when work gets busy. I don't take a bunch of other pills regularly.",
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
          "I'm completely miserable. About an hour ago I got this sudden, explosive headache all over my head — the worst I've ever had. My neck is stiff and hurts to move, bright lights make me want to scream, and I've been nauseous with fever and chills. I feel weak and shaky. I was just resting when it hit — no injury, nothing.",
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
          "It's a violent pounding, throbbing pain — my whole head feels like it's going to burst. Not like a little tension headache; it's 10 out of 10 and constant.",
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
          "It started suddenly about an hour ago — I can pretty much tell you the minute it began. Max pain almost right away. I wasn't doing anything strenuous.",
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
          "It's not getting better — if anything I'm more light-sensitive and my neck feels tighter. This isn't fading like a normal headache.",
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
          "It's all over — I can't point to one little spot. Front, sides, top — everywhere. The neck stiffness makes it feel connected up and down my spine.",
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
          "It doesn't really travel like pain shooting down an arm or leg — it's more my whole head and my neck. The neck stiffness is the worst besides the headache itself.",
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
          "I'm not really short of breath. I am nauseous — haven't vomited yet but I feel like I could. I've had sweats and chills with feeling feverish.",
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
          "Bright lights and noise make it unbearable. Moving my neck makes it worse. Lying still in a dark, quiet room helps a little — not a cure, but a little.",
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
          "I've been healthy overall — no high blood pressure that I know of, no diabetes. I don't have a long list of medical problems. This headache is new and terrifying.",
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
          "I don't take daily prescriptions — maybe ibuprofen here and there for period cramps, but nothing regular. I haven't taken anything that's touched this pain.",
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
          "I'm really struggling — I suddenly couldn't catch my breath today. It feels like there's a tight band around my chest and I can't get a full breath in, like I'm smothering. I'm a little clammy. I had a long flight not long ago and I've been sitting a lot, and now that you ask, one calf has felt heavier than the other. I'm on blood pressure and cholesterol meds from my doctor.",
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
          "It's not really a sharp stabbing pain — it's air hunger. I feel like I'm working hard to breathe and I can't finish a breath. There's a dull ache or tightness in my chest when I try to take a deep breath.",
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
          "It started suddenly today — I can't pin it to one exact minute, but it came on fast, not over weeks. I've been getting worse since it started.",
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
          "I haven't turned the corner — it's been pretty steady bad, maybe a little worse the more I move. I'm not back to baseline at all.",
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
          "It's not really one spot of pain like a bee sting — it's more my whole chest feels tight and I can't expand my lungs all the way. Like I'm breathing through a straw.",
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
          "The breathing problem doesn't shoot down my arm like you hear about with a heart attack — it's centered in my chest and my breathing. My leg bothering me is separate — one calf feels tight or swollen.",
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
          "The main thing is I'm short of breath — that's why I'm here. I'm not really nauseous. I have felt clammy and a little sweaty, like when you're panicking.",
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
          "Walking across the room, going to the bathroom — anything that gets my heart rate up makes the breathing feel worse. Sitting still is a little easier but I'm still not right.",
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
          "I have high blood pressure and my cholesterol is treated — no diagnosed asthma or COPD that I know of. I'm 60 — I don't run marathons but I'm not usually this winded.",
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
          "I take lisinopril for blood pressure and atorvastatin for cholesterol — every day, usually. That's the main stuff.",
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
          "I'm pretty miserable. Earlier today my whole belly felt off, then the pain moved down to my right lower side — sharp and constant. Walking makes it spike, I feel nauseous and I threw up once, and I haven't wanted food. I had a low-grade fever at home. No diarrhea, and it doesn't burn when I pee.",
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
          "It's sharp — like a stabbing cramp in one area — and it gets worse when I move or jostle. Not really burning like heartburn; more like something's inflamed down there.",
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
          "It started earlier today — first I noticed it more around my belly button, then it migrated. If you mean exact time, late morning-ish, but it's been a few hours now.",
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
          "It's gotten worse — especially since the pain moved to the right lower side. I'm not improving.",
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
          "Right now the worst spot is my right lower abdomen — like down and to the side of my belly button. That's where it hurts to press or move.",
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
          "It started more in the middle near my belly button, but now it's mostly the lower right — it doesn't really shoot up to my shoulder. It's localized down there.",
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
          "I'm not short of breath. I'm definitely nauseous and I puked once. I've felt a little sweaty with the fever but not like drenched.",
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
          "Walking, going over bumps in the car, even getting up — anything that jiggles my belly makes it worse. Lying still is a little better but not great.",
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
          "I'm usually healthy — no major medical problems, no Crohn's or anything like that. I've never had surgery on my belly.",
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
          "I don't take any regular prescriptions — maybe ibuprofen once in a while for a headache, but that's it.",
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
          "I feel awful — hot and then cold, and my head isn't working right. I'm confused about where I am sometimes, and I'm weaker than usual. It burns a little when I pee. My family says I started acting strange this morning. I'm trying to answer you but I'm foggy — I have diabetes and high blood pressure, and I take pills, but I can't remember every name right now.",
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
          "It's hard to describe — it's not just pain. I feel boiling one minute and freezing the next, and my thinking is slow and fuzzy, like I'm underwater. I'm nauseous off and on.",
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
          "This morning is when my family noticed it — I wasn't this bad yesterday. It's been getting worse through the day, as far as I can tell.",
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
          "Worse — I was a little off earlier, but now I'm really out of it and weak. I'm not improving.",
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
          "It's not really one spot — I feel sick everywhere, and my head feels heavy and confused. The burning when I pee is lower down — that's the only localized thing.",
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
          "The confusion and fever don't 'travel' like pain down an arm — it's more all-over sickness. The urinary burning is separate, down low.",
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
          "I'm not really short of breath — a little winded when I'm feverish maybe. I feel nauseous. I've been sweating with the fever, drenched off and on.",
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
          "Trying to stand up and walk makes me feel worse — I want to lie still. Bright lights bother me a bit. Nothing fixes it.",
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
          "I have diabetes and high blood pressure — I've had both for years. I don't remember every hospital visit, but those are the big ones my family reminds me about.",
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
          "I take pills for blood sugar and blood pressure — metformin I know for sure, and something for pressure — maybe lisinopril? I also take a water pill sometimes. I'm sorry, I'm fuzzy on the full list today.",
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
