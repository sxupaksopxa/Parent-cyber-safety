// src/assessment/buildRiskReport.js
import { assessSafety } from "./assess";

// Small “risk explanation” map (NOT recommendations; just what the answer implies)
const RISK_EXPLANATIONS = {
  screen_lock: {
    title: "Device access may be unprotected",
    describe: (chosen) =>
      chosen === "No"
        ? "Without a screen lock, anyone holding the device can open apps, messages, and accounts."
        : "If you're not sure about screen lock, the device may be easier to access than expected.",
  },
  app_install: {
    title: "Apps may be installed without supervision",
    describe: (chosen) =>
      chosen === "Yes"
        ? "Installing apps without approval increases exposure to unsafe apps, ads, tracking, and inappropriate content."
        : "If you're not sure, it may be worth checking device permissions for app installs.",
  },
  parental_controls: {
    title: "Family safety controls may be missing or incomplete",
    describe: (chosen) =>
      chosen === "No"
        ? "Without parental controls, it’s harder to manage screen time, app access, and age-appropriate content."
        : "Partial or unknown setup can leave gaps depending on the device and apps used.",
  },
  social_media: {
    title: "Social platform exposure",
    describe: () =>
      "Using multiple social platforms can increase contact with strangers, unwanted messages, and privacy exposure.",
  },
  photo_sharing: {
    title: "Personal content may be publicly shared",
    describe: (chosen) =>
      chosen === "Often"
        ? "Frequent posting can increase privacy risk and unwanted attention, especially if profiles are not private."
        : "Posting sometimes/rarely still carries privacy risk depending on who can view the content.",
  },
  online_contacts: {
    title: "Online contacts may include unknown people",
    describe: (chosen) =>
      String(chosen).includes("Mostly online")
        ? "Talking mostly with online people increases the chance of unwanted contact and manipulation."
        : "Mixed contacts may include people you don’t know in real life.",
  },
  unknown_callers: {
    title: "Unknown people may contact your child",
    describe: (chosen) =>
      chosen === "Yes"
        ? "Allowing unknown numbers increases the chance of spam, scams, and unwanted contact."
        : "If you're not sure, the current settings may allow unknown contacts.",
  },
  gaming_chat: {
    title: "Chat in games can create contact risk",
    describe: (chosen) =>
      String(chosen).includes("voice")
        ? "Voice chat can expose children to strangers, inappropriate language, or pressure."
        : String(chosen).includes("text")
          ? "Text chat can expose children to strangers, unwanted messages, or bullying."
          : "Game chat appears limited, which reduces contact risk.",
  },
  public_wifi: {
    title: "Public Wi-Fi can increase network exposure",
    describe: (chosen) =>
      chosen === "Often"
        ? "Public Wi-Fi can be less secure and may expose browsing or app traffic to interception."
        : "Occasional public Wi-Fi still carries some risk depending on the network.",
  },
  privacy_settings: {
    title: "Privacy settings may allow wider visibility",
    describe: (chosen) =>
      chosen === "No"
        ? "If apps are not private/friends-only, content may be visible to more people than intended."
        : "Partial or unknown privacy settings can leave some apps more open than expected.",
  },
  app_review: {
    title: "Installed apps may not be regularly checked",
    describe: (chosen) =>
      chosen === "No"
        ? "If apps aren’t reviewed, risky or unnecessary apps can stay installed unnoticed."
        : "Sometimes reviewing apps may miss changes over time as new apps are installed.",
  },
  online_incidents: {
    title: "Past unwanted contact or bullying risk",
    describe: (chosen) =>
      chosen === "Yes"
        ? "Past incidents suggest a higher chance of repeated unwanted contact or bullying without protective changes."
        : "Uncertainty can mean issues happened but weren’t clearly identified.",
  },
};

function scoreToLevel(score) {
  if (score >= 85) return "Low";
  if (score >= 70) return "Medium";
  return "High";
}

function severityFromBasePoints(p) {
  if (p >= 4) return "High";
  if (p >= 2) return "Medium";
  return "Low";
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

  const short_overview =
    score === null
      ? "Your answers were recorded. This assessment summarizes likely safety exposure based on the questionnaire."
      : risk_level === "Low"
        ? "Overall safety looks strong. There are still a few areas you can review for extra peace of mind."
        : risk_level === "Medium"
          ? "Overall safety is moderate. A few areas may benefit from small improvements and regular check-ins."
          : "Overall safety appears higher risk. Several answers suggest your child may be more exposed to online risks.";

  const topRisks = assessment?.topRisks ?? [];

  const key_risks = topRisks.map((r) => {
    const expl = RISK_EXPLANATIONS[r.id];
    const title = expl?.title ?? r.title ?? "Potential risk area";
    const description = expl?.describe
      ? expl.describe(r.chosen)
      : "This area may increase exposure depending on current settings and habits.";
    const severity = severityFromBasePoints(r.basePoints ?? 0);

    return { title, description, severity };
  });

  return {
    summary: {
      risk_score: score,
      risk_level,
      short_overview,
    },
    key_risks,
    disclaimer:
      "This assessment is general guidance based on your answers. It is not legal, medical, or emergency advice. If you believe your child is in immediate danger, please contact local authorities or a child protection organization.",
  };
}