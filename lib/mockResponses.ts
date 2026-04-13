/**
 * Mock responses for demo mode (DEMO_MODE=true) when Ollama is not used.
 * Keyword-based patient replies — scenario-specific, 2–3 sentences each.
 */

const REPLY_EMPTY =
  "I’m not sure I caught what you asked… could you say it again? I want to make sure I answer you the right way."

const REPLY_CLARIFY =
  "I’m not totally sure what you mean by that… could you explain it a little differently? I want to make sure I answer you right."

function getLastDoctorMessage(
  messages: Array<{ role: string; content: string }>
): string {
  const last = [...messages]
    .reverse()
    .find((m) => m.role === 'doctor' || m.role === 'user')
  return last?.content ?? ''
}

/** Sweat / diaphoresis — avoid false match on “sweater”. */
function mentionsSweating(input: string): boolean {
  return (
    input.includes('sweat') ||
    input.includes('clammy') ||
    input.includes('diaphoret')
  )
}

function chestPainKeywords(input: string): string {
  const m = input

  if (
    m.includes('radiat') ||
    m.includes('spread') ||
    m.includes('jaw') ||
    m.includes('shoulder') ||
    (m.includes('arm') &&
      (m.includes('left') || m.includes('right') || m.includes('your'))) ||
    (m.includes('anywhere') && (m.includes('else') || m.includes('go'))) ||
    m.includes('move anywhere')
  ) {
    return "Yeah… now that you mention it, my left arm feels kind of heavy and a little numb. It’s not super painful there, just uncomfortable. I didn’t think it was related at first, honestly."
  }

  if (
    m.includes('shortness') ||
    m.includes('breathing') ||
    m.includes('breath') ||
    m.includes('winded') ||
    m.includes('dyspnea') ||
    m.includes('air')
  ) {
    return "Yeah, I do feel a little short of breath. Like I can’t take a full deep breath without it feeling uncomfortable. It’s not severe, but it’s definitely noticeable, and that’s part of what scared me."
  }

  if (m.includes('nausea') || m.includes('throw up') || m.includes('vomit') || (m.includes('sick') && !m.includes('history'))) {
    return "I feel a little nauseous, yeah. I haven’t thrown up or anything, but my stomach just feels off. It started around the same time as the chest discomfort, and I’m not used to that."
  }

  if (mentionsSweating(m)) {
    return "Yeah, I’ve been sweating more than usual. I noticed it even though I wasn’t doing anything that intense just now. My shirt actually feels a little damp, and that’s not normal for me."
  }

  if (/\bwhere\b/.test(m) || m.includes('location') || (m.includes('exactly') && m.includes('feel'))) {
    return "It’s mostly right here in the center of my chest. Sometimes it feels like it kind of spreads toward my left side, especially my arm. It’s not sharp, more like a deep pressure that just sits there."
  }

  if (
    /\bwhen\b/.test(m) ||
    m.includes('start') ||
    m.includes('began') ||
    m.includes('onset') ||
    m.includes('how long') ||
    m.includes('duration')
  ) {
    return "I think it started about 30 minutes ago… I wasn’t doing anything crazy, just walking upstairs at home after work. It kind of came on suddenly and hasn’t really improved since, and that’s what made me come in."
  }

  if (
    m.includes('worse') ||
    m.includes('better') ||
    m.includes('relief') ||
    m.includes('what makes') ||
    m.includes('anything make')
  ) {
    return "Nothing really seems to make it better. I tried sitting down and resting, but it didn’t go away. If anything, it just stays the same no matter what I do, which is what worries me."
  }

  if (
    m.includes('pain') ||
    m.includes('chest') ||
    m.includes('hurt') ||
    m.includes('pressure') ||
    m.includes('discomfort')
  ) {
    return "It feels like a heavy pressure right in the middle of my chest… maybe like a 7 out of 10. It started when I was walking up the stairs at home, and it hasn’t really gone away. I’m honestly getting a little worried because I’ve never felt this before."
  }

  if (
    m.includes('tell me more') ||
    m.includes("what you're feeling") ||
    m.includes('more about what') ||
    m.includes('what brings you') ||
    m.includes('chief complaint') ||
    m.includes("what's wrong") ||
    m.includes('describe') ||
    (m.includes('symptom') && !m.includes('other symptom')) ||
    (m.includes('feel') && (m.includes('you') || m.includes('overall')))
  ) {
    return "I’m having this heavy pressure in the middle of my chest, and it’s been going on since I was walking upstairs. I also feel a little short of breath and sweaty, and my left arm feels kind of off. I’m trying to stay calm, but I’m pretty scared this isn’t nothing."
  }

  if (
    m.includes('severity') ||
    m.includes('scale') ||
    m.includes('1-10') ||
    m.includes('1 to 10') ||
    m.includes('how bad') ||
    m.includes('rate the pain')
  ) {
    return "I’d say about a 7 out of 10… maybe higher when I try to move around. It’s not the sharp stabbing kind, it’s more like someone’s standing on my chest. I’ve had aches from work before, but this feels different."
  }

  if (
    m.includes('medical condition') ||
    m.includes('medical conditions') ||
    (m.includes('past') && m.includes('history')) ||
    (m.includes('health') && m.includes('problem')) ||
    (m.includes('history') && !m.includes('family'))
  ) {
    return "I do have high blood pressure, and my doctor says my cholesterol has been high too. I’ve been on medication for the BP for a few years, though I’ll admit I don’t always take it like I should. Other than that, nothing major surgeries or anything like that."
  }

  if (
    m.includes('medication') ||
    m.includes('medicine') ||
    m.includes('prescription') ||
    /\bmeds\b/.test(m) ||
    m.includes('drug') ||
    m.includes('take anything')
  ) {
    return "I take Lisinopril for my blood pressure most days, and I’m supposed to be on something for cholesterol too. Sometimes I take aspirin if I get headaches, but that’s not every day. Nothing else regular besides that."
  }

  if (m.includes('smok') || m.includes('tobacco')) {
    return "I used to smoke, but I quit about 5 years ago. Before that, I probably smoked for around 15 years, if I’m honest. I haven’t touched it since, but I know that history still worries me when something like this happens."
  }

  if (m.includes('alcohol') || (m.includes('drink') && !m.includes('water'))) {
    return "I drink occasionally, mostly on weekends. Maybe a couple beers, nothing excessive. I wouldn’t say I drink heavily, especially not compared to some guys on the crew."
  }

  if (m.includes('family') || m.includes('parents') || m.includes('dad') || m.includes('mom')) {
    return "Yeah, my dad had a heart attack in his early 60s. That’s honestly part of why I got so concerned when this started. It just felt a little too familiar, and I didn’t want to brush it off."
  }

  if (m.includes('stress')) {
    return "Work has been pretty stressful lately, long hours and all that. But this feels different from stress, it’s more physical, like something’s wrong in my chest. That’s why I didn’t just ignore it and try to sleep it off."
  }

  if (m.includes('fever') || m.includes('chill') || (m.includes('cold') && m.includes('feel'))) {
    return "No, I haven’t had any fever or cold symptoms. I’ve actually been feeling fine up until this happened, other than the usual work tiredness. Nothing like a flu or anything."
  }

  if (m.includes('anything else') || m.includes('other symptom')) {
    return "I’ve been more tired than usual this past week, but I figured it was just the job. Now I’m wondering if that was related, because this chest thing feels totally new. I haven’t had anything else weird besides that."
  }

  if (m.includes('allerg')) {
    return "I’m allergic to penicillin — it gives me a rash, so I try to stay away from that. I don’t have a lot of other drug allergies that I know of. I usually tell them that anytime someone prescribes something."
  }

  if (
    /\b(hello|hi|hey)\b/.test(m) ||
    m.includes('how are you') ||
    m.includes('good morning')
  ) {
    return "Hi… thanks for seeing me. I’m pretty worried, not gonna lie — something feels really off in my chest. I’m hoping you can help me figure out what’s going on."
  }

  return REPLY_CLARIFY
}

