export type DxCategory =
  | "Cardiac"
  | "Pulmonary"
  | "Neurology"
  | "GI"
  | "Infectious"
  | "Endocrine"
  | "Renal"
  | "Hematology"
  | "Psych"
  | "MSK"
  | "Other";

export type DiagnosisItem = {
  id: string;
  name: string;
  category: DxCategory;
  brief: string;          // 1-line description
  typicalClues: string[]; // common features
  common: boolean;
};

export const diagnosisCatalog: DiagnosisItem[] = [
  // Cardiac
  {
    id: "stemi",
    name: "ST-elevation myocardial infarction (STEMI)",
    category: "Cardiac",
    brief: "Acute coronary occlusion causing myocardial injury.",
    typicalClues: ["Exertional chest pressure", "Radiation to arm/jaw", "ECG ST elevation", "Elevated troponin"],
    common: true,
  },
  {
    id: "nstemi",
    name: "Non-ST elevation myocardial infarction (NSTEMI)",
    category: "Cardiac",
    brief: "Myocardial infarction without ST elevation on ECG.",
    typicalClues: ["Chest pain", "Elevated troponin", "No ST elevation"],
    common: true,
  },
  {
    id: "unstable_angina",
    name: "Unstable angina",
    category: "Cardiac",
    brief: "Chest pain from coronary artery disease, not meeting MI criteria.",
    typicalClues: ["Chest pain", "Normal troponin", "ECG changes"],
    common: true,
  },
  {
    id: "aortic_dissection",
    name: "Aortic dissection",
    category: "Cardiac",
    brief: "Tear in the aortic wall, life-threatening emergency.",
    typicalClues: ["Tearing chest pain", "Hypertension", "Pulse deficit", "Widened mediastinum"],
    common: false,
  },
  {
    id: "pericarditis",
    name: "Pericarditis",
    category: "Cardiac",
    brief: "Inflammation of the pericardium.",
    typicalClues: ["Sharp chest pain", "Worse lying flat", "Pericardial rub", "Diffuse ST elevation"],
    common: false,
  },

  // Pulmonary
  {
    id: "pe",
    name: "Pulmonary embolism (PE)",
    category: "Pulmonary",
    brief: "Blood clot blocking pulmonary artery.",
    typicalClues: ["Dyspnea", "Chest pain", "Tachycardia", "Elevated D-dimer"],
    common: true,
  },
  {
    id: "pneumonia",
    name: "Pneumonia",
    category: "Pulmonary",
    brief: "Lung infection causing inflammation.",
    typicalClues: ["Fever", "Cough", "Chest X-ray infiltrate", "Elevated WBC"],
    common: true,
  },
  {
    id: "pneumothorax",
    name: "Pneumothorax",
    category: "Pulmonary",
    brief: "Collapsed lung from air in pleural space.",
    typicalClues: ["Sudden dyspnea", "Chest pain", "Decreased breath sounds", "Hyperresonance"],
    common: false,
  },
  {
    id: "copd_exacerbation",
    name: "COPD exacerbation",
    category: "Pulmonary",
    brief: "Acute worsening of chronic obstructive pulmonary disease.",
    typicalClues: ["Dyspnea", "Wheezing", "COPD history", "Increased sputum"],
    common: true,
  },

  // Neurology
  {
    id: "stroke",
    name: "Ischemic stroke",
    category: "Neurology",
    brief: "Brain tissue death from blocked blood supply.",
    typicalClues: ["Focal neurologic deficit", "Sudden onset", "CT head negative early", "Risk factors"],
    common: true,
  },
  {
    id: "tia",
    name: "Transient ischemic attack (TIA)",
    category: "Neurology",
    brief: "Temporary stroke symptoms that resolve.",
    typicalClues: ["Focal deficit", "Resolves <24h", "No CT changes"],
    common: true,
  },
  {
    id: "migraine",
    name: "Migraine",
    category: "Neurology",
    brief: "Severe headache with associated symptoms.",
    typicalClues: ["Unilateral headache", "Photophobia", "Nausea", "Aura"],
    common: true,
  },
  {
    id: "meningitis",
    name: "Meningitis",
    category: "Neurology",
    brief: "Infection of the meninges.",
    typicalClues: ["Headache", "Fever", "Neck stiffness", "Altered mental status"],
    common: false,
  },
  {
    id: "subarachnoid_hemorrhage",
    name: "Subarachnoid hemorrhage (SAH)",
    category: "Neurology",
    brief: "Bleeding into subarachnoid space.",
    typicalClues: ["Thunderclap headache", "Neck stiffness", "CT head positive", "Bloody CSF"],
    common: false,
  },

  // GI
  {
    id: "gerd",
    name: "Gastroesophageal reflux disease (GERD)",
    category: "GI",
    brief: "Acid reflux causing burning chest discomfort.",
    typicalClues: ["Burning pain", "Post-meal", "Worse lying down", "Relief with antacids"],
    common: true,
  },
  {
    id: "pancreatitis",
    name: "Acute pancreatitis",
    category: "GI",
    brief: "Inflammation of the pancreas.",
    typicalClues: ["Epigastric pain", "Radiation to back", "Elevated lipase", "Nausea/vomiting"],
    common: true,
  },
  {
    id: "appendicitis",
    name: "Appendicitis",
    category: "GI",
    brief: "Inflammation of the appendix.",
    typicalClues: ["RLQ pain", "Fever", "Elevated WBC", "CT findings"],
    common: true,
  },
  {
    id: "cholecystitis",
    name: "Acute cholecystitis",
    category: "GI",
    brief: "Inflammation of the gallbladder.",
    typicalClues: ["RUQ pain", "Fever", "Elevated WBC", "Positive Murphy's sign"],
    common: true,
  },

  // Infectious
  {
    id: "sepsis",
    name: "Sepsis",
    category: "Infectious",
    brief: "Life-threatening organ dysfunction from infection.",
    typicalClues: ["Fever", "Hypotension", "Tachycardia", "Elevated lactate"],
    common: true,
  },
  {
    id: "uti",
    name: "Urinary tract infection (UTI)",
    category: "Infectious",
    brief: "Bacterial infection of urinary system.",
    typicalClues: ["Dysuria", "Frequency", "Positive urine culture", "Pyuria"],
    common: true,
  },

  // Endocrine
  {
    id: "dka",
    name: "Diabetic ketoacidosis (DKA)",
    category: "Endocrine",
    brief: "Severe hyperglycemia with metabolic acidosis.",
    typicalClues: ["Hyperglycemia", "Ketones", "Acidosis", "Altered mental status"],
    common: false,
  },
  {
    id: "hypoglycemia",
    name: "Hypoglycemia",
    category: "Endocrine",
    brief: "Low blood sugar.",
    typicalClues: ["Altered mental status", "Sweating", "Tremor", "Low glucose"],
    common: true,
  },

  // Renal
  {
    id: "aki",
    name: "Acute kidney injury (AKI)",
    category: "Renal",
    brief: "Sudden decline in kidney function.",
    typicalClues: ["Elevated creatinine", "Oliguria", "Volume depletion", "Nephrotoxins"],
    common: true,
  },

  // Psych
  {
    id: "panic",
    name: "Panic attack",
    category: "Psych",
    brief: "Acute anxiety episode with physical symptoms.",
    typicalClues: ["Palpitations", "Fear", "Tingling", "Hyperventilation", "No organic findings"],
    common: true,
  },
  {
    id: "anxiety",
    name: "Anxiety disorder",
    category: "Psych",
    brief: "Persistent excessive worry and anxiety.",
    typicalClues: ["Worry", "Restlessness", "Fatigue", "Difficulty concentrating"],
    common: true,
  },

  // MSK
  {
    id: "muscle_strain",
    name: "Muscle strain",
    category: "MSK",
    brief: "Injury to muscle or tendon.",
    typicalClues: ["Pain with movement", "Localized tenderness", "No systemic symptoms"],
    common: true,
  },

  // Other
  {
    id: "costochondritis",
    name: "Costochondritis",
    category: "Other",
    brief: "Inflammation of costochondral joints.",
    typicalClues: ["Chest wall tenderness", "Reproducible pain", "No cardiac findings"],
    common: true,
  },
];

