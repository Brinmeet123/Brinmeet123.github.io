export type TestCategory =
  | "Cardiac"
  | "Pulmonary"
  | "Neurology"
  | "GI"
  | "Renal"
  | "Endocrine"
  | "Infectious"
  | "Hematology"
  | "MSK"
  | "Imaging"
  | "Other";

export type TestKind = "Lab" | "Imaging" | "Bedside" | "Procedure";

export type TestItem = {
  id: string;
  name: string;
  category: TestCategory;
  kind: TestKind;
  description: string;
  typicalUses: string[];
  common: boolean;
};

export const testCatalog: TestItem[] = [
  // Cardiac
  {
    id: "ecg",
    name: "ECG (Electrocardiogram)",
    category: "Cardiac",
    kind: "Bedside",
    description: "Records the electrical activity of the heart",
    typicalUses: ["Chest pain", "Arrhythmia", "ACS"],
    common: true,
  },
  {
    id: "troponin",
    name: "Troponin I",
    category: "Cardiac",
    kind: "Lab",
    description: "Cardiac injury marker, elevated in myocardial infarction",
    typicalUses: ["ACS", "Chest pain"],
    common: true,
  },
  {
    id: "bnp",
    name: "BNP (Brain Natriuretic Peptide)",
    category: "Cardiac",
    kind: "Lab",
    description: "Marker for heart failure",
    typicalUses: ["Heart failure", "Dyspnea"],
    common: true,
  },
  {
    id: "echo",
    name: "Echocardiogram",
    category: "Cardiac",
    kind: "Imaging",
    description: "Ultrasound of the heart",
    typicalUses: ["Heart failure", "Valvular disease"],
    common: true,
  },
  {
    id: "stress_test",
    name: "Stress Test",
    category: "Cardiac",
    kind: "Procedure",
    description: "Exercise or pharmacologic stress testing",
    typicalUses: ["Chest pain", "Coronary disease"],
    common: false,
  },

  // Pulmonary
  {
    id: "cxr",
    name: "Chest X-Ray",
    category: "Pulmonary",
    kind: "Imaging",
    description: "Evaluates lungs, heart size, and chest structures",
    typicalUses: ["Chest pain", "Dyspnea", "Cough"],
    common: true,
  },
  {
    id: "ct_chest",
    name: "CT Chest",
    category: "Pulmonary",
    kind: "Imaging",
    description: "Detailed imaging of chest structures",
    typicalUses: ["PE", "Pneumonia", "Mass"],
    common: true,
  },
  {
    id: "abg",
    name: "Arterial Blood Gas",
    category: "Pulmonary",
    kind: "Lab",
    description: "Measures blood oxygen, CO2, and pH",
    typicalUses: ["Respiratory failure", "Acid-base disorders"],
    common: true,
  },
  {
    id: "pft",
    name: "Pulmonary Function Test",
    category: "Pulmonary",
    kind: "Procedure",
    description: "Measures lung function",
    typicalUses: ["COPD", "Asthma"],
    common: false,
  },

  // Neurology
  {
    id: "ct_head",
    name: "CT Head",
    category: "Neurology",
    kind: "Imaging",
    description: "Brain imaging for acute pathology",
    typicalUses: ["Headache", "Stroke", "Trauma"],
    common: true,
  },
  {
    id: "mri_brain",
    name: "MRI Brain",
    category: "Neurology",
    kind: "Imaging",
    description: "Detailed brain imaging",
    typicalUses: ["Stroke", "Tumor", "MS"],
    common: false,
  },
  {
    id: "eeg",
    name: "EEG (Electroencephalogram)",
    category: "Neurology",
    kind: "Procedure",
    description: "Brain electrical activity",
    typicalUses: ["Seizure", "Altered mental status"],
    common: false,
  },
  {
    id: "lumbar_puncture",
    name: "Lumbar Puncture",
    category: "Neurology",
    kind: "Procedure",
    description: "CSF analysis",
    typicalUses: ["Meningitis", "SAH"],
    common: false,
  },

  // GI
  {
    id: "ct_abdomen",
    name: "CT Abdomen/Pelvis",
    category: "GI",
    kind: "Imaging",
    description: "Abdominal imaging",
    typicalUses: ["Abdominal pain", "Appendicitis"],
    common: true,
  },
  {
    id: "lipase",
    name: "Lipase",
    category: "GI",
    kind: "Lab",
    description: "Pancreatic enzyme, elevated in pancreatitis",
    typicalUses: ["Abdominal pain", "Pancreatitis"],
    common: true,
  },
  {
    id: "lft",
    name: "Liver Function Tests",
    category: "GI",
    kind: "Lab",
    description: "ALT, AST, bilirubin, etc.",
    typicalUses: ["Hepatitis", "Jaundice"],
    common: true,
  },
  {
    id: "upper_endoscopy",
    name: "Upper Endoscopy",
    category: "GI",
    kind: "Procedure",
    description: "Visualization of upper GI tract",
    typicalUses: ["GI bleed", "Dysphagia"],
    common: false,
  },

  // Renal
  {
    id: "creatinine",
    name: "Creatinine",
    category: "Renal",
    kind: "Lab",
    description: "Kidney function marker",
    typicalUses: ["AKI", "CKD"],
    common: true,
  },
  {
    id: "bun",
    name: "BUN (Blood Urea Nitrogen)",
    category: "Renal",
    kind: "Lab",
    description: "Kidney function marker",
    typicalUses: ["AKI", "CKD"],
    common: true,
  },
  {
    id: "ua",
    name: "Urinalysis",
    category: "Renal",
    kind: "Lab",
    description: "Urine analysis",
    typicalUses: ["UTI", "AKI", "Nephritis"],
    common: true,
  },

  // Endocrine
  {
    id: "glucose",
    name: "Glucose",
    category: "Endocrine",
    kind: "Lab",
    description: "Blood sugar level",
    typicalUses: ["Diabetes", "Hypoglycemia"],
    common: true,
  },
  {
    id: "hba1c",
    name: "HbA1c",
    category: "Endocrine",
    kind: "Lab",
    description: "Long-term glucose control",
    typicalUses: ["Diabetes"],
    common: false,
  },
  {
    id: "tsh",
    name: "TSH",
    category: "Endocrine",
    kind: "Lab",
    description: "Thyroid function",
    typicalUses: ["Hypothyroidism", "Hyperthyroidism"],
    common: false,
  },

  // Infectious
  {
    id: "cbc",
    name: "CBC (Complete Blood Count)",
    category: "Hematology",
    kind: "Lab",
    description: "Red cells, white cells, platelets",
    typicalUses: ["Infection", "Anemia", "Bleeding"],
    common: true,
  },
  {
    id: "blood_culture",
    name: "Blood Culture",
    category: "Infectious",
    kind: "Lab",
    description: "Bacterial infection detection",
    typicalUses: ["Sepsis", "Fever"],
    common: true,
  },
  {
    id: "urine_culture",
    name: "Urine Culture",
    category: "Infectious",
    kind: "Lab",
    description: "Bacterial UTI detection",
    typicalUses: ["UTI"],
    common: true,
  },
  {
    id: "covid",
    name: "COVID-19 PCR",
    category: "Infectious",
    kind: "Lab",
    description: "SARS-CoV-2 detection",
    typicalUses: ["Respiratory infection"],
    common: true,
  },

  // Hematology
  {
    id: "pt_inr",
    name: "PT/INR",
    category: "Hematology",
    kind: "Lab",
    description: "Coagulation studies",
    typicalUses: ["Bleeding", "Anticoagulation"],
    common: true,
  },
  {
    id: "d_dimer",
    name: "D-Dimer",
    category: "Hematology",
    kind: "Lab",
    description: "Clotting marker, elevated in DVT/PE",
    typicalUses: ["PE", "DVT"],
    common: true,
  },
  {
    id: "ferritin",
    name: "Ferritin",
    category: "Hematology",
    kind: "Lab",
    description: "Iron storage",
    typicalUses: ["Anemia"],
    common: false,
  },

  // MSK
  {
    id: "xray_extremity",
    name: "X-Ray Extremity",
    category: "MSK",
    kind: "Imaging",
    description: "Bone imaging",
    typicalUses: ["Fracture", "Trauma"],
    common: true,
  },
  {
    id: "mri_spine",
    name: "MRI Spine",
    category: "MSK",
    kind: "Imaging",
    description: "Spinal cord and vertebrae imaging",
    typicalUses: ["Back pain", "Cord compression"],
    common: false,
  },

  // Other/General
  {
    id: "cmp",
    name: "CMP (Comprehensive Metabolic Panel)",
    category: "Other",
    kind: "Lab",
    description: "Electrolytes, kidney function, liver function",
    typicalUses: ["General screening", "Metabolic disorders"],
    common: true,
  },
  {
    id: "lipid",
    name: "Lipid Panel",
    category: "Other",
    kind: "Lab",
    description: "Cholesterol and triglycerides",
    typicalUses: ["Cardiovascular risk"],
    common: false,
  },
  {
    id: "us_abdomen",
    name: "Ultrasound Abdomen",
    category: "Imaging",
    kind: "Imaging",
    description: "Abdominal ultrasound",
    typicalUses: ["Gallstones", "Aortic aneurysm"],
    common: true,
  },
];