function headacheKeywords(input: string): string {
  const m = input

  if (m.includes('neck') || m.includes('stiff')) {
    return "Yeah, my neck does feel stiff, especially if I try to look down. It’s not like a normal crick from sleeping wrong… it feels tighter than that. That’s part of what’s freaking me out, because it came on with the headache."
  }

  if (
    m.includes('light') ||
    m.includes('vision') ||
    m.includes('photophobia') ||
    m.includes('bright')
  ) {
    return "Bright lights make it worse — I’ve been kind of squinting and keeping the room darker. I don’t usually get that with normal headaches. It’s like my eyes just don’t want to deal with any extra stimulation right now."
  }

  if (m.includes('nausea') || m.includes('throw up') || m.includes('vomit') || (m.includes('sick') && !m.includes('history'))) {
    return "I feel nauseous, yeah… I haven’t thrown up yet, but my stomach is churning. It started around the same time as the headache, and I don’t usually get that with headaches. Something feels really wrong."
  }

  if (
    /\bwhere\b/.test(m) ||
    m.includes('location') ||
    m.includes('one spot') ||
    m.includes('where is')
  ) {
    return "It’s mostly at the back of my head, kind of wrapping around. It doesn’t feel like it’s only on one tiny dot — more like a band of pressure. I keep pressing on my scalp trying to find relief, but it doesn’t help much."
  }

  if (
    /\bwhen\b/.test(m) ||
    m.includes('start') ||
    m.includes('began') ||
    m.includes('onset') ||
    m.includes('how long') ||
    m.includes('sudden')
  ) {
    return "It started really suddenly, maybe about an hour ago… I was just sitting and resting, not doing anything dramatic. It went from zero to horrible almost immediately, which is not like anything I’ve had before."
  }

  if (m.includes('worse') || m.includes('better') || m.includes('relief') || m.includes('what makes')) {
    return "Nothing really makes it better — lying still helps a tiny bit, but it’s still awful. Moving, talking loud, even turning my head… all of that makes it spike. I’m scared to move too much because it feels so intense."
  }

  if (
    m.includes('worst') ||
    m.includes('thunder') ||
    m.includes('headache') ||
    m.includes('head') ||
    m.includes('pain')
  ) {
    return "It’s the worst headache of my life — I mean, I’ve had bad headaches before, but nothing like this. It hit me like a wave, full force, and it’s been relentless since. I’m honestly scared because I’ve never felt anything close to this."
  }

  if (
    m.includes('tell me more') ||
    m.includes('describe') ||
    m.includes("what's wrong") ||
    m.includes('symptom') ||
    (m.includes('feel') && m.includes('you'))
  ) {
    return "I was fine, and then out of nowhere I got this sudden, crushing headache. It’s mostly in the back of my head, and my neck feels stiff. I feel nauseous and light bothers me, and I’m really worried because this isn’t normal for me at all."
  }

  if (
    m.includes('severity') ||
    m.includes('scale') ||
    m.includes('1-10') ||
    m.includes('how bad')
  ) {
    return "If I had to rate it, it’s like a 9 or 10… I don’t usually talk in numbers, but this is as bad as pain gets for me. It’s hard to think straight through it, honestly. I wouldn’t be here if I thought it was just a regular headache."
  }

  if (
    m.includes('migraine') ||
    m.includes('history') ||
    (m.includes('before') && m.includes('headache'))
  ) {
    return "I don’t really have a migraine history — I get the occasional stress headache, but nothing like this. No aura stuff, no long episodes like some people describe. This feels totally different from anything I’ve had before."
  }

  if (
    m.includes('medication') ||
    m.includes('medicine') ||
    /\bmeds\b/.test(m) ||
    m.includes('take anything')
  ) {
    return "I’m not on any regular prescriptions — I’ll take ibuprofen sometimes for normal headaches. I haven’t taken much today because I was scared to mask something important. I don’t use a lot of medicines day to day."
  }

  if (m.includes('family') && (m.includes('stroke') || m.includes('aneur') || m.includes('brain'))) {
    return "Nothing like a brain aneurysm that I know of in my close family, but I get anxious I don’t know the whole story. My parents are healthy as far as I know. I’m more worried because of how this headache started, not because of one specific family story."
  }

  if (m.includes('stress')) {
    return "I mean, life is stressful, sure, but I was literally resting when this started. It doesn’t feel like tension in my shoulders — it feels deeper, like inside my head. That’s why I didn’t just assume it would pass with water and rest."
  }

  if (m.includes('fever') || m.includes('infection')) {
    return "I don’t think I have a fever — I haven’t felt hot and cold waves like with the flu. I feel sick from the headache and nausea, but it’s not the usual sick-body aches thing. I could be wrong, but fever wasn’t my first thought."
  }

  if (m.includes('allerg')) {
    return "I don’t have any serious drug allergies that I know of. I’ve taken ibuprofen fine in the past. If you’re asking because of meds, I’m not allergic to anything major that I’m aware of."
  }

  if (/\b(hello|hi|hey)\b/.test(m) || m.includes('how are you')) {
    return "Hi… thank you for seeing me. I’m really scared — I’ve never had a headache come on like this. I need help because I can barely think through the pain."
  }

  return REPLY_CLARIFY
}

