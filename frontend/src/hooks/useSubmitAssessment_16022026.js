import { useState, useCallback } from "react";

/**
 * useSubmitAssessment
 *
 * A reusable hook that submits questionnaire answers to the backend.
 * Works with Azure Functions or AWS Lambda behind an API Gateway.
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
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionnaire_answers: answers })
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Assessment submission error:", err);
      setError("We couldn't generate the report. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
};
