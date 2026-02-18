import { useState, useCallback } from "react";
import { buildRiskReport } from "../assessment/buildRiskReport";

/**
 * useSubmitAssessment (Frontend-only / Phase 1)
 *
 * Generates the Safety Assessment locally from questionnaire answers.
 * Keeps the same hook API so you can switch to Hybrid later without changing UI code.
 *
 * Returns:
 * {
 *    submit(answers): Promise<report>,
 *    loading: boolean,
 *    error: string | null
 * }
 */
export const useSubmitAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = useCallback(async (answers) => {
    setLoading(true);
    setError(null);

    try {
      // Frontend-only: calculate assessment instantly
      const report = buildRiskReport(answers);
      return report;
    } catch (err) {
      console.error("Local assessment error:", err);
      setError("We couldn't generate the report. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
};