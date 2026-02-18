import React, { useState } from "react";
import QuestionnaireForm from "./components/QuestionnaireForm";
import RiskReport from "./components/RiskReport";

const App = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (answers) => {
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionnaire_answers: answers }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
      alert(
        "We couldn’t generate the safety report right now. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <QuestionnaireForm onSubmit={handleSubmit} loading={loading} />
      {report && <RiskReport report={report} />}
    </div>
  );
};

export default App;