function acuteSobKeywords(input: string): string {
  const m = input

  if (
    m.includes('flight') ||
    m.includes('travel') ||
    m.includes('fly') ||
    m.includes('plane') ||
    m.includes('trip') ||
    m.includes('immobil') ||
    m.includes('sit') && m.includes('long')
  ) {
    return "Yeah… I was on a long flight not too long ago, sitting for hours. I travel sometimes for work, and I don’t move around as much as I should on the plane. I didn’t think much of it until this breathing thing hit me."
  }

  if (
    m.includes('leg') ||
    m.includes('calf') ||
    m.includes('swell') ||
    m.includes('dvt') ||
    m.includes('clot')
  ) {
    return "Now that you mention it, one of my calves has felt a little tight and maybe a bit swollen lately. I figured I’d been on my feet too much. I didn’t connect it to my breathing until you asked, but it’s been bothering me."
  }

  if (
    m.includes('chest') &&
    (m.includes('pain') || m.includes('hurt') || m.includes('sharp') || m.includes('pleur'))
  ) {
    return "Yeah, there’s a sharp-ish discomfort in my chest when I try to breathe in deep. It’s not the same as the pressure people describe with a heart thing — it’s more like it stings when I inhale. That’s part of why I’m so uncomfortable right now."
  }

  if (
    m.includes('cough') ||
    m.includes('blood') ||
    m.includes('hemoptysis')
  ) {
    return "I haven’t been coughing up blood or anything like that. My cough isn’t really the main problem — it’s more that I can’t get enough air in. If I cough, it’s because I’m struggling to breathe, not because my lungs feel junky."
  }

  if (
    m.includes('shortness') ||
    m.includes('breath') ||
    m.includes('breathing') ||
    m.includes('winded') ||
    m.includes('air') ||
    m.includes('oxygen') ||
    m.includes('sob')
  ) {
    return "I just can’t catch my breath — it came on pretty suddenly, and I feel like I’m not getting enough air no matter how hard I try. Even talking in long sentences makes me winded. I’m a little panicked, honestly, because this isn’t normal for me."
  }

  if (
    /\bwhen\b/.test(m) ||
    m.includes('start') ||
    m.includes('onset') ||
    m.includes('how long')
  ) {
    return "I think it started within the last hour, maybe a little more… it wasn’t gradual like a cold coming on. It felt pretty sudden, like someone flipped a switch, and it hasn’t calmed down since. That’s why I came straight in."
  }

  if (m.includes('worse') || m.includes('better') || m.includes('relief') || m.includes('what makes')) {
    return "Sitting still helps a tiny bit, but if I move or try to walk, it gets worse fast. Nothing really fixes it — I’m still short of breath even at rest, just not as bad as when I exert myself. I’m not comfortable either way, though."
  }

  if (
    m.includes('heart') ||
    m.includes('palpit') ||
    m.includes('racing')
  ) {
    return "My heart feels like it’s pounding, like it’s racing faster than usual. I notice it in my chest, and it makes me more anxious, which probably doesn’t help. I don’t get chest pressure exactly like TV heart attacks, it’s more the breathing and racing heart together."
  }

  if (mentionsSweating(m)) {
    return "Yeah, I’m sweating more than I should for just sitting here. I feel clammy, kind of cold-sweat. That’s adding to my worry because it feels like my body knows something’s wrong."
  }

  if (
    m.includes('tell me more') ||
    m.includes('describe') ||
    m.includes("what's wrong") ||
    m.includes('symptom') ||
    (m.includes('feel') && m.includes('you'))
  ) {
    return "I suddenly got really short of breath, like I can’t get a full breath in. I’ve also noticed my heart racing, and one leg has felt a little off lately after a long trip. I’m scared because this came on fast and I’m not getting better."
  }

  if (
    m.includes('medical') ||
    (m.includes('history') && !m.includes('family')) ||
    m.includes('conditions')
  ) {
    return "I have high blood pressure — I’ve known that for years. I don’t have diagnosed lung disease that I know of, and I haven’t had blood clots before. I’m on meds for the BP, though I’m not perfect about follow-ups."
  }

  if (
    m.includes('medication') ||
    m.includes('medicine') ||
    /\bmeds\b/.test(m) ||
    m.includes('take anything')
  ) {
    return "I take blood pressure medication daily — I think it’s an ACE inhibitor, but I’d have to check the bottle spelling. I don’t take blood thinners or anything like that regularly. No prescriptions for breathing problems."
  }

  if (m.includes('smok') || m.includes('tobacco')) {
    return "I quit years ago — I used to smoke, but I stopped a long time back. I know that history still matters, but I haven’t touched cigarettes in a long time. I’m more worried about the sudden breathing thing right now."
  }

  if (m.includes('family')) {
    return "Nothing dramatic like young people having clots that I know of, but I don’t know every cousin’s history. My main worry is how fast this came on and how winded I am. If you’re asking because of risk, I’m not sure about clotting disorders in the family."
  }

  if (m.includes('fever') || m.includes('infection') || m.includes('pneumonia')) {
    return "I haven’t had a big fever story today — I’m not coughing up green stuff or feeling classic sick like pneumonia. This feels more like I can’t move air, not like a cold settling in my chest. I could be wrong, but infection wasn’t my first thought."
  }

  if (/\b(hello|hi|hey)\b/.test(m) || m.includes('how are you')) {
    return "Hi… thanks for seeing me. I’m really struggling to breathe and I’m scared. I need help figuring out why this hit so fast."
  }

  return REPLY_CLARIFY
}

