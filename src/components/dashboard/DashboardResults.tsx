import { useState, useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Dna,
  Activity,
  Info,
  Brain,
  FileText,
  Copy,
  Download,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Tag,
  Clock,
  User,
  TrendingUp,
} from "lucide-react";
import { AnalysisResult } from "@/data/mockAnalysis";

const severityConfig = {
  none: {
    text: "text-gray-600",
    border: "border-gray-200",
    bg: "bg-gray-50",
    icon: CheckCircle2,
  },
  low: {
    text: "text-success",
    border: "border-success/20",
    bg: "bg-success/10",
    icon: CheckCircle2,
  },
  moderate: {
    text: "text-warning",
    border: "border-warning/20",
    bg: "bg-warning/10",
    icon: AlertTriangle,
  },
  high: {
    text: "text-destructive",
    border: "border-destructive/20",
    bg: "bg-destructive/10",
    icon: AlertTriangle,
  },
  critical: {
    text: "text-destructive",
    border: "border-destructive/20",
    bg: "bg-destructive/10",
    icon: AlertTriangle,
  },
};

const DashboardResults = ({ result }: { result: AnalysisResult }) => {
  const [aiExpanded, setAiExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const risk = severityConfig[result.risk_assessment.severity];
  const RiskIcon = risk.icon;

  const jsonStr = useMemo(() => {
    return JSON.stringify(result, null, 2);
  }, [result]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pharmaguard-${result.patient_id}-${result.drug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const confidencePercent = Math.round(result.risk_assessment.confidence_score * 100);

  return (
    <div className="space-y-5 animate-fade-up">
      <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
        <FileText className="h-5 w-5 text-secondary" /> Analysis Results
      </h2>

      {/* Patient & Drug Info */}
      <div className="glass rounded-2xl shadow-card border border-border p-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-secondary" />
              <p className="text-xs text-muted-foreground">Patient ID</p>
            </div>
            <p className="font-display font-bold text-card-foreground">
              {result.patient_id}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-secondary" />
              <p className="text-xs text-muted-foreground">Drug Name</p>
            </div>
            <p className="font-display font-bold text-card-foreground">
              {result.drug}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-secondary" />
              <p className="text-xs text-muted-foreground">Analysis Time</p>
            </div>
            <p className="text-sm text-card-foreground">
              {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div
        className={`glass rounded-2xl shadow-card border ${risk.border} p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5`}
      >
        <div className={`w-16 h-16 rounded-2xl ${risk.bg} flex items-center justify-center`}>
          <RiskIcon className={`h-8 w-8 ${risk.text}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">Risk Assessment</p>
          <p className={`text-2xl font-display font-bold ${risk.text}`}>
            {result.risk_assessment.risk_label}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Severity: <span className="font-semibold capitalize">{result.risk_assessment.severity}</span>
          </p>
        </div>
        <div className="text-center">
          <span className="text-lg font-bold text-foreground">
            {confidencePercent}%
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            Confidence
          </p>
        </div>
      </div>

      {/* Risk & Confidence Visual Representation */}
      <div className="glass rounded-2xl shadow-card border border-border p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-6">Risk Analysis & Confidence Score</h3>
        <div className="grid sm:grid-cols-2 gap-8">
          {/* Risk Level Gauge */}
          <div className="flex flex-col items-center">
            <p className="text-xs text-muted-foreground mb-4 font-semibold">Risk Level</p>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-32 h-32" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                
                {/* Gradient background based on severity */}
                <defs>
                  <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    {result.risk_assessment.severity === "critical" && (
                      <>
                        <stop offset="0%" stopColor="hsl(0, 84%, 60%)" />
                        <stop offset="100%" stopColor="hsl(0, 84%, 40%)" />
                      </>
                    )}
                    {result.risk_assessment.severity === "high" && (
                      <>
                        <stop offset="0%" stopColor="hsl(0, 84%, 60%)" />
                        <stop offset="100%" stopColor="hsl(359, 100%, 50%)" />
                      </>
                    )}
                    {result.risk_assessment.severity === "moderate" && (
                      <>
                        <stop offset="0%" stopColor="hsl(38, 92%, 45%)" />
                        <stop offset="100%" stopColor="hsl(30, 100%, 50%)" />
                      </>
                    )}
                    {result.risk_assessment.severity === "low" && (
                      <>
                        <stop offset="0%" stopColor="hsl(142, 71%, 45%)" />
                        <stop offset="100%" stopColor="hsl(142, 76%, 36%)" />
                      </>
                    )}
                    {result.risk_assessment.severity === "none" && (
                      <>
                        <stop offset="0%" stopColor="hsl(142, 71%, 45%)" />
                        <stop offset="100%" stopColor="hsl(142, 76%, 36%)" />
                      </>
                    )}
                  </linearGradient>
                </defs>
                
                {/* Severity progress arc */}
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="url(#riskGradient)"
                  strokeWidth="8"
                  strokeDasharray={`${(["none", "low"].includes(result.risk_assessment.severity) ? 0 : ["moderate"].includes(result.risk_assessment.severity) ? 130 : ["high"].includes(result.risk_assessment.severity) ? 220 : 280)} 327`}
                  strokeLinecap="round"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px" }}
                />
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold ${risk.text}`}>
                  {result.risk_assessment.severity.charAt(0).toUpperCase()}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {result.risk_assessment.severity}
                </span>
              </div>
            </div>
          </div>

          {/* Confidence Score Arc */}
          <div className="flex flex-col items-center">
            <p className="text-xs text-muted-foreground mb-4 font-semibold">Analysis Confidence</p>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-32 h-32" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                
                {/* Confidence progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="8"
                  strokeDasharray={`${(confidencePercent / 100) * 327} 327`}
                  strokeLinecap="round"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px" }}
                />
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-secondary">
                  {confidencePercent}%
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pharmacogenomic Profile */}
      <div className="glass rounded-2xl shadow-card border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Dna className="h-4 w-4 text-secondary" />
          <p className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
            Pharmacogenomic Profile
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Primary Gene</p>
            <p className="font-display font-bold text-lg text-card-foreground">
              {result.pharmacogenomic_profile.primary_gene}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Diplotype</p>
            <p className="font-display font-semibold text-card-foreground">
              {result.pharmacogenomic_profile.diplotype}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Phenotype</p>
            <p className="font-display font-semibold text-card-foreground">
              {result.pharmacogenomic_profile.phenotype}
            </p>
          </div>
        </div>

        {result.pharmacogenomic_profile.detected_variants.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Detected Variants
            </p>
            <div className="space-y-2">
              {result.pharmacogenomic_profile.detected_variants.map((variant, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-accent/50"
                >
                  <Tag className="h-4 w-4 flex-shrink-0 mt-0.5 text-secondary" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-card-foreground">
                      {variant.rsid}
                    </p>
                    <div className="grid sm:grid-cols-3 gap-2 mt-1 text-xs text-muted-foreground">
                      {variant.gene && <span>Gene: <span className="text-card-foreground font-medium">{variant.gene}</span></span>}
                      {variant.genotype && <span>Genotype: <span className="text-card-foreground font-medium">{variant.genotype}</span></span>}
                      {variant.impact && <span className={`font-medium ${variant.impact === 'Severe' ? 'text-destructive' : 'text-warning'}`}>Impact: {variant.impact}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clinical Recommendation */}
      <div className="glass rounded-2xl shadow-card border border-border p-6">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-4 w-4 text-secondary" />
          <p className="text-sm font-semibold text-muted-foreground">
            Clinical Recommendation
          </p>
        </div>
        <p className="text-card-foreground leading-relaxed mb-4">
          {result.clinical_recommendation.recommended_action}
        </p>

        {result.clinical_recommendation.alternative_drugs && result.clinical_recommendation.alternative_drugs.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">Alternative Drugs:</p>
            <div className="flex flex-wrap gap-2">
              {result.clinical_recommendation.alternative_drugs.map((drug, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                  {drug}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.clinical_recommendation.monitoring_advice && (
          <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-xs font-semibold text-warning mb-1">Monitoring Advice:</p>
            <p className="text-sm text-card-foreground">{result.clinical_recommendation.monitoring_advice}</p>
          </div>
        )}

        {result.clinical_recommendation.cpic_reference && (
          <div className="p-3 rounded-lg bg-info/10 border border-info/20">
            <p className="text-xs font-semibold text-muted-foreground">CPIC Reference:</p>
            <p className="text-sm text-card-foreground">{result.clinical_recommendation.cpic_reference}</p>
          </div>
        )}
      </div>

      {/* AI Explanation */}
      <div className="glass rounded-2xl border border-border overflow-hidden">
        <button
          onClick={() => setAiExpanded(!aiExpanded)}
          className="w-full flex items-center justify-between p-6 hover:bg-accent/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-secondary" />
            <p className="text-sm font-semibold text-muted-foreground">
              AI Clinical Explanation
            </p>
          </div>
          {aiExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {aiExpanded && (
          <div className="px-6 pb-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Summary</p>
              <p className="text-card-foreground text-sm leading-relaxed">
                {result.llm_generated_explanation.summary}
              </p>
            </div>

            {result.llm_generated_explanation.detailed_analysis && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Detailed Analysis</p>
                <p className="text-card-foreground text-sm leading-relaxed">
                  {result.llm_generated_explanation.detailed_analysis}
                </p>
              </div>
            )}

            {result.llm_generated_explanation.confidence_reasoning && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Confidence Reasoning</p>
                <p className="text-card-foreground text-sm leading-relaxed">
                  {result.llm_generated_explanation.confidence_reasoning}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quality Metrics */}
      <div className="glass rounded-2xl border border-border overflow-hidden">
        <button
          onClick={() => setDetailsExpanded(!detailsExpanded)}
          className="w-full flex items-center justify-between p-6 hover:bg-accent/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-secondary" />
            <p className="text-sm font-semibold text-muted-foreground">
              Quality Metrics
            </p>
          </div>
          {detailsExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {detailsExpanded && (
          <div className="px-6 pb-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">VCF Parsing:</p>
              <span className={`text-sm font-semibold ${result.quality_metrics.vcf_parsing_success ? 'text-success' : 'text-destructive'}`}>
                {result.quality_metrics.vcf_parsing_success ? '✓ Success' : '✗ Failed'}
              </span>
            </div>
            {result.quality_metrics.coverage !== undefined && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Coverage:</p>
                <span className="text-sm font-semibold text-card-foreground">{result.quality_metrics.coverage}x</span>
              </div>
            )}
            {result.quality_metrics.variant_count !== undefined && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Variant Count:</p>
                <span className="text-sm font-semibold text-card-foreground">{result.quality_metrics.variant_count}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* JSON Output */}
      <div className="glass rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <p className="text-sm font-semibold text-muted-foreground">
            JSON Output
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-accent text-xs hover:bg-secondary/20 transition-colors"
            >
              <Copy className="h-3 w-3 inline mr-1" /> {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-accent text-xs hover:bg-secondary/20 transition-colors"
            >
              <Download className="h-3 w-3 inline mr-1" /> Download
            </button>
          </div>
        </div>

        <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed bg-muted text-muted-foreground max-h-96">
          {jsonStr}
        </pre>
      </div>
    </div>
  );
};

export default DashboardResults;
