import React, { useState } from "react";
import { useRef } from "react";
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

  const questionnaireRef = useRef(null);

  const reportRef = useRef(null);

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
    setTimeout(() => {
    reportRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
    
    {/* Intro Section */}
    <div className="max-w-3xl mx-auto px-4 pt-10 pt-16 pb-8 text-center">
    <h1 className="text-3xl font-semibold text-gray-900 mb-4">
      Parent Cyber Safety
    </h1>

    <p className="text-gray-700 text-lg leading-relaxed mb-4">
      Children grow up in a digital world that evolves faster than most parents can follow. Devices, apps, and
      online platforms are all part of our everyday life, but it is not always easy to understand the risks they may bring.
    </p>

    <p className="text-gray-700 leading-relaxed mb-6">
      This short assessment helps parents reflect on their children's digital habits and receive practical guidance for creating a safer online environment at home.
    </p>

    <p className="text-sm text-gray-500 mb-6">
      • Takes about 2 minutes • Runs entirely in your browser • No personal data stored
    </p>

    <button
      onClick={() => questionnaireRef.current?.scrollIntoView({ behavior: "smooth" })}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
      >
      Start the Safety Check
    </button> 
    </div>

    {/* Educational notice */}
    <div className="max-w-4xl mx-auto px-4 pt-6">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
        <p className="text-xs text-gray-700 leading-relaxed">
          This tool provides general guidance and is intended to support awareness about children’s digital safety.
        </p>
      </div>
    </div>
    
    {/* Why this matters */}
    <div className="max-w-3xl mx-auto px-4 pt-8">
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
      Why this matters
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Kids don’t just “go online” anymore — they live there. Messages, videos,
        games, and social media have become continuous habits, and even small habits 
        can quietly turn into real risks. This tool is here to make digital safety
        feel less overwhelming, and to help parents take a few practical steps
        to mitigate these risks.
      </p>

    <div className="mt-4 flex flex-wrap gap-2">
      <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
        Simple assessment
      </span>
      <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
        Practical steps
      </span>
      <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
        Family-friendly guidance
      </span>
    </div>
    </div>
    </div>
    
    {/* Roadmap */}
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
      What’s next
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        I’m improving the tool step by step based on real feedback from parents.
        Planned updates include:
      </p>

      <ul className="space-y-2 text-gray-700">
      <li className="flex gap-2">
        <span className="mt-1.5 h-2 w-2 rounded-full bg-gray-400" />
        <span><strong>Multi-language support</strong> to make the tool accessible to more families</span>
      </li>
      <li className="flex gap-2">
        <span className="mt-1.5 h-2 w-2 rounded-full bg-gray-400" />
        <span><strong>More precise recommendations</strong> (device / OS specific guidance)</span>
      </li>
      <li className="flex gap-2">
        <span className="mt-1.5 h-2 w-2 rounded-full bg-gray-400" />
        <span><strong>Printable safety report</strong> (for parents and caregivers)</span>
      </li>
      <li className="flex gap-2">
        <span className="mt-1.5 h-2 w-2 rounded-full bg-gray-400" />
        <span><strong>AI-assisted personalization</strong> (planned) for more context-aware guidance</span>
      </li>
      </ul>
    </div>
    </div>

    <div ref={questionnaireRef} className="scroll-mt-24">
      <QuestionnaireForm onSubmit={handleSubmit} loading={loading} />
    </div>

    {error && (
      <p className="text-center text-red-600 mt-4 text-sm">{error}</p>
    )}

    {report && (
      <div ref={reportRef} className="scroll-mt-24 animate-fade-in">
      <RiskReport
        report={report}
        onGenerateGuidance={handleGenerateGuidance}
        guidanceLoading={guidanceLoading}
        guidanceError={guidanceError}
      />
    </div>
    )}
  </div>
  );
};

export default App;