function rlqAbdominalKeywords(input: string): string {
  const m = input

  if (
    m.includes('migrat') ||
    m.includes('belly button') ||
    m.includes('umbilical') ||
    m.includes('periumbilical') ||
    (m.includes('move') && m.includes('pain'))
  ) {
    return "Yeah, it kind of started more around my belly button area, like a vague ache, and then it shifted down to the right lower side. That migration is what made me think this isn’t just a stomach bug. I’ve never had pain travel like that before."
  }

  if (
    m.includes('appetite') ||
    m.includes('eat') ||
    m.includes('hungry') ||
    m.includes('food')
  ) {
    return "I really don’t feel like eating — even the thought of food makes me feel worse. I skipped breakfast and I’m not interested in lunch, which isn’t like me. That started around the same time the pain got more focused down on the right."
  }

  if (m.includes('fever') || m.includes('temp') || m.includes('hot') || m.includes('chill')) {
    return "I think I had a little fever at home — I felt warm and kind of chilled on and off. I didn’t take it perfectly with a thermometer, but I felt hotter than normal. That’s part of why I’m worried it’s not just a simple stomach thing."
  }

  if (m.includes('nausea') || m.includes('vomit') || m.includes('throw up')) {
    return "I feel nauseous, yeah… I haven’t thrown up yet, but I keep feeling like I might. The pain makes it hard to get comfortable, and moving makes the nausea worse. It’s all kind of blending together."
  }

  if (
    /\bwhere\b/.test(m) ||
    m.includes('location') ||
    m.includes('rlq') ||
    m.includes('right lower') ||
    m.includes('lower right')
  ) {
    return "Right now the worst spot is down here on my right lower side. It’s tender if I press or move, and it feels sharper than earlier. It’s not all over — it’s pretty clearly focused there now."
  }

  if (
    /\bwhen\b/.test(m) ||
    m.includes('start') ||
    m.includes('onset') ||
    m.includes('how long')
  ) {
    return "It started earlier today… I think late morning, maybe around then, and it’s gotten worse as the day went on. It wasn’t like one second I was fine and the next I wasn’t — but it definitely ramped up. That’s why I’m here now."
  }

  if (m.includes('worse') || m.includes('better') || m.includes('relief') || m.includes('what makes')) {
    return "Walking and moving around makes it worse — even getting up hurts. Lying still helps a little, but it doesn’t make it go away. Nothing really takes it off completely, which is why I’m pretty miserable."
  }

  if (
    m.includes('bowel') ||
    m.includes('stool') ||
    m.includes('diarrhea') ||
    m.includes('constip') ||
    m.includes('gas')
  ) {
    return "I haven’t had a bunch of diarrhea like a stomach bug… nothing explosive like that. My bowel habits have been a little off because I don’t feel like eating, but it’s not the main story. The pain is what’s driving this."
  }

  if (
    m.includes('pain') ||
    m.includes('hurt') ||
    m.includes('abdomen') ||
    m.includes('stomach') ||
    m.includes('belly')
  ) {
    return "My stomach hurts really badly — it started more central and now it’s worst in my lower right side. It’s a sharp, constant ache that gets worse when I move. I’m a little embarrassed how much it’s freaking me out, but the pain is real."
  }

  if (
    m.includes('tell me more') ||
    m.includes('describe') ||
    m.includes('symptom') ||
    (m.includes('feel') && m.includes('you'))
  ) {
    return "I’ve got bad abdominal pain that moved from near my belly button down to my right lower side. I feel nauseous and I think I had a fever, and I don’t want to eat. Walking makes it worse, and I’m scared it’s something serious."
  }

  if (
    m.includes('severity') ||
    m.includes('scale') ||
    m.includes('1-10') ||
    m.includes('how bad')
  ) {
    return "It’s pretty high — maybe an 8 out of 10 when I move, and still bad at rest. I’ve had stomachaches before, but not like this focused, sharp pain. It’s hard to stand up straight without grimacing."
  }

  if (
    m.includes('sexual') ||
    m.includes('testicle') ||
    m.includes('urin') ||
    m.includes('uti')
  ) {
    return "Nothing obvious like burning when I pee that I’ve noticed… I’m not thinking this is a UTI thing, it’s more this localized belly pain. I haven’t had new sexual symptoms I’m aware of. The pain is what brought me in."
  }

  if (
    m.includes('medical') ||
    (m.includes('history') && !m.includes('family'))
  ) {
    return "I’m pretty healthy otherwise — no big surgeries, no chronic diseases I’m managing day to day. I’m a student, so I’m not on a long medication list or anything. Nothing that explains this kind of pain, at least not that I know of."
  }

  if (
    m.includes('medication') ||
    m.includes('medicine') ||
    /\bmeds\b/.test(m)
  ) {
    return "I don’t take regular prescriptions — maybe ibuprofen occasionally for normal stuff. I haven’t taken much today because I was nauseous. Nothing fancy or daily besides that."
  }

  if (m.includes('family') && m.includes('append')) {
    return "I don’t think anyone in my close family had an appendix thing like this, but I’m not 100% sure about every relative. Nobody’s told me a dramatic story about emergency surgery for this. I’m mostly going off how bad I feel right now."
  }

  if (/\b(hello|hi|hey)\b/.test(m) || m.includes('how are you')) {
    return "Hey… thanks for seeing me. I’m in a lot of pain and I’m kind of scared it’s not just a stomach bug. I’m hoping you can help."
  }

  return REPLY_CLARIFY
}

