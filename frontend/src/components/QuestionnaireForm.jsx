import React, { useState } from "react";
import questionnaire from "../data/questionnaire.json";

/**
 * Props:
 * - onSubmit: async function(formData) => Promise<void>
 *      Called with a plain object of answers:
 *      { age: "10–12", device_ownership: "Own device", social_media: ["TikTok", "WhatsApp"], ... }
 *
 * - loading: boolean (optional)
 *      If you manage loading state from parent, you can forward it.
 */
const QuestionnaireForm = ({ onSubmit, loading: loadingProp }) => {
  const [answers, setAnswers] = useState(() => {
    const initial = {};
    questionnaire.questions.forEach((q) => {
      if (q.type === "multi") {
        initial[q.id] = [];
      } else {
        initial[q.id] = "";
      }
    });
    return initial;
  });

  const [errors, setErrors] = useState({});
  const [submittingLocal, setSubmittingLocal] = useState(false);
  const loading = loadingProp ?? submittingLocal;
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const handleSingleChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleMultiChange = (id, value) => {
    setAnswers((prev) => {
      const current = prev[id] || [];
      let next;
      if (current.includes(value)) {
        next = current.filter((v) => v !== value);
      } else {
        // If "None" is chosen, clear all others
        if (value === "None") {
          next = ["None"];
        } else {
          // Remove "None" if it was selected
          next = current.filter((v) => v !== "None").concat(value);
        }
      }
      return { ...prev, [id]: next };
    });
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    questionnaire.questions.forEach((q) => {
      if (!q.required) return;
      const value = answers[q.id];
      if (q.type === "multi") {
        if (!value || !Array.isArray(value) || value.length === 0) {
          newErrors[q.id] = "This question is required.";
        }
      } else {
        if (!value || value === "") {
          newErrors[q.id] = "This question is required.";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedOnce(true);

    if (!validate()) {
      // Scroll to first error
      const firstErrorId = Object.keys(errors)[0];
      if (firstErrorId) {
        const el = document.getElementById(`q-${firstErrorId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      setSubmittingLocal(true);
      if (onSubmit) {
        await onSubmit(answers);
      } else {
        // Fallback: log to console if no handler passed
        console.log("Questionnaire submitted:", answers);
        alert("Thank you! Your answers were collected (demo mode).");
      }
    } catch (err) {
      console.error("Error submitting questionnaire:", err);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setSubmittingLocal(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-semibold mb-2 text-gray-900">
          Child Cyber Safety Assessment
        </h1>
        <p className="text-gray-600 mb-6">
          Please answer these short questions about your children, their devices, and
          online habits. This takes about 2–3 minutes and helps us create a
          gentle, personalized safety report for your family.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questionnaire.questions.map((q, index) => (
            <div
              key={q.id}
              id={`q-${q.id}`}
              className={`border border-gray-200 rounded-xl p-4 ${
                errors[q.id] && submittedOnce ? "border-red-400" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">
                    {index + 1}. {q.question}
                    {q.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </p>
                  {q.type === "multi" && (
                    <p className="text-xs text-gray-500 mt-1">
                      You can choose more than one option.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {q.type === "single" &&
                  q.options.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) =>
                          handleSingleChange(q.id, e.target.value)
                        }
                        disabled={loading}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}

                {q.type === "multi" &&
                  q.options.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name={`${q.id}-${opt}`}
                        value={opt}
                        checked={answers[q.id]?.includes(opt)}
                        onChange={() => handleMultiChange(q.id, opt)}
                        disabled={loading}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
              </div>

              {errors[q.id] && submittedOnce && (
                <p className="mt-2 text-xs text-red-500">{errors[q.id]}</p>
              )}
            </div>
          ))}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              We do not collect names, messages, or passwords. This assessment
              is for guidance only and does not replace professional or
              emergency support.
            </p>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-md transition ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Analyzing..." : "Get Safety Assessment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionnaireForm;