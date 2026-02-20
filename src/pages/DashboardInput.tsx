import React from "react";

interface Props {
  fileName: string;
  drugName: string;
  patientId: string;
  analyzing: boolean;
  error: string;
  fileRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrugChange: (value: string) => void;
  onPatientChange: (value: string) => void;
  onAnalyze: () => void;
}

const DashboardInput: React.FC<Props> = ({
  fileName,
  drugName,
  patientId,
  analyzing,
  error,
  fileRef,
  onFileChange,
  onDrugChange,
  onPatientChange,
  onAnalyze,
}) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">

      <h2 className="text-2xl font-bold text-gray-800">
        Pharmacogenomic Analysis
      </h2>

      {/* Patient ID */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Patient ID
        </label>
        <input
          type="text"
          value={patientId}
          onChange={(e) => onPatientChange(e.target.value)}
          placeholder="Enter Patient ID"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Drug Name */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Drug Name
        </label>
        <input
          type="text"
          value={drugName}
          onChange={(e) => onDrugChange(e.target.value)}
          placeholder="Enter Drug Name (e.g., Warfarin)"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Upload VCF File
        </label>
        <input
          type="file"
          ref={fileRef}
          onChange={onFileChange}
          accept=".vcf,.vcf.gz"
          className="w-full"
        />
        {fileName && (
          <p className="mt-2 text-sm text-green-600">
            Selected: {fileName}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={onAnalyze}
        disabled={analyzing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300 disabled:opacity-50"
      >
        {analyzing ? "Analyzing..." : "Analyze"}
      </button>
    </div>
  );
};

export default DashboardInput;
