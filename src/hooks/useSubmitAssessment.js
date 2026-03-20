import { useState } from "react";
import { buildRiskReport } from "../assessment/buildRiskReport";

export function useSubmitAssessment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (answers) => {
    setLoading(true);
    setError(null);

    try {
      const result = buildRiskReport(answers);
      return result;
    } catch (err) {
      console.error("Assessment error:", err);
      setError(t("setError.required"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    submit,
    loading,
    error,
  };
}