function feverConfusionKeywords(input: string): string {
  const m = input

  if (
    m.includes('family') &&
    (m.includes('history') ||
      m.includes('mother') ||
      m.includes('father') ||
      m.includes('parent') ||
      m.includes('run in') ||
      m.includes('genetic'))
  ) {
    return "I’m sorry, I’m fuzzy on details right now… I don’t think there’s something dramatic that runs in my family like this, but I wouldn’t trust my memory today. My kids might know more if you need specifics — I’m not trying to hide anything, I’m just confused."
  }

  if (
    m.includes('brought') ||
    m.includes('who brought') ||
    m.includes('notice') ||
    m.includes('noticed') ||
    m.includes('husband') ||
    m.includes('wife') ||
    m.includes('daughter') ||
    m.includes('son') ||
    m.includes('caregiver')
  ) {
    return "My family noticed I wasn’t acting like myself — I was confused and not answering questions normally. They’re the ones who insisted I come in, because I probably wouldn’t have sorted it out on my own. I’m foggy on some of the timeline, honestly."
  }

  if (
    m.includes('confus') ||
    m.includes('orient') ||
    m.includes('remember') ||
    m.includes('think straight') ||
    m.includes('altered') ||
    m.includes('mental')
  ) {
    return "I feel foggy, like I can’t think clearly or keep track of what’s happening. I know something’s wrong, but it’s hard to explain details the way I normally would. It came on with the fever and just made everything feel scary and unreal."
  }

  if (m.includes('fever') || m.includes('hot') || m.includes('chill') || m.includes('temperature')) {
    return "I’ve been really hot and then shivery — classic fever feeling, like my body can’t decide. I don’t know the exact number, but I feel sick in that whole-body way. That’s been going along with feeling out of it."
  }

  if (
    m.includes('urin') ||
    m.includes('burning') ||
    m.includes('uti') ||
    m.includes('kidney')
  ) {
    return "I’ve had some urinary symptoms before with infections — burning, going more often, that kind of thing. I’m not sure I can give you perfect details right now because I’m confused, but it’s worth asking because I do get UTIs sometimes. I’m not trying to hide it, I’m just fuzzy."
  }

  if (
    m.includes('diabet') ||
    m.includes('sugar') ||
    m.includes('glucose') ||
    m.includes('insulin')
  ) {
    return "I have diabetes — I’ve been on medicines for it for years, though I’m not always perfect with diet. High sugars make me feel crummy sometimes, but this feels different, like infection and confusion on top of everything. I’m worried because I’m usually more with-it than this."
  }

  if (
    m.includes('breath') ||
    m.includes('shortness') ||
    m.includes('oxygen')
  ) {
    return "I feel a little short of breath, like I can’t take a comfortable deep breath. It’s not my only problem, but it’s there along with the fever and confusion. I’m not gasping like asthma, more like I’m weak and breathing fast."
  }

  if (
    /\bwhen\b/.test(m) ||
    m.includes('start') ||
    m.includes('today') ||
    m.includes('onset')
  ) {
    return "I think this really showed up today… my family says I was more off this morning, and it got worse from there. I’m not great on exact times because I’m confused, but it’s been hours, not days, in terms of feeling this bad. That’s the best I can tell you."
  }

  if (
    m.includes('blood pressure') ||
    m.includes('hypotens') ||
    m.includes('dizzy') ||
    m.includes('lightheaded')
  ) {
    return "I feel dizzy and kind of weak, like I might faint if I stand up too fast. I don’t know my blood pressure numbers right now, but I feel low and crummy. That’s part of why I’m scared — I feel unstable."
  }

  if (
    m.includes('tell me more') ||
    m.includes('describe') ||
    m.includes('symptom') ||
    (m.includes('feel') && m.includes('you'))
  ) {
    return "I’ve had a high fever and I’m confused — I’m not thinking clearly like usual. I have diabetes, and my family says I’ve been acting strange since this morning. I feel weak and short of breath, and I’m scared because this isn’t like a normal sick day for me."
  }

  if (
    m.includes('medication') ||
    m.includes('medicine') ||
    /\bmeds\b/.test(m)
  ) {
    return "I take medicines for diabetes, but I’m fuzzy on names and doses right now — I’m sorry, I’m usually sharper about that. I’m not on a ton of other prescriptions that I remember. You might need my family or my pharmacy list if you need exacts."
  }

  if (m.includes('infection') || m.includes('sepsis')) {
    return "I don’t know the medical words for what this is — I just feel infected, toxic, not right. I’m not asking you to name it, I’m telling you it feels bigger than a simple cold. I’m scared because I feel so out of it."
  }

  if (m.includes('headache') || m.includes('neck')) {
    return "My head feels off, but the main thing isn’t a neat headache story like a migraine… it’s the fever and confusion. My neck isn’t the headline symptom I’d lead with, but I feel sick all over. I’m not trying to be difficult — I’m just muddled."
  }

  if (/\b(hello|hi|hey)\b/.test(m) || m.includes('how are you')) {
    return "Hello… I don’t feel like myself. I’m hot, confused, and scared, and I need help."
  }

  return REPLY_CLARIFY
}

