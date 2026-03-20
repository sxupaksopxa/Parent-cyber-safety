// src/assessment/questionConfig.js

export const DOMAINS = {
  DEVICE: "device",
  PRIVACY: "privacy",
  SOCIAL: "social",
  NETWORK: "network",
  PARENT: "parent",
  INCIDENTS: "incidents",
  CONTEXT: "context",
};

export const CONTEXT_IDS = new Set(["age", "device_ownership", "device_type"]);

export const QUESTION_CONFIG = {
  age: { domain: DOMAINS.CONTEXT, scored: false, titleKey: "assessment.age" },
  device_ownership: { domain: DOMAINS.CONTEXT, scored: false, titleKey: "assessment.device_ownership" },
  device_type: { domain: DOMAINS.DEVICE, weight: 2, type: "multi", titleKey: "assessment.device_type" },

  screen_lock: {
    domain: DOMAINS.DEVICE,
    weight: 3,
    titleKey: "assessment.screen_lock",
    scoreMap: { yes: 0, not_sure: 2, no: 5 },
  },

  app_install: {
    domain: DOMAINS.DEVICE,
    weight: 3,
    titleKey: "assessment.app_install",
    scoreMap: { no: 0, not_sure: 2, yes: 5 },
  },

  parental_controls: {
    domain: DOMAINS.PARENT,
    weight: 3,
    titleKey: "assessment.parental_controls",
    scoreMap: { yes: 0, partially: 2, not_sure: 2, no: 5 },
  },

  social_media: {
    domain: DOMAINS.SOCIAL,
    weight: 2,
    type: "multi",
    titleKey: "assessment.social_media",
  },

  photo_sharing: {
    domain: DOMAINS.PRIVACY,
    weight: 3,
    titleKey: "assessment.photo_sharing",
    scoreMap: {
      never: 0,
      rarely: 1,
      sometimes: 3,
      often: 5,
      not_sure: 2,
    },
  },

  online_contacts: {
    domain: DOMAINS.SOCIAL,
    weight: 3,
    titleKey: "assessment.online_contacts",
    scoreMap: {
      only_real_life_friends: 0,
      mixed_friends_and_online: 3,
      mostly_online_people: 5,
      not_sure: 2,
    },
  },

  unknown_callers: {
    domain: DOMAINS.SOCIAL,
    weight: 2,
    titleKey: "assessment.unknown_callers",
    scoreMap: { no: 0, not_sure: 2, yes: 5 },
  },

  gaming_chat: {
    domain: DOMAINS.SOCIAL,
    weight: 2,
    titleKey: "assessment.gaming_chat",
    scoreMap: {
      no: 0,
      yes_chat_disabled: 1,
      yes_text_chat: 3,
      yes_voice_chat: 4,
      not_sure: 2,
    },
  },

  public_wifi: {
    domain: DOMAINS.NETWORK,
    weight: 2,
    titleKey: "assessment.public_wifi",
    scoreMap: {
      never: 0,
      rarely: 1,
      sometimes: 3,
      often: 5,
      not_sure: 2,
    },
  },

  privacy_settings: {
    domain: DOMAINS.PRIVACY,
    weight: 3,
    titleKey: "assessment.privacy_settings",
    scoreMap: { yes: 0, partially: 1, not_sure: 2, no: 5 },
  },

  app_review: {
    domain: DOMAINS.PARENT,
    weight: 2,
    titleKey: "assessment.app_review",
    scoreMap: { yes: 0, sometimes: 2, no: 5 },
  },

  online_incidents: {
    domain: DOMAINS.INCIDENTS,
    weight: 4,
    titleKey: "assessment.online_incidents",
    scoreMap: { no: 0, maybe_not_sure: 3, yes: 5 },
  },
};