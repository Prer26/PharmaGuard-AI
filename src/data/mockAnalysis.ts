export interface DetectedVariant {
  rsid: string;
  gene?: string;
  impact?: string;
  genotype?: string;
}

export interface RiskAssessment {
  risk_label: string;
  confidence_score: number;
  severity: "none" | "low" | "moderate" | "high" | "critical";
}

export interface PharmacogenomicProfile {
  primary_gene: string;
  diplotype: string;
  phenotype: string;
  detected_variants: DetectedVariant[];
}

export interface ClinicalRecommendation {
  recommended_action: string;
  alternative_drugs?: string[];
  monitoring_advice?: string;
  cpic_reference?: string;
}

export interface LLMExplanation {
  summary: string;
  detailed_analysis?: string;
  confidence_reasoning?: string;
}

export interface QualityMetrics {
  vcf_parsing_success: boolean;
  coverage?: number;
  variant_count?: number;
}

export interface AnalysisResult {
  patient_id: string;
  drug: string;
  timestamp: string;
  risk_assessment: RiskAssessment;
  pharmacogenomic_profile: PharmacogenomicProfile;
  clinical_recommendation: ClinicalRecommendation;
  llm_generated_explanation: LLMExplanation;
  quality_metrics: QualityMetrics;
}

export const mockResults: Record<string, AnalysisResult> = {
  warfarin: {
    patient_id: "PATIENT_001",
    drug: "WARFARIN",
    timestamp: new Date().toISOString(),
    risk_assessment: {
      risk_label: "Toxic / Dose Reduction Required",
      confidence_score: 0.96,
      severity: "high",
    },
    pharmacogenomic_profile: {
      primary_gene: "CYP2C9",
      diplotype: "*2/*3",
      phenotype: "Poor Metabolizer (PM)",
      detected_variants: [
        {
          rsid: "rs1799853",
          gene: "CYP2C9",
          impact: "Moderate",
          genotype: "CT (Heterozygous)",
        },
        {
          rsid: "rs1057910",
          gene: "CYP2C9",
          impact: "Severe",
          genotype: "AC (Heterozygous)",
        },
      ],
    },
    clinical_recommendation: {
      recommended_action:
        "Reduce warfarin dose by 50-60%. Consider alternative anticoagulant. Monitor INR closely during initiation.",
      alternative_drugs: ["Dabigatran", "Rivaroxaban", "Apixaban"],
      monitoring_advice: "Check INR at 3 days, 7 days, and 14 days",
      cpic_reference:
        "CPIC Guideline for Pharmacogenetics-Guided Warfarin Dosing (2017 Update)",
    },
    llm_generated_explanation: {
      summary:
        "The patient carries CYP2C9 *2/*3 variants, indicating significantly reduced enzyme activity. Warfarin is primarily metabolized by CYP2C9, and poor metabolizers are at elevated risk for bleeding events due to drug accumulation.",
      detailed_analysis:
        "The *2 allele (rs1799853) reduces enzyme activity by ~30%, while the *3 allele (rs1057910) reduces it by ~80%. Combined, this results in substantially impaired warfarin clearance.",
      confidence_reasoning:
        "Based on CPIC evidence level A guidelines and 96% confidence in genotype determination.",
    },
    quality_metrics: {
      vcf_parsing_success: true,
      coverage: 42.5,
      variant_count: 2,
    },
  },
  clopidogrel: {
    patient_id: "PATIENT_002",
    drug: "CLOPIDOGREL",
    timestamp: new Date().toISOString(),
    risk_assessment: {
      risk_label: "Adjust Dosage",
      confidence_score: 0.88,
      severity: "moderate",
    },
    pharmacogenomic_profile: {
      primary_gene: "CYP2C19",
      diplotype: "*1/*2",
      phenotype: "Intermediate Metabolizer (IM)",
      detected_variants: [
        {
          rsid: "rs4244285",
          gene: "CYP2C19",
          impact: "Moderate",
          genotype: "AG (Heterozygous)",
        },
      ],
    },
    clinical_recommendation: {
      recommended_action:
        "Consider alternative antiplatelet therapy (e.g., prasugrel or ticagrelor). Standard dosing may result in reduced efficacy.",
      alternative_drugs: ["Prasugrel", "Ticagrelor", "Ticlopidine"],
      monitoring_advice: "Monitor for stent thrombosis or recurrent events",
      cpic_reference: "CPIC Guideline for CYP2C19 and Clopidogrel Therapy (2013)",
    },
    llm_generated_explanation: {
      summary:
        "CYP2C19 *1/*2 genotype suggests intermediate metabolism. The *2 allele is a loss-of-function variant that reduces the conversion of clopidogrel to its active metabolite.",
      detailed_analysis:
        "This may lead to inadequate platelet inhibition and increased cardiovascular risk. Clopidogrel is a prodrug requiring CYP2C19 activation.",
      confidence_reasoning:
        "CPIC evidence level A; 88% confidence in genotype and phenotype interpretation.",
    },
    quality_metrics: {
      vcf_parsing_success: true,
      coverage: 38.2,
      variant_count: 1,
    },
  },
  codeine: {
    patient_id: "PATIENT_003",
    drug: "CODEINE",
    timestamp: new Date().toISOString(),
    risk_assessment: {
      risk_label: "Toxic / Ineffective",
      confidence_score: 0.94,
      severity: "critical",
    },
    pharmacogenomic_profile: {
      primary_gene: "CYP2D6",
      diplotype: "*1/*1xN",
      phenotype: "Ultra-Rapid Metabolizer (URM)",
      detected_variants: [
        {
          rsid: "CYP2D6_duplication",
          gene: "CYP2D6",
          impact: "Severe",
          genotype: "Gene Duplication",
        },
      ],
    },
    clinical_recommendation: {
      recommended_action:
        "Avoid codeine. Ultra-rapid metabolism converts codeine to morphine at dangerously high rates. Use alternative analgesic (e.g., acetaminophen, NSAIDs).",
      alternative_drugs: ["Acetaminophen", "Ibuprofen", "Tramadol"],
      monitoring_advice: "Consider morphine toxicity risk in pediatric patients",
      cpic_reference: "CPIC Guideline for CYP2D6 and Codeine Therapy (2014 Update)",
    },
    llm_generated_explanation: {
      summary:
        "CYP2D6 ultra-rapid metabolizer status leads to rapid conversion of codeine to morphine via O-demethylation, increasing risk of respiratory depression and CNS toxicity.",
      detailed_analysis:
        "The gene duplication results in more than two functional copies of CYP2D6, causing dangerously high morphine accumulation. This is especially dangerous in pediatric and postoperative patients.",
      confidence_reasoning:
        "CPIC evidence level A; 94% confidence; critical safety concern.",
    },
    quality_metrics: {
      vcf_parsing_success: true,
      coverage: 45.8,
      variant_count: 1,
    },
  },
};
