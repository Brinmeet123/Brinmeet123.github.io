"use strict";(()=>{var e={};e.id=242,e.ids=[242],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8752:(e,i,n)=>{n.r(i),n.d(i,{originalPathname:()=>v,patchFetch:()=>P,requestAsyncStorage:()=>f,routeModule:()=>h,serverHooks:()=>C,staticGenerationAsyncStorage:()=>b});var t={};n.r(t),n.d(t,{POST:()=>g});var a=n(9303),o=n(8716),r=n(3131),s=n(7070),c=n(7054);let d=[{id:"ecg",name:"ECG (Electrocardiogram)",category:"Cardiac",kind:"Bedside",description:"Records the electrical activity of the heart",typicalUses:["Chest pain","Arrhythmia","ACS"],common:!0},{id:"troponin",name:"Troponin I",category:"Cardiac",kind:"Lab",description:"Cardiac injury marker, elevated in myocardial infarction",typicalUses:["ACS","Chest pain"],common:!0},{id:"bnp",name:"BNP (Brain Natriuretic Peptide)",category:"Cardiac",kind:"Lab",description:"Marker for heart failure",typicalUses:["Heart failure","Dyspnea"],common:!0},{id:"echo",name:"Echocardiogram",category:"Cardiac",kind:"Imaging",description:"Ultrasound of the heart",typicalUses:["Heart failure","Valvular disease"],common:!0},{id:"stress_test",name:"Stress Test",category:"Cardiac",kind:"Procedure",description:"Exercise or pharmacologic stress testing",typicalUses:["Chest pain","Coronary disease"],common:!1},{id:"cxr",name:"Chest X-Ray",category:"Pulmonary",kind:"Imaging",description:"Evaluates lungs, heart size, and chest structures",typicalUses:["Chest pain","Dyspnea","Cough"],common:!0},{id:"ct_chest",name:"CT Chest",category:"Pulmonary",kind:"Imaging",description:"Detailed imaging of chest structures",typicalUses:["PE","Pneumonia","Mass"],common:!0},{id:"abg",name:"Arterial Blood Gas",category:"Pulmonary",kind:"Lab",description:"Measures blood oxygen, CO2, and pH",typicalUses:["Respiratory failure","Acid-base disorders"],common:!0},{id:"pft",name:"Pulmonary Function Test",category:"Pulmonary",kind:"Procedure",description:"Measures lung function",typicalUses:["COPD","Asthma"],common:!1},{id:"ct_head",name:"CT Head",category:"Neurology",kind:"Imaging",description:"Brain imaging for acute pathology",typicalUses:["Headache","Stroke","Trauma"],common:!0},{id:"mri_brain",name:"MRI Brain",category:"Neurology",kind:"Imaging",description:"Detailed brain imaging",typicalUses:["Stroke","Tumor","MS"],common:!1},{id:"eeg",name:"EEG (Electroencephalogram)",category:"Neurology",kind:"Procedure",description:"Brain electrical activity",typicalUses:["Seizure","Altered mental status"],common:!1},{id:"lumbar_puncture",name:"Lumbar Puncture",category:"Neurology",kind:"Procedure",description:"CSF analysis",typicalUses:["Meningitis","SAH"],common:!1},{id:"ct_abdomen",name:"CT Abdomen/Pelvis",category:"GI",kind:"Imaging",description:"Abdominal imaging",typicalUses:["Abdominal pain","Appendicitis"],common:!0},{id:"lipase",name:"Lipase",category:"GI",kind:"Lab",description:"Pancreatic enzyme, elevated in pancreatitis",typicalUses:["Abdominal pain","Pancreatitis"],common:!0},{id:"lft",name:"Liver Function Tests",category:"GI",kind:"Lab",description:"ALT, AST, bilirubin, etc.",typicalUses:["Hepatitis","Jaundice"],common:!0},{id:"upper_endoscopy",name:"Upper Endoscopy",category:"GI",kind:"Procedure",description:"Visualization of upper GI tract",typicalUses:["GI bleed","Dysphagia"],common:!1},{id:"creatinine",name:"Creatinine",category:"Renal",kind:"Lab",description:"Kidney function marker",typicalUses:["AKI","CKD"],common:!0},{id:"bun",name:"BUN (Blood Urea Nitrogen)",category:"Renal",kind:"Lab",description:"Kidney function marker",typicalUses:["AKI","CKD"],common:!0},{id:"ua",name:"Urinalysis",category:"Renal",kind:"Lab",description:"Urine analysis",typicalUses:["UTI","AKI","Nephritis"],common:!0},{id:"glucose",name:"Glucose",category:"Endocrine",kind:"Lab",description:"Blood sugar level",typicalUses:["Diabetes","Hypoglycemia"],common:!0},{id:"hba1c",name:"HbA1c",category:"Endocrine",kind:"Lab",description:"Long-term glucose control",typicalUses:["Diabetes"],common:!1},{id:"tsh",name:"TSH",category:"Endocrine",kind:"Lab",description:"Thyroid function",typicalUses:["Hypothyroidism","Hyperthyroidism"],common:!1},{id:"cbc",name:"CBC (Complete Blood Count)",category:"Hematology",kind:"Lab",description:"Red cells, white cells, platelets",typicalUses:["Infection","Anemia","Bleeding"],common:!0},{id:"blood_culture",name:"Blood Culture",category:"Infectious",kind:"Lab",description:"Bacterial infection detection",typicalUses:["Sepsis","Fever"],common:!0},{id:"urine_culture",name:"Urine Culture",category:"Infectious",kind:"Lab",description:"Bacterial UTI detection",typicalUses:["UTI"],common:!0},{id:"covid",name:"COVID-19 PCR",category:"Infectious",kind:"Lab",description:"SARS-CoV-2 detection",typicalUses:["Respiratory infection"],common:!0},{id:"pt_inr",name:"PT/INR",category:"Hematology",kind:"Lab",description:"Coagulation studies",typicalUses:["Bleeding","Anticoagulation"],common:!0},{id:"d_dimer",name:"D-Dimer",category:"Hematology",kind:"Lab",description:"Clotting marker, elevated in DVT/PE",typicalUses:["PE","DVT"],common:!0},{id:"ferritin",name:"Ferritin",category:"Hematology",kind:"Lab",description:"Iron storage",typicalUses:["Anemia"],common:!1},{id:"xray_extremity",name:"X-Ray Extremity",category:"MSK",kind:"Imaging",description:"Bone imaging",typicalUses:["Fracture","Trauma"],common:!0},{id:"mri_spine",name:"MRI Spine",category:"MSK",kind:"Imaging",description:"Spinal cord and vertebrae imaging",typicalUses:["Back pain","Cord compression"],common:!1},{id:"cmp",name:"CMP (Comprehensive Metabolic Panel)",category:"Other",kind:"Lab",description:"Electrolytes, kidney function, liver function",typicalUses:["General screening","Metabolic disorders"],common:!0},{id:"lipid",name:"Lipid Panel",category:"Other",kind:"Lab",description:"Cholesterol and triglycerides",typicalUses:["Cardiovascular risk"],common:!1},{id:"us_abdomen",name:"Ultrasound Abdomen",category:"Imaging",kind:"Imaging",description:"Abdominal ultrasound",typicalUses:["Gallstones","Aortic aneurysm"],common:!0}];function l(e,i){let n;let t=d.find(e=>e.id===i);if(!t)throw Error(`Test ${i} not found in catalog`);let a=e.testOverrides?.find(e=>e.testId===i);if(a)return{test:t,result:a.result,yield:a.yield};let o=e.testDefaultBehavior||{labDefault:"Within normal limits.",imagingDefault:"No acute abnormality.",bedsideDefault:"No significant abnormality.",procedureDefault:"Not indicated in this case."},r="low";switch(t.kind){case"Lab":n=o.labDefault;break;case"Imaging":n=o.imagingDefault;break;case"Bedside":n=o.bedsideDefault;break;case"Procedure":n=o.procedureDefault,r="inappropriate";break;default:n="Result not available."}return{test:t,result:n,yield:r}}let m=[{id:"stemi",name:"ST-elevation myocardial infarction (STEMI)",category:"Cardiac",brief:"Acute coronary occlusion causing myocardial injury.",typicalClues:["Exertional chest pressure","Radiation to arm/jaw","ECG ST elevation","Elevated troponin"],common:!0},{id:"nstemi",name:"Non-ST elevation myocardial infarction (NSTEMI)",category:"Cardiac",brief:"Myocardial infarction without ST elevation on ECG.",typicalClues:["Chest pain","Elevated troponin","No ST elevation"],common:!0},{id:"unstable_angina",name:"Unstable angina",category:"Cardiac",brief:"Chest pain from coronary artery disease, not meeting MI criteria.",typicalClues:["Chest pain","Normal troponin","ECG changes"],common:!0},{id:"aortic_dissection",name:"Aortic dissection",category:"Cardiac",brief:"Tear in the aortic wall, life-threatening emergency.",typicalClues:["Tearing chest pain","Hypertension","Pulse deficit","Widened mediastinum"],common:!1},{id:"pericarditis",name:"Pericarditis",category:"Cardiac",brief:"Inflammation of the pericardium.",typicalClues:["Sharp chest pain","Worse lying flat","Pericardial rub","Diffuse ST elevation"],common:!1},{id:"pe",name:"Pulmonary embolism (PE)",category:"Pulmonary",brief:"Blood clot blocking pulmonary artery.",typicalClues:["Dyspnea","Chest pain","Tachycardia","Elevated D-dimer"],common:!0},{id:"pneumonia",name:"Pneumonia",category:"Pulmonary",brief:"Lung infection causing inflammation.",typicalClues:["Fever","Cough","Chest X-ray infiltrate","Elevated WBC"],common:!0},{id:"pneumothorax",name:"Pneumothorax",category:"Pulmonary",brief:"Collapsed lung from air in pleural space.",typicalClues:["Sudden dyspnea","Chest pain","Decreased breath sounds","Hyperresonance"],common:!1},{id:"copd_exacerbation",name:"COPD exacerbation",category:"Pulmonary",brief:"Acute worsening of chronic obstructive pulmonary disease.",typicalClues:["Dyspnea","Wheezing","COPD history","Increased sputum"],common:!0},{id:"stroke",name:"Ischemic stroke",category:"Neurology",brief:"Brain tissue death from blocked blood supply.",typicalClues:["Focal neurologic deficit","Sudden onset","CT head negative early","Risk factors"],common:!0},{id:"tia",name:"Transient ischemic attack (TIA)",category:"Neurology",brief:"Temporary stroke symptoms that resolve.",typicalClues:["Focal deficit","Resolves <24h","No CT changes"],common:!0},{id:"migraine",name:"Migraine",category:"Neurology",brief:"Severe headache with associated symptoms.",typicalClues:["Unilateral headache","Photophobia","Nausea","Aura"],common:!0},{id:"meningitis",name:"Meningitis",category:"Neurology",brief:"Infection of the meninges.",typicalClues:["Headache","Fever","Neck stiffness","Altered mental status"],common:!1},{id:"subarachnoid_hemorrhage",name:"Subarachnoid hemorrhage (SAH)",category:"Neurology",brief:"Bleeding into subarachnoid space.",typicalClues:["Thunderclap headache","Neck stiffness","CT head positive","Bloody CSF"],common:!1},{id:"gerd",name:"Gastroesophageal reflux disease (GERD)",category:"GI",brief:"Acid reflux causing burning chest discomfort.",typicalClues:["Burning pain","Post-meal","Worse lying down","Relief with antacids"],common:!0},{id:"pancreatitis",name:"Acute pancreatitis",category:"GI",brief:"Inflammation of the pancreas.",typicalClues:["Epigastric pain","Radiation to back","Elevated lipase","Nausea/vomiting"],common:!0},{id:"appendicitis",name:"Appendicitis",category:"GI",brief:"Inflammation of the appendix.",typicalClues:["RLQ pain","Fever","Elevated WBC","CT findings"],common:!0},{id:"cholecystitis",name:"Acute cholecystitis",category:"GI",brief:"Inflammation of the gallbladder.",typicalClues:["RUQ pain","Fever","Elevated WBC","Positive Murphy's sign"],common:!0},{id:"sepsis",name:"Sepsis",category:"Infectious",brief:"Life-threatening organ dysfunction from infection.",typicalClues:["Fever","Hypotension","Tachycardia","Elevated lactate"],common:!0},{id:"uti",name:"Urinary tract infection (UTI)",category:"Infectious",brief:"Bacterial infection of urinary system.",typicalClues:["Dysuria","Frequency","Positive urine culture","Pyuria"],common:!0},{id:"dka",name:"Diabetic ketoacidosis (DKA)",category:"Endocrine",brief:"Severe hyperglycemia with metabolic acidosis.",typicalClues:["Hyperglycemia","Ketones","Acidosis","Altered mental status"],common:!1},{id:"hypoglycemia",name:"Hypoglycemia",category:"Endocrine",brief:"Low blood sugar.",typicalClues:["Altered mental status","Sweating","Tremor","Low glucose"],common:!0},{id:"aki",name:"Acute kidney injury (AKI)",category:"Renal",brief:"Sudden decline in kidney function.",typicalClues:["Elevated creatinine","Oliguria","Volume depletion","Nephrotoxins"],common:!0},{id:"panic",name:"Panic attack",category:"Psych",brief:"Acute anxiety episode with physical symptoms.",typicalClues:["Palpitations","Fear","Tingling","Hyperventilation","No organic findings"],common:!0},{id:"anxiety",name:"Anxiety disorder",category:"Psych",brief:"Persistent excessive worry and anxiety.",typicalClues:["Worry","Restlessness","Fatigue","Difficulty concentrating"],common:!0},{id:"muscle_strain",name:"Muscle strain",category:"MSK",brief:"Injury to muscle or tendon.",typicalClues:["Pain with movement","Localized tenderness","No systemic symptoms"],common:!0},{id:"costochondritis",name:"Costochondritis",category:"Other",brief:"Inflammation of costochondral joints.",typicalClues:["Chest wall tenderness","Reproducible pain","No cardiac findings"],common:!0}],p=process.env.OLLAMA_URL||"http://localhost:11434",u=process.env.OLLAMA_MODEL||"llama3";async function y(e){let i=await fetch(`${p}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:u,messages:e,stream:!1})});if(!i.ok){let e=await i.text();throw Error(`Ollama API error: ${i.status} ${e}`)}let n=await i.json();return n.message?.content||n.response||"{}"}async function g(e){try{let{scenarioId:a,stability:o,redFlagsFound:r,chiefComplaint:d,chat:p,hpi:u,background:g,problemRep:h,viewedExamSections:f,differentials:b,orderedTests:C,reasoningUpdates:v,finalDiagnosis:P,patientExplanation:N,plan:S,differentialDetailed:$,finalDxId:k,missingMustNotMiss:I,selectedDifferentialIds:x,finalDiagnosisId:E}=await e.json(),T=c.M.find(e=>e.id===a);if(!T)return s.NextResponse.json({error:"Scenario not found"},{status:404});let A="Unknown";if(T.finalDxId){let e=m.find(e=>e.id===T.finalDxId);A=e?.name||T.finalDxId}else if(T.diagnosisOptions){let e=T.diagnosisOptions.find(e=>e.isCorrect);A=e?.name||"Unknown"}let D="None";if(k){let e=m.find(e=>e.id===k);D=e?.name||k}else if(T.diagnosisOptions){let e=P?T.diagnosisOptions.find(e=>e.id===P.diagnosisId):T.diagnosisOptions.find(e=>e.id===E);D=e?.name||"None"}let O=`You are an instructor in a fictional diagnostic reasoning simulator for students.
You will be given comprehensive workflow data from a 12-step diagnostic process:
- Safety check and triage
- Chief complaint and history (HPI with OPQRST)
- Medical background
- Problem representation
- Physical exam findings
- Differential diagnosis (categorized)
- Test selection
- Clinical reasoning updates
- Final diagnosis with confidence
- Patient communication
- Plan and disposition

Your job is to give a structured, supportive educational assessment with scores (0-5) for each category.
Do NOT give real-world medical advice. Do NOT tell the user what they personally should do in real life.
Focus only on how well they handled this fictional case.

Output your assessment as a JSON object with this exact structure:
{
  "overallRating": "Excellent" | "Good" | "Needs Improvement" | "Poor",
  "summary": "A short paragraph summarizing their overall performance.",
  "strengths": ["item1", "item2", "item3"],
  "areasForImprovement": ["item1", "item2", "item3"],
  "diagnosisFeedback": "Detailed comment on: (1) Whether the DDx included must-not-miss diagnoses (if missing, note the penalty), (2) Whether ranking made sense (most likely first), (3) Whether final diagnosis aligns with key data, (4) If user 'shotgunned' too many irrelevant diagnoses (efficiency penalty), (5) Quality of reasoning notes (if provided).",
  "missedKeyHistoryPoints": ["item1", "item2"],
  "testSelectionFeedback": "Detailed comment on: (1) High-yield tests they chose correctly, (2) Unnecessary/inappropriate tests ordered, (3) Critical tests they missed (if any), (4) Overall efficiency vs shotgun ordering approach.",
  "sectionRatings": {
    "history": "Excellent" | "Good" | "Needs Improvement" | "Poor",
    "exam": "Excellent" | "Good" | "Needs Improvement" | "Poor",
    "tests": "Excellent" | "Good" | "Needs Improvement" | "Poor",
    "diagnosis": "Excellent" | "Good" | "Needs Improvement" | "Poor",
    "communication": "Excellent" | "Good" | "Needs Improvement" | "Poor"
  },
  "totalScore": number,
  "scoreBreakdown": {
    "history": number,
    "exam": number,
    "tests": number,
    "diagnosis": number,
    "communication": number
  }
}

Be constructive and educational. Point out what they did well and what they could improve.`,R=`SCENARIO: ${T.title}
Description: ${T.description}

PATIENT:
Name: ${T.patientPersona.name}, Age: ${T.patientPersona.age}, Gender: ${T.patientPersona.gender}
Chief Complaint: ${T.patientPersona.chiefComplaint}
Background: ${T.patientPersona.background}
Vital Signs: HR ${T.patientPersona.vitals.heartRate} bpm, BP ${T.patientPersona.vitals.bloodPressure}, RR ${T.patientPersona.vitals.respiratoryRate}/min, O2 Sat ${T.patientPersona.vitals.oxygenSat}, Temp ${T.patientPersona.vitals.temperature}

KEY HISTORY POINTS (that a good doctor should find):
${T.patientPersona.keyHistoryPoints.map(e=>`- ${e}`).join("\n")}

RED FLAGS:
${T.patientPersona.redFlags.map(e=>`- ${e}`).join("\n")}

CORRECT DIAGNOSIS: ${A}
${T.diagnosisOptions?T.diagnosisOptions.map(e=>`- ${e.name} (${e.isCorrect?"CORRECT":"incorrect"}, ${e.isDangerous?"DANGEROUS":"not dangerous"}): ${e.explanation}`).join("\n"):T.dxOverrides?T.dxOverrides.map(e=>{let i=m.find(i=>i.id===e.dxId);return`- ${i?.name||e.dxId} (${"correct"===e.yield?"CORRECT":"dangerous-miss"===e.yield?"DANGEROUS":"incorrect"}): ${e.explanation}`}).join("\n"):"No diagnosis options defined"}

STUDENT'S PERFORMANCE:

Step 0 - Safety Check:
Stability Assessment: ${o||"Not completed"}
Red Flags Identified: ${r?.join(", ")||"None"}

Step 1 - Chief Complaint:
${d||"Not recorded"}

Step 2 - History (HPI):
${u?`Onset: ${u.onset||"Not asked"}
Provocation: ${u.provocation||"Not asked"}
Quality: ${u.quality||"Not asked"}
Radiation: ${u.radiation||"Not asked"}
Severity: ${void 0!==u.severity?u.severity+"/10":"Not asked"}
Timing: ${u.timing||"Not asked"}
Associated Symptoms: ${u.associatedSymptoms?.join(", ")||"None"}
Pertinent Positives: ${u.pertinentPositives?.join(", ")||"None"}
Pertinent Negatives: ${u.pertinentNegatives?.join(", ")||"None"}`:"Not completed"}

Chat Transcript:
${p?.map(e=>`${"doctor"===e.role?"Doctor":"Patient"}: ${e.content}`).join("\n")||"No conversation"}

Step 3 - Medical Background:
${g?`PMH: ${g.pastMedicalHistory?.join(", ")||"None"}
Meds: ${g.medications?.join(", ")||"None"}
Allergies: ${g.allergies?.map(e=>`${e.allergen} (${e.reaction})`).join(", ")||"None"}
Family History: ${g.familyHistory?.join(", ")||"None"}
Social: ${JSON.stringify(g.socialHistory||{})}`:"Not completed"}

Step 4 - Problem Representation:
${h?.summary||"Not completed"}

Step 5 - Physical Exam:
Exam Sections Viewed: ${f?.join(", ")||"None"}

Step 6 - Differential Diagnosis:
${$?$.map(e=>{try{let i=m.find(i=>i.id===e.dxId);return`#${e.rank} ${i?.name||e.dxId} (${e.confidence} confidence)${e.note?` - Note: ${e.note}`:""}`}catch{return`#${e.rank} ${e.dxId} (Error resolving)`}}).join("\n"):b?.map(e=>`- ${e.name} (${e.category}): ${e.reasoning||"No reasoning"}`).join("\n")||x?.map(e=>{let i=T.diagnosisOptions?.find(i=>i.id===e);return i?`- ${i.name}`:""}).join("\n")||"None"}

${I&&I.length>0?`⚠️ MISSING MUST-NOT-MISS DIAGNOSES: ${I.join(", ")} - Penalty applies`:""}
${$?`Efficiency: ${$.length} diagnoses${$.length>6?" (over recommended limit, efficiency penalty applies)":""}`:""}

Step 7 - Tests:
Tests Ordered: ${C?.join(", ")||"None"}
${C&&C.length>0?`
Test Details:
${C.map(e=>{try{let i=l(T,e);return`- ${i.test.name}: ${i.yield} yield, Result: ${i.result}`}catch{return`- ${e}: Error resolving test`}}).join("\n")}
`:""}

Step 8 - Clinical Reasoning:
${v?.map(e=>{if(T.diagnosisOptions){let i=T.diagnosisOptions.find(i=>i.id===e.id);return`- ${i?.name||e.id}: Moved ${e.moved} - ${e.reasoning}`}{let i=m.find(i=>i.id===e.id);return`- ${i?.name||e.id}: Moved ${e.moved} - ${e.reasoning}`}}).join("\n")||"No reasoning updates"}

Step 9 - Final Diagnosis:
Selected: ${k?(()=>{try{let e=m.find(e=>e.id===k);return e?.name||k}catch{return k}})():D}
${k&&T.finalDxId?`Correct Answer: ${T.finalDxId===k?"✓ CORRECT":"✗ INCORRECT"}`:""}
Confidence: ${P?.confidence||$?.find(e=>e.dxId===k)?.confidence||"Not specified"}
${P?.confidence==="Low"?`Next Steps: ${P.nextSteps||"None"}`:""}

Step 10 - Patient Communication:
Explanation: ${N||"Not provided"}

Step 11 - Plan & Disposition:
Disposition: ${S?.disposition||"Not selected"}
Plan: ${S?.planDetails||"Not provided"}
Consultations: ${S?.consultations?.join(", ")||"None"}
Monitoring: ${S?.monitoring?.join(", ")||"None"}

TEACHING POINTS:
${T.teachingPoints.map(e=>`- ${e}`).join("\n")}

Provide your comprehensive assessment as JSON with scores for each category.`,U=await y([{role:"system",content:O},{role:"user",content:R}]),w=U,M=U.match(/\{[\s\S]*\}/);M&&(w=M[0]);let j=JSON.parse(w),L=0,H={};if(C&&C.length>0){let e=C.reduce((e,i)=>{try{let n=l(T,i);return e+function(e){switch(e){case"high":return 2;case"helpful":return 1;case"low":default:return 0;case"inappropriate":return -2}}(n.yield)}catch{return e}},0);H.tests=e,L+=e}if($&&$.length>0){var i,n,t;let e=$.reduce((e,i)=>{try{let n=function(e,i){let n=m.find(e=>e.id===i);if(!n)throw Error(`Diagnosis ${i} not found in catalog`);let t=e.dxOverrides?.find(e=>e.dxId===i);return t?{dx:n,yield:t.yield,explanation:t.explanation}:{dx:n,yield:"irrelevant",explanation:"Not strongly supported by this case data."}}(T,i.dxId);return e+function(e){switch(e){case"correct":return 3;case"reasonable":return 2;case"low":default:return 0;case"irrelevant":return -1;case"dangerous-miss":return -3}}(n.yield)}catch{return e}},0),a=(i=T.finalDxId,k&&i?k===i?5:-2:0),o=function(e,i=6){return e<=i?0:-.5*(e-i)}($.length),r=(n=$.map(e=>e.dxId),(t=T.requiredMustNotMiss)?t.filter(e=>!n.includes(e)):[]),s=-3*r.length;H.diagnosis=e+a+o+s,L+=H.diagnosis}let B=0;if(T.testOverrides){let e=T.testOverrides.filter(e=>"high"===e.yield);B+=2*e.length}if(T.dxOverrides){let e=T.dxOverrides.filter(e=>"correct"===e.yield),i=Math.min(e.length,6);B+=3*i+5}0===B&&(B=45);let G=Math.max(0,Math.min(100,Math.round(L/B*100)));return j.totalScore=L,j.totalScorePercentage=G,j.maxScore=B,j.scoreBreakdown=H,s.NextResponse.json(j)}catch(i){console.error("Error in assess:",i);let e="Failed to generate assessment";return(i?.message?.includes("ECONNREFUSED")||i?.message?.includes("fetch failed"))&&(e="Cannot connect to Ollama. Make sure Ollama is running on localhost:11434"),s.NextResponse.json({error:e,details:i?.message||"Unknown error"},{status:500})}}let h=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/assess/route",pathname:"/api/assess",filename:"route",bundlePath:"app/api/assess/route"},resolvedPagePath:"/home/runner/work/Brinmeet123.github.io/Brinmeet123.github.io/app/api/assess/route.ts",nextConfigOutput:"standalone",userland:t}),{requestAsyncStorage:f,staticGenerationAsyncStorage:b,serverHooks:C}=h,v="/api/assess/route";function P(){return(0,r.patchFetch)({serverHooks:C,staticGenerationAsyncStorage:b})}}};var i=require("../../../webpack-runtime.js");i.C(e);var n=e=>i(i.s=e),t=i.X(0,[276,972,54],()=>n(8752));module.exports=t})();