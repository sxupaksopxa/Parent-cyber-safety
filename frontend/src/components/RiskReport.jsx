import React from "react";

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
  if (!report) return null;

  const {
    summary,
    key_risks = [],
    immediate_actions = [],
    device_specific_recommendations = [],
    online_behavior_guidance = [],
    parent_child_conversation_tips,
    disclaimer,
  } = report;

  const riskLevel = summary?.risk_level || "Medium";
  const riskScore = summary?.risk_score ?? null;
  const riskColor = levelColors[riskLevel] || levelColors["Medium"];

  const showGuidanceButton =
    typeof onGenerateGuidance === "function" && immediate_actions.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-10">
      <div className="mt-6 bg-white shadow-md rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header / Score */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Child’s Digital Safety Assessment
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            This report is based on your answers and is meant to guide you in a
            calm, practical way. You can use it as a starting point to improve
            safety together with your child.
          </p>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Summary & score */}
          {summary && (
            <section
              className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${riskColor}`}
            >
              <div className="flex-1">
                <p className="text-sm font-medium tracking-wide uppercase opacity-80">
                  Overall Safety Summary
                </p>

                <p className="mt-1 text-sm sm:text-base leading-relaxed">
                  {summary.short_overview}
                </p>

                <p className="mt-2 text-xs text-gray-700 opacity-90">
                  This assessment reflects potential cyber exposure based on
                  your answers. It is meant as calm guidance — not to scare or
                  blame.
                </p>
              </div>

              <div className="sm:text-right">
                {riskScore !== null && (
                  <p className="text-3xl sm:text-4xl font-semibold">
                    {riskScore}
                    <span className="text-sm font-normal ml-1">/ 100</span>
                  </p>
                )}
                <span
                  className={
                    "inline-flex mt-1 px-3 py-1 rounded-full text-xs font-semibold " +
                    (badgeColors[riskLevel] || badgeColors["Medium"])
                  }
                >
                  Overall risk: {riskLevel}
                </span>
              </div>
            </section>
          )}

          {/* Key risks */}
          {key_risks.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Most Important Things to Be Aware Of
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                These are the main areas where your child may be more exposed to
                online risks. You don’t need to fix everything at once – start
                with one or two that feel most urgent.
              </p>
              <div className="grid gap-3">
                {key_risks.map((risk, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-3.5 bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{risk.title}</p>
                        <p className="mt-1 text-sm text-gray-700">
                          {risk.description}
                        </p>
                      </div>
                      {risk.severity && (
                        <span
                          className={
                            "ml-2 shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium " +
                            (badgeColors[risk.severity] ||
                              "bg-gray-100 text-gray-700")
                          }
                        >
                          {risk.severity} risk
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Step 3: Generate guidance button (shows only if guidance isn't present yet) */}
          {showGuidanceButton && (
            <section>
              <div className="border border-indigo-100 bg-indigo-50/70 rounded-xl p-4">
                <h3 className="text-base font-semibold text-indigo-900">
                  Step 3 (optional): Generate guidance
                </h3>
                <p className="mt-1 text-sm text-indigo-900/90">
                  If you want, you can generate practical next steps based on
                  your answers. This is optional — the assessment above already
                  highlights the main risk areas.
                </p>

                <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    type="button"
                    onClick={onGenerateGuidance}
                    disabled={guidanceLoading}
                    className="inline-flex justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-white font-semibold disabled:opacity-50"
                  >
                    {guidanceLoading ? "Generating..." : "Generate guidance"}
                  </button>

                  <span className="text-xs text-indigo-900/70">
                    You can skip this if you’re not ready.
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
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                First Steps You Can Take
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                These are practical actions you can take in the next few days.
                You don’t have to be a technical expert – follow them slowly,
                one step at a time.
              </p>
              <div className="space-y-3">
                {immediate_actions.map((action, idx) => (
                  <div
                    key={idx}
                    className="border border-indigo-100 bg-indigo-50/70 rounded-xl p-3.5"
                  >
                    <p className="font-medium text-indigo-900">
                      {idx + 1}. {action.title}
                    </p>
                    {Array.isArray(action.steps) && action.steps.length > 0 && (
                      <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm text-indigo-950">
                        {action.steps.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Device-specific tips */}
          {device_specific_recommendations.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Device-Specific Recommendations
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                These tips relate to the type of device your child uses (phone,
                tablet, laptop, console). You can work through them when you
                have the device in front of you.
              </p>
              <div className="space-y-3">
                {device_specific_recommendations.map((block, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-3.5 bg-white"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {block.device_type}
                    </p>
                    {Array.isArray(block.tips) && block.tips.length > 0 && (
                      <ul className="mt-2 space-y-1.5 list-disc list-inside text-sm text-gray-800">
                        {block.tips.map((tip, tIdx) => (
                          <li key={tIdx}>{tip}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Online behaviour guidance */}
          {online_behavior_guidance.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Online Behaviour Guidance
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                These notes focus on how your child uses social media, games,
                chat apps, and the internet in general.
              </p>
              <div className="space-y-3">
                {online_behavior_guidance.map((topic, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-3.5 bg-gray-50"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {topic.topic}
                    </p>
                    {Array.isArray(topic.advice) && topic.advice.length > 0 && (
                      <ul className="mt-2 space-y-1.5 list-disc list-inside text-sm text-gray-800">
                        {topic.advice.map((advice, aIdx) => (
                          <li key={aIdx}>{advice}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Conversation tips */}
          {parent_child_conversation_tips && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Talking with Your Child About Online Safety
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Children often feel safer when adults stay calm, listen, and
                avoid blame. These are suggested ways to open the conversation.
              </p>
              <div className="border border-purple-100 rounded-xl p-4 bg-purple-50/70">
                <p className="text-sm font-medium text-purple-900">
                  Suggested tone:{" "}
                  <span className="font-semibold">
                    {parent_child_conversation_tips.tone}
                  </span>
                </p>
                {Array.isArray(parent_child_conversation_tips.example_phrases) &&
                  parent_child_conversation_tips.example_phrases.length > 0 && (
                    <ul className="mt-2 space-y-1.5 list-disc list-inside text-sm text-purple-950">
                      {parent_child_conversation_tips.example_phrases.map(
                        (phrase, idx) => (
                          <li key={idx}>&ldquo;{phrase}&rdquo;</li>
                        )
                      )}
                    </ul>
                  )}
              </div>
            </section>
          )}

          {/* Disclaimer */}
          {disclaimer && (
            <section className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Important note:</strong> {disclaimer}
              </p>
            </section>
          )}

          {/* Copyright */}
          <section className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} BKlein — Developer
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RiskReport;