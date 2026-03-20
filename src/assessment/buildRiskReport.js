import { assessSafety } from "./assess";

const RISK_CONTENT_MAP = {
  device_type: "device_type",
  screen_lock: "screen_lock",
  app_install: "app_install",
  parental_controls: "parental_controls",
  social_media: "social_media",
  photo_sharing: "photo_sharing",
  online_contacts: "online_contacts",
  unknown_callers: "unknown_callers",
  gaming_chat: "gaming_chat",
  public_wifi: "public_wifi",
  privacy_settings: "privacy_settings",
  app_review: "app_review",
  online_incidents: "online_incidents",
};

function scoreToLevel(score) {
  if (score >= 85) return "Low";
  if (score >= 70) return "Medium";
  return "High";
}

function severityFromBasePoints(points) {
  if (points >= 4) return "High";
  if (points >= 2) return "Medium";
  return "Low";
}

function getOverviewKey(score, riskLevel) {
  if (score === null) return "riskReport.summary.overview.recorded";
  if (riskLevel === "Low") return "riskReport.summary.overview.low";
  if (riskLevel === "Medium") return "riskReport.summary.overview.medium";
  return "riskReport.summary.overview.high";
}

// simplest safe version for now
function getDescriptionKey(contentId) {
  return `riskReport.risks.${contentId}.description.default`;
}

// Phase 1: answers -> assessment -> report
export function buildRiskReport(answers) {
  const assessment = assessSafety(answers);
  return buildRiskReportFromAssessment(assessment);
}

// Phase 1: assessment -> report (NO guidance here yet)
export function buildRiskReportFromAssessment(assessment) {
  const score = assessment?.score ?? null;
  const risk_level = score === null ? "Medium" : scoreToLevel(score);

  const topRisks = assessment?.topRisks ?? [];

  const key_risks = topRisks.map((risk) => {
    const contentId = RISK_CONTENT_MAP[risk.id] ?? "generic";
    const severity = severityFromBasePoints(risk.basePoints ?? 0);

    return {
      id: risk.id,
      contentId,
      chosen: risk.chosen ?? null,
      basePoints: risk.basePoints ?? 0,
      severity,
      titleKey: `riskReport.risks.${contentId}.title`,
      descriptionKey: getDescriptionKey(contentId),
    };
  });

  return {
    summary: {
      risk_score: score,
      risk_level,
      short_overview_key: getOverviewKey(score, risk_level),
    },
    key_risks,
    disclaimerKey: "riskReport.disclaimer.text",
  };
}