const scenarioKeywordHandlers: Record<string, (input: string) => string> = {
  'chest-pain-er': chestPainKeywords,
  'sudden-headache-er': headacheKeywords,
  'acute-sob-er': acuteSobKeywords,
  'rlq-abdominal-pain': rlqAbdominalKeywords,
  'fever-confusion': feverConfusionKeywords,
}

/**
 * Keyword-based mock patient reply for demo / offline chat.
 * Uses the last doctor (or user) message; each reply is 2–3 sentences.
 */
export function getMockPatientResponse(
  scenarioId: string,
  messages: Array<{ role: string; content: string }>
): string {
  const lastDoctorMessage = getLastDoctorMessage(messages)
  if (!lastDoctorMessage.trim()) {
    return REPLY_EMPTY
  }

  const handler = scenarioKeywordHandlers[scenarioId]
  if (!handler) {
    console.error('Invalid scenarioId:', scenarioId)
    return REPLY_CLARIFY
  }

  const input = lastDoctorMessage.toLowerCase()
  return handler(input)
}

export function getMockAssessment() {
  return {
    overallRating: 'Good',
    summary:
      'Sample case. Score 71/100 (good). About 60% of suggested history topics covered. Teaching diagnosis: see scenario.',
    strengths: [
      'Thorough history-taking approach',
      'Appropriate physical exam sections reviewed',
      'Considered multiple diagnostic possibilities',
      'Good test prioritization in parts of the workup',
    ],
    areasForImprovement: [
      'Explore red flag symptoms in a more systematic way',
      'Tighten test selection to improve efficiency',
      'Add more specific reasoning notes on the differential',
    ],
    diagnosisFeedback: 'Teaching diagnosis noted in case overview.',
    missedKeyHistoryPoints: ['Family history of cardiac disease'],
    testSelectionFeedback: 'Include critical confirmatory tests; avoid low-yield shotgun panels.',
    sectionRatings: {
      history: 'Good',
      exam: 'Good',
      tests: 'Good',
      diagnosis: 'Good',
      communication: 'Good',
    },
    totalScore: 71,
    totalScorePercentage: 71,
    maxScore: 100,
    rubric100: {
      historyTaking: 18,
      clinicalReasoning: 17,
      diagnosticAccuracy: 19,
      efficiencyAndQuestionSelection: 17,
      total: 71,
    },
    scoreBreakdown: {
      history: 8,
      exam: 7,
      tests: 10,
      diagnosis: 5,
      communication: 2,
    },
    debriefStructured: {
      summary: 'Sample case. Score 71/100 (good).',
      strengths: [
        'Thorough history-taking approach',
        'Appropriate physical exam sections reviewed',
        'Considered multiple diagnostic possibilities',
        'Good test prioritization in parts of the workup',
      ],
      missedOpportunities: [
        'Explore red flag symptoms in a more systematic way',
        'Tighten test selection to improve efficiency',
        'Add more specific reasoning notes on the differential',
      ],
      correctApproach: [
        'Use the history and exam to establish pretest probability before testing.',
        'Anchor the differential in dangerous diagnoses you can rule in or out with targeted data.',
        'Confirm the working diagnosis with findings that fit the clinical picture.',
      ],
      improvementTip:
        'Next time, focus on asking about family history of early cardiac disease earlier to narrow the diagnosis faster.',
      diagnosticReasoning: [],
      nextStepAdvice: [],
      clinicalPearls: [],
      vocabToReview: [],
    },
  }
}

