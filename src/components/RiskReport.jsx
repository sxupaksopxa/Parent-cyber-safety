import React from "react";
import { useTranslation } from "react-i18next";

const levelColors = {
  Low: "bg-emerald-50 border-emerald-200 text-emerald-900",
  Medium: "bg-amber-50 border-amber-200 text-amber-900",
  High: "bg-rose-50 border-rose-200 text-rose-900",
};

const badgeColors = {
  Low: "bg-emerald-100 text-emerald-800",
  Medium: "bg-amber-100 text-amber-800",
  High: "bg-rose-100 text-rose-800",
};

const RiskReport = ({
  report,
  onGenerateGuidance,
  guidanceLoading = false,
  guidanceError = null,
}) => {
  const { t } = useTranslation("ui");

  if (!report) return null;

  const {
    summary,
    key_risks = [],
    immediate_actions = [],
    device_specific_recommendations = [],
    online_behavior_guidance = [],
    parent_child_conversation_tips,
  } = report;

  const riskLevel = summary?.risk_level || "Medium";
  const localizedRiskLevel = t(`common.riskLevels.${riskLevel.toLowerCase()}`);
  const riskScore = summary?.risk_score ?? null;
  const riskColor = levelColors[riskLevel] || levelColors["Medium"];

  const showGuidanceButton =
    typeof onGenerateGuidance === "function" && immediate_actions.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-10">
      <div className="report-card mt-6 bg-white shadow-md rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header / Score */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("reportUI.header.title")}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {t("reportUI.header.intro")}
          </p>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Summary & score */}
          {summary && (
            <section
              className={`report-section rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${riskColor}`}
            >
              <div className="flex-1">
                <p className="text-sm font-medium tracking-wide uppercase opacity-80">
                  {t("reportUI.summary.title")}
                </p>

                <p className="mt-1 text-sm sm:text-base leading-relaxed">
                  {summary.short_overview_key ? t(summary.short_overview_key) : ""}
                </p>

                <p className="mt-2 text-xs text-gray-700 opacity-90">
                  {t("reportUI.summary.note")}
                </p>
              </div>

              <div className="sm:text-right">
                {riskScore !== null && (
                  <p className="text-3xl sm:text-4xl font-semibold">
                    {riskScore}
                    <span className="text-sm font-normal ml-1">
                      {t("reportUI.summary.scoreSuffix")}
                    </span>
                  </p>
                )}
                <span
                  className={
                    "inline-flex mt-1 px-3 py-1 rounded-full text-xs font-semibold " +
                    (badgeColors[riskLevel] || badgeColors["Medium"])
                  }
                >
                  {t("reportUI.summary.overallRisk", {
                    level: localizedRiskLevel,
                  })}
                </span>
              </div>
            </section>
          )}

          {/* Key risks */}
          {key_risks.length > 0 && (
            <section className="report-section">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("reportUI.keyRisks.title")}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {t("reportUI.keyRisks.intro")}
              </p>
              <div className="grid gap-3">
                {key_risks.map((risk, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-3.5 bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {risk.titleKey ? t(risk.titleKey) : ""}
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                          {risk.descriptionKey
                            ? t(risk.descriptionKey, {
                                defaultValue: t(risk.fallbackDescriptionKey),
                              })
                            : ""}
                        </p>
                      </div>
                      {risk.severity && (
                        <span
                          className={
                            "ml-2 shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium " +
                            (badgeColors[risk.severityLevel] ||
                              "bg-gray-100 text-gray-700")
                          }
                        >
                          {t("reportUI.keyRisks.severitySuffix", {
                            severity: risk.severity
                              ? t(`common.riskLevels.${risk.severity.toLowerCase()}`)
                              : "",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Step 3: Generate guidance button */}
          {showGuidanceButton && (
            <section>
              <div className="border border-blue-100 bg-blue-50/70 rounded-xl p-4">
                <h3 className="text-base font-semibold text-blue-900">
                  {t("reportUI.guidance.title")}
                </h3>
                <p className="mt-1 text-sm text-blue-900/90">
                  {t("reportUI.guidance.intro")}
                </p>

                <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    type="button"
                    onClick={onGenerateGuidance}
                    disabled={guidanceLoading}
                    className="inline-flex justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-white font-semibold disabled:opacity-50"
                  >
                    {guidanceLoading
                      ? t("reportUI.guidance.buttonLoading")
                      : t("reportUI.guidance.buttonIdle")}
                  </button>

                  <span className="text-xs text-blue-900/70">
                    {t("reportUI.guidance.skipNote")}
                  </span>
                </div>

                {guidanceError && (
                  <p className="mt-3 text-sm text-rose-700">{guidanceError}</p>
                )}
              </div>
            </section>
          )}

          {/* Immediate actions */}
          {immediate_actions.length > 0 && (
            <section className="report-section">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("reportUI.immediateActions.title")}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {t("reportUI.immediateActions.intro")}
              </p>
              <div className="space-y-3">
                {immediate_actions.map((action, idx) => {
                  const steps = action.stepsKey
                    ? t(action.stepsKey, { returnObjects: true })
                    : [];

                  return (
                    <div
                      key={idx}
                      className="border border-blue-100 bg-blue-50/70 rounded-xl p-3.5"
                    >
                      <p className="font-medium text-blue-900">
                        {idx + 1}. {action.titleKey ? t(action.titleKey) : ""}
                      </p>

                      {Array.isArray(steps) && steps.length > 0 && (
                        <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm text-blue-950">
                          {steps.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ol>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Device-specific tips */}
          {device_specific_recommendations.length > 0 && (
            <section className="report-section">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("reportUI.deviceSpecific.title")}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {t("reportUI.deviceSpecific.intro")}
              </p>
              <div className="space-y-3">
                {device_specific_recommendations.map((block, idx) => {
                  const tips = block.tipsKey
                    ? t(block.tipsKey, { returnObjects: true })
                    : [];

                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-xl p-3.5 bg-white"
                    >
                      <p className="text-sm font-semibold text-gray-900">
                        {block.deviceLabelKey ? t(block.deviceLabelKey) : ""}
                      </p>

                      {Array.isArray(tips) && tips.length > 0 && (
                        <ul className="mt-2 space-y-1.5 list-disc list-inside text-sm text-gray-800">
                          {tips.map((tip, tIdx) => (
                            <li key={tIdx}>{tip}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Online behaviour guidance */}
          {online_behavior_guidance.length > 0 && (
            <section className="report-section">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("reportUI.onlineBehavior.title")}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {t("reportUI.onlineBehavior.intro")}
              </p>
              <div className="space-y-3">
                {online_behavior_guidance.map((topic, idx) => {
                  const advice = topic.adviceKey
                    ? t(topic.adviceKey, { returnObjects: true })
                    : [];

                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-xl p-3.5 bg-gray-50"
                    >
                      <p className="text-sm font-semibold text-gray-900">
                        {topic.topicKey ? t(topic.topicKey) : ""}
                      </p>

                      {Array.isArray(advice) && advice.length > 0 && (
                        <ul className="mt-2 space-y-1.5 list-disc list-inside text-sm text-gray-800">
                          {advice.map((item, aIdx) => (
                            <li key={aIdx}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Conversation tips */}
          {parent_child_conversation_tips && (
            <section className="report-section">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("reportUI.conversation.title")}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {t("reportUI.conversation.intro")}
              </p>
              <div className="border border-purple-100 rounded-xl p-4 bg-purple-50/70">
                <p className="text-sm font-medium text-purple-900">
                  {t("reportUI.conversation.toneLabel")}{" "}
                  <span className="font-semibold">
                    {parent_child_conversation_tips.toneKey
                      ? t(parent_child_conversation_tips.toneKey)
                      : ""}
                  </span>
                </p>

                {Array.isArray(
                  parent_child_conversation_tips.examplePhraseKeys
                ) &&
                  parent_child_conversation_tips.examplePhraseKeys.length > 0 && (
                    <ul className="mt-2 space-y-1.5 list-disc list-inside text-sm text-purple-950">
                      {parent_child_conversation_tips.examplePhraseKeys.map(
                        (key, idx) => (
                          <li key={idx}>&ldquo;{t(key)}&rdquo;</li>
                        )
                      )}
                    </ul>
                  )}
              </div>
            </section>
          )}

          {/* About this project */}
          <section className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-3.5">
            <p className="text-sm text-gray-600 leading-relaxed">
              {t("reportUI.project.about")}
            </p>
          </section>

          {/* Disclaimer */}
          {report.disclaimerKey && (
            <section className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>{t("reportUI.disclaimer.importantNote")}</strong>{" "}
                {t(report.disclaimerKey)}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskReport;