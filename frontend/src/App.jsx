import React, { useState } from "react";
import QuestionnaireForm from "./components/QuestionnaireForm";
import RiskReport from "./components/RiskReport";
import { useSubmitAssessment } from "./hooks/useSubmitAssessment";
// import { mockReport } from "./mock/mockReport"; // optional for UI testing

import { assessSafety } from "./assessment/assess";
import { buildGuidance } from "./guidance/buildGuidance";

const App = () => {
  const [report, setReport] = useState(null);
  const [answersSnapshot, setAnswersSnapshot] = useState(null);

  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const [guidanceError, setGuidanceError] = useState(null);

  const { submit, loading, error } = useSubmitAssessment();

  const handleSubmit = async (answers) => {
    // Clear previous report when starting a new assessment
    setReport(null);

    // Reset guidance state
    setGuidanceError(null);
    setGuidanceLoading(false);

    // Store answers so Step 3 (guidance) can use them later
    setAnswersSnapshot(answers);

    // Frontend-only Phase 1: submit() returns the locally computed assessment report
    const result = await submit(answers);
    if (result) setReport(result);

    // Optional: UI testing without any logic
    // setTimeout(() => setReport(mockReport), 600);
  };

  const handleGenerateGuidance = async () => {
    setGuidanceError(null);
    setGuidanceLoading(true);

    try {
      if (!answersSnapshot) return;

      // Recompute assessment (keeps Phase 1 independent and avoids changing hook return types)
      const assessment = assessSafety(answersSnapshot);

      // Build guidance and merge into existing report
      const guidance = buildGuidance(assessment, answersSnapshot);
      setReport((prev) => (prev ? { ...prev, ...guidance } : prev));
    } catch (e) {
      console.error("Guidance generation error:", e);
      setGuidanceError("We couldn't generate guidance. Please try again.");
    } finally {
      setGuidanceLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-50">

    {/* Educational notice */}
    <div className="max-w-4xl mx-auto px-4 pt-6">
      <div className="bg-gray-100 border border-gray-200 rounded-xl p-3">
        <p className="text-xs text-gray-700 leading-relaxed">
          This tool provides general educational guidance only and does not
          replace professional advice or formal child protection policies.
        </p>
      </div>
    </div>

    <QuestionnaireForm onSubmit={handleSubmit} loading={loading} />

    {error && (
      <p className="text-center text-red-600 mt-4 text-sm">{error}</p>
    )}

    {report && (
      <RiskReport
        report={report}
        onGenerateGuidance={handleGenerateGuidance}
        guidanceLoading={guidanceLoading}
        guidanceError={guidanceError}
      />
    )}
  </div>
  );
};

export default App;