export function getMockTermExplanation(selectedText: string, contextText?: string) {
  const term = selectedText.trim().toLowerCase()

  const commonTerms: Record<string, { simple: string; clinical: string; why: string; example: string }> = {
    'chest pain': {
      simple: 'Pain or discomfort felt in the chest area.',
      clinical:
        'Thoracic pain or discomfort; can be cardiac, respiratory, musculoskeletal, or gastrointestinal in origin.',
      why: 'Chest pain can indicate serious conditions like heart attack or less serious issues like muscle strain.',
      example: 'The patient reported chest pain that started 3 hours ago.',
    },
    'shortness of breath': {
      simple: "Feeling like you can't get enough air or are breathing hard.",
      clinical: 'Dyspnea; a subjective sensation of difficult or uncomfortable breathing.',
      why: 'Can be a sign of serious heart or lung conditions.',
      example: 'The patient complained of shortness of breath when walking up stairs.',
    },
    tachycardia: {
      simple: 'A faster than normal heart rate.',
      clinical: 'Heart rate above the normal range (typically >100 bpm in adults at rest).',
      why: 'Can indicate stress, fever, dehydration, or heart problems.',
      example: "The patient's heart rate was tachycardic at 110 bpm.",
    },
    hypertension: {
      simple: 'High blood pressure.',
      clinical: 'Persistently elevated systemic arterial blood pressure (typically >130/80 mmHg).',
      why: 'Hypertension increases risk of heart disease, stroke, and kidney problems.',
      example: 'The patient has a history of hypertension managed with medication.',
    },
    dyspnea: {
      simple: 'Shortness of breath or difficulty breathing.',
      clinical: 'Subjective sensation of difficult or labored breathing.',
      why: 'A common symptom of many cardiac and respiratory conditions.',
      example: 'The patient presented with acute dyspnea.',
    },
  }

  if (commonTerms[term]) {
    const def = commonTerms[term]
    return {
      term: selectedText.trim(),
      definitionSimple: def.simple,
      definitionClinical: def.clinical,
      whyItMatters: def.why,
      whyItMattersHere: contextText
        ? `In this case, ${term} is an important finding that helps the doctor understand the patient's condition.`
        : def.why,
      example: def.example,
      exampleFromContext: contextText
        ? `${selectedText.trim()} appears in the patient's presentation: ${contextText.substring(0, 80)}...`
        : def.example,
      synonymsOrRelated: [],
      source: 'local' as const,
    }
  }

  return {
    term: selectedText.trim(),
    definitionSimple: `"${selectedText.trim()}" is a medical term. In this context, it refers to a clinical finding or condition.`,
    definitionClinical: `"${selectedText.trim()}" is a medical term used in clinical practice. Specific definitions may vary based on context.`,
    whyItMatters:
      'Understanding medical terminology is important for effective communication in healthcare.',
    whyItMattersHere: contextText
      ? `In this case, "${selectedText.trim()}" is relevant to understanding the patient's presentation.`
      : 'Understanding medical terminology is important for effective communication in healthcare.',
    example: `Example: The term "${selectedText.trim()}" is used to describe a clinical finding.`,
    exampleFromContext: contextText
      ? `In this case: "${selectedText.trim()}" - ${contextText.substring(0, 100)}...`
      : `Example: The term "${selectedText.trim()}" is used in medical contexts.`,
    synonymsOrRelated: [],
    source: 'ai' as const,
  }
}
