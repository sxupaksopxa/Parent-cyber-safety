// src/assessment/questionConfig.js

export const DOMAINS = {
  DEVICE: "Device Safety",
  PRIVACY: "Privacy",
  SOCIAL: "Social & Communication",
  NETWORK: "Network Safety",
  PARENT: "Parental Guidance",
  INCIDENTS: "Incidents & Exposure",
  CONTEXT: "Context",
};

// Not scored in Phase 1 (used later for personalization)
export const CONTEXT_IDS = new Set(["age", "device_ownership", "device_type"]);

/**
 * Risk scoring conventions:
 * - 0 = safest
 * - 5 = highest risk
 * - "I'm not sure" is treated as moderate risk (usually 2–3)
 */
export const QUESTION_CONFIG = {
  // --- Context only (not scored) ---
  age: { domain: DOMAINS.CONTEXT, scored: false, title: "Child age group" },
  device_ownership: { domain: DOMAINS.CONTEXT, scored: false, title: "Device ownership" },
  device_type: { domain: DOMAINS.CONTEXT, scored: false, title: "Device type" },

  // --- Scored questions ---
  screen_lock: {
    domain: DOMAINS.DEVICE,
    weight: 3,
    title: "Screen lock / PIN",
    scoreMap: { "Yes": 0, "I'm not sure": 2, "No": 5 },
  },

  app_install: {
    domain: DOMAINS.DEVICE,
    weight: 3,
    title: "App installs without approval",
    scoreMap: { "No": 0, "I'm not sure": 2, "Yes": 5 },
  },

  parental_controls: {
    domain: DOMAINS.PARENT,
    weight: 3,
    title: "Parental controls enabled",
    scoreMap: { "Yes": 0, "Partially": 2, "I'm not sure": 2, "No": 5 },
  },

  // multi-select special case
  social_media: {
    domain: DOMAINS.SOCIAL,
    weight: 2,
    type: "multi",
    title: "Social media used",
  },

  photo_sharing: {
    domain: DOMAINS.PRIVACY,
    weight: 3,
    title: "Posts photos/videos online",
    scoreMap: {
      "Never": 0,
      "Rarely": 1,
      "Sometimes": 3,
      "Often": 5,
      "I'm not sure": 2,
    },
  },

  online_contacts: {
    domain: DOMAINS.SOCIAL,
    weight: 3,
    title: "Who the child talks to online",
    scoreMap: {
      "Only real-life friends": 0,
      "Mixed (friends + online people)": 3,
      "Mostly online people": 5,
      "I'm not sure": 2,
    },
  },

  unknown_callers: {
    domain: DOMAINS.SOCIAL,
    weight: 2,
    title: "Unknown numbers allowed",
    scoreMap: { "No": 0, "I'm not sure": 2, "Yes": 5 },
  },

  gaming_chat: {
    domain: DOMAINS.SOCIAL,
    weight: 2,
    title: "Online games with chat",
    scoreMap: {
      "No": 0,
      "Yes, but chat is disabled": 1,
      "Yes, with text chat": 3,
      "Yes, with voice chat": 4,
      "I'm not sure": 2,
    },
  },

  public_wifi: {
    domain: DOMAINS.NETWORK,
    weight: 2,
    title: "Uses public Wi-Fi",
    scoreMap: {
      "Never": 0,
      "Rarely": 1,
      "Sometimes": 3,
      "Often": 5,
      "I'm not sure": 2,
    },
  },

  privacy_settings: {
    domain: DOMAINS.PRIVACY,
    weight: 3,
    title: "Apps set to Private/Friends-only",
    scoreMap: { "Yes": 0, "Partially": 1, "I'm not sure": 2, "No": 5 },
  },

  app_review: {
    domain: DOMAINS.PARENT,
    weight: 2,
    title: "Parent reviews installed apps",
    scoreMap: { "Yes": 0, "Sometimes": 2, "No": 5 },
  },

  online_incidents: {
    domain: DOMAINS.INCIDENTS,
    weight: 4,
    title: "Past incidents (bullying/suspicious contact)",
    scoreMap: { "No": 0, "Maybe / not sure": 3, "Yes": 5 },
  },
};