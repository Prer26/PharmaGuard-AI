export interface AnalysisResult {
  analysis_id: string;
  timestamp: string;

  patient: {
    patient_id: string;
    sex: string;
    vcf_file: string;
    genome_build: string;
    ethnicity?: string;
    sample_source?: string;
  };

  drug_analysis: {
    drug_name: string;
    drug_class: string;
    target_genes: string[];
    cpic_guideline_available: boolean;
  };

  genotype_data: {
    genes_detected: {
      gene: string;
      variants_found: {
        rsid: string;
        chromosome: string;
        position: number;
        ref: string;
        alt: string;
        genotype: string;
        zygosity: string;
      }[];
      diplotype: string;
      phenotype: string;
    }[];
  };

  risk_assessment: {
    risk_level: string;
    risk_label: string;
    confidence_score: number;
    metabolism_status: string;
    clinical_severity: string;
  };

  clinical_recommendation: {
    dose_adjustment_required: boolean;
    recommended_action: string;
    alternative_drugs: string[];
    monitoring_advice: string;
    cpic_reference: string;
  };

  ai_explanation: string;

  dashboard_summary: {
    risk_badge_color: string;
    primary_gene: string;
    diplotype: string;
    phenotype: string;
    final_decision: string;
  };
}
