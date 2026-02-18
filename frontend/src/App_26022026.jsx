import React, { useState } from "react";
import QuestionnaireForm from "./components/QuestionnaireForm";
import RiskReport from "./components/RiskReport";
import { useSubmitAssessment } from "./hooks/useSubmitAssessment";
// import { mockReport } from "./mock/mockReport"; // uncomment to test without backend

const App = () => {
  const [report, setReport] = useState(null);
  const { submit, loading, error } = useSubmitAssessment();

  const handleSubmit = async (answers) => {
    // 👉 For backend integration:
    const result = await submit(answers);
    if (result) setReport(result);

    // 👉 For frontend-only testing, comment the two lines above and use:
    // setTimeout(() => setReport(mockReport), 600);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <QuestionnaireForm onSubmit={handleSubmit} loading={loading} />
      {error && (
        <p className="text-center text-red-600 mt-4 text-sm">{error}</p>
      )}
      {report && <RiskReport report={report} />}
    </div>
  );
};

export default App;
