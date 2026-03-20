import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

import QuestionnaireForm from "./components/QuestionnaireForm";
import RiskReport from "./components/RiskReport";
import { useSubmitAssessment } from "./hooks/useSubmitAssessment";
import { mockReport } from "./mock/mockReport"; // optional for UI testing

import { assessSafety } from "./assessment/assess";
import { buildGuidance } from "./guidance/buildGuidance";

import LanguageSwitcher from "./components/LanguageSwitcher";

const App = () => {
  const { t } = useTranslation("ui");

  const [report, setReport] = useState(null);
  const [answersSnapshot, setAnswersSnapshot] = useState(null);

  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const [guidanceError, setGuidanceError] = useState(null);

  const { submit, loading, error } = useSubmitAssessment();

  const questionnaireRef = useRef(null);
  const reportRef = useRef(null);

  const handleSubmit = async (answers) => {
    setReport(null);
    setGuidanceError(null);
    setGuidanceLoading(false);
    setAnswersSnapshot(answers);

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

      const assessment = assessSafety(answersSnapshot);
      const guidance = buildGuidance(assessment, answersSnapshot);
      setReport((prev) => (prev ? { ...prev, ...guidance } : prev));
    } catch (e) {
      console.error("Guidance generation error:", e);
      setGuidanceError(t("errors.guidanceGeneration"));
    } finally {
      setGuidanceLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-50">
  {/* Top bar */}
  <div className="max-w-6xl mx-auto px-6 pt-5 flex justify-end">
    <LanguageSwitcher />
  </div>

  {/* Intro Section */}
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-8 text-center">
      <p className="text-sm font-medium tracking-wide text-gray-500 uppercase mb-3">
      {t("intro.brand")}
    </p>

    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
      {t("intro.title")}
    </h1>

    <p className="text-lg sm:text-xl font-medium text-blue-700 mb-5">
      {t("intro.subtitle")}
    </p>

    <p className="text-gray-700 text-lg leading-relaxed mb-4">
      {t("intro.paragraph1")}
    </p>

    <p className="text-gray-700 leading-relaxed mb-6">
      {t("intro.paragraph2")}
    </p>

    <p className="text-sm text-gray-500 mb-6">
      {t("intro.meta")}
    </p>

    <button
      onClick={() =>
        questionnaireRef.current?.scrollIntoView({ behavior: "smooth" })
      }
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition duration-200"
    >
      {t("intro.startButton")}
    </button>
  </div>

      {/* Educational notice */}
      <div className="max-w-2xl mx-auto px-4 mt-6 text-center">
      <p className="text-sm text-gray-500 leading-relaxed">
        {t("notice.text")}
      </p>
      </div>
      
      {/* Why this matters */}
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {t("why.title")}
          </h2>

          <p className="text-gray-700 leading-relaxed mb-3">
            {t("why.paragraph1")}
          </p>

          <p className="text-gray-700 leading-relaxed">
            {t("why.paragraph2")}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {t("why.tag1")}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {t("why.tag2")}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {t("why.tag3")}
            </span>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {t("roadmap.title")}
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            {t("roadmap.intro")}
          </p>

          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-gray-400" />
              <span>
                <strong>{t("roadmap.item1Title")}</strong>{" "}
                {t("roadmap.item1Text")}
              </span>
            </li>

            <li className="flex gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-gray-400" />
              <span>
                <strong>{t("roadmap.item2Title")}</strong>{" "}
                {t("roadmap.item2Text")}
              </span>
            </li>

            <li className="flex gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-gray-400" />
              <span>
                <strong>{t("roadmap.item3Title")}</strong>{" "}
                {t("roadmap.item3Text")}
              </span>
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

      {/* Copyright */}
      <footer className="mt-16 pt-6 pb-8 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500 leading-relaxed">
        © {new Date().getFullYear()} Parent Cyber Safety · by BKlein Digital Labs. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;