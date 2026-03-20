import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import questionnaire from "../data/questionnaire.json";

/**
 * Props:
 * - onSubmit: async function(formData) => Promise<void>
 * - loading: boolean (optional)
 */
const QuestionnaireForm = ({ onSubmit, loading: loadingProp }) => {
  const { t } = useTranslation("ui");

  const [answers, setAnswers] = useState(() => {
    const initial = {};
    questionnaire.questions.forEach((q) => {
      initial[q.id] = q.type === "multi" ? [] : "";
    });
    return initial;
  });

  const [errors, setErrors] = useState({});
  const [submittingLocal, setSubmittingLocal] = useState(false);
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const loading = loadingProp ?? submittingLocal;

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
        if (value === "None") {
          next = ["None"];
        } else {
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
          newErrors[q.id] = "questionnaire.requiredError";
        }
      } else {
        if (!value || value === "") {
          newErrors[q.id] = "questionnaire.requiredError";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedOnce(true);

    const isValid = validate();

    if (!isValid) {
      const firstErrorQuestion = questionnaire.questions.find((q) => {
        if (!q.required) return false;
        const value = answers[q.id];

        if (q.type === "multi") {
          return !value || !Array.isArray(value) || value.length === 0;
        }

        return !value || value === "";
      });

      if (firstErrorQuestion) {
        const el = document.getElementById(`q-${firstErrorQuestion.id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      return;
    }

    try {
      setSubmittingLocal(true);

      if (onSubmit) {
        await onSubmit(answers);
      } else {
        console.log("Questionnaire submitted:", answers);
        alert(t("questionnaire.demoAlert"));
      }
    } catch (err) {
      console.error("Error submitting questionnaire:", err);
      alert(t("questionnaire.submitError"));
    } finally {
      setSubmittingLocal(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-semibold mb-2 text-gray-900">
          {t("questionnaire.title")}
        </h1>

        <p className="text-gray-600 mb-6">{t("questionnaire.intro")}</p>

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
                    {index + 1}. {t(`questions.${q.id}.question`)}
                    {q.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </p>

                  {q.type === "multi" && (
                    <p className="text-xs text-gray-500 mt-1">
                      {t("questionnaire.multiHint")}
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
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span>{t(`questions.${q.id}.options.${opt}`)}</span>
                    </label>
                  ))}

                {q.type === "multi" && (
                  <div className="space-y-1">
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 p-1 text-sm text-gray-800 cursor-pointer hover:bg-gray-50 rounded-md"
                      >
                        <input
                          type="checkbox"
                          name={q.id}
                          value={opt}
                          checked={(answers[q.id] || []).includes(opt)}
                          onChange={() => handleMultiChange(q.id, opt)}
                          disabled={loading}
                          className="h-3.5 w-3.5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span>{t(`questions.${q.id}.options.${opt}`)}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {errors[q.id] && submittedOnce && (
                <p className="mt-2 text-xs text-red-500">{t(errors[q.id])}</p>
              )}
            </div>
          ))}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {t("questionnaire.privacyNote")}
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-md transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading
                ? t("questionnaire.submitLoading")
                : t("questionnaire.submitIdle")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionnaireForm;