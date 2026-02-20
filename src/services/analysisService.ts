import { AnalysisResult, mockResults } from "@/data/mockAnalysis";

export const analyzeDrug = async (file: File, drugName: string): Promise<AnalysisResult> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock data based on drug name
  const key = drugName.toLowerCase().trim();
  return mockResults[key] || mockResults["warfarin"];
};
