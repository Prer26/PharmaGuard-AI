import { Upload, Pill, Search, FileBarChart, Dna } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload VCF File",
    description: "Upload your patient's Variant Call Format (VCF) file containing genomic variant data. Supports .vcf and .vcf.gz up to 5MB.",
    step: "01",
  },
  {
    icon: Pill,
    title: "Enter Drug Name(s)",
    description: "Specify one or more drugs to check for pharmacogenomic interactions. Multi-drug support included.",
    step: "02",
  },
  {
    icon: Search,
    title: "Run Analysis",
    description: "Our AI engine cross-references genetic variants with CPIC guidelines and drug-gene interaction databases.",
    step: "03",
  },
  {
    icon: FileBarChart,
    title: "Review Results",
    description: "View risk level, detected genes, metabolism phenotype, clinical recommendations, and AI-generated explanations.",
    step: "04",
  },
];

const HowToUse = () => {
  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            <Dna className="h-3.5 w-3.5" /> Quick Guide
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            How to Use PharmaGuard AI
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">
            Four simple steps to personalized pharmacogenomic risk detection.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="flex gap-6 items-start glass rounded-2xl p-6 md:p-8 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl gradient-glow flex items-center justify-center shadow-glow">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold text-secondary tracking-widest uppercase">Step {s.step}</span>
                </div>
                <h3 className="text-xl font-display font-semibold text-card-foreground mb-1">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
