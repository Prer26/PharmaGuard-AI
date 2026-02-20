import { useState, useRef } from "react";
import DashboardInput from "@/components/dashboard/DashboardInput";
import DashboardResults from "@/components/dashboard/DashboardResults";
import { AnalysisResult, mockResults } from "@/data/mockAnalysis";

const Dashboard = () => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [patientId, setPatientId] = useState("");
  const [drugName, setDrugName] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // ----------------------------
  // File Upload Handler
  // ----------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB limit.");
      return;
    }

    if (
      !selectedFile.name.endsWith(".vcf") &&
      !selectedFile.name.endsWith(".vcf.gz")
    ) {
      setError("Invalid VCF file format.");
      return;
    }

    setError("");
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  // ----------------------------
  // Analyze Handler
  // ----------------------------
  const handleAnalyze = async () => {
    if (!file || !patientId || !drugName) {
      setError("Please enter Patient ID, upload a VCF file and enter drug name.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setResult(null);

      // Simulate backend processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const key = drugName.toLowerCase().trim();
      const mockResult = mockResults[key] || mockResults["warfarin"];

      // Update with user's patient ID
      const finalResult = {
        ...mockResult,
        patient_id: patientId,
      };

      setResult(finalResult);
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <DashboardInput
          fileName={fileName}
          patientId={patientId}
          drugName={drugName}
          analyzing={analyzing}
          error={error}
          fileRef={fileRef}
          onFileChange={handleFileChange}
          onPatientChange={setPatientId}
          onDrugChange={setDrugName}
          onAnalyze={handleAnalyze}
        />

        {result && <DashboardResults result={result} />}
      </div>
    </div>
  );
};

export default Dashboard;
