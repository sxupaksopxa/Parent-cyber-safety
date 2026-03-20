// src/guidance/buildGuidance.js

function normalizeMulti(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function pickTopRiskIds(assessment, max = 3) {
  const topRisks = assessment?.topRisks ?? [];
  return topRisks.slice(0, max).map((r) => r.id);
}

function uniqueByKey(items, keyName = "contentId") {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = item?.[keyName];
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function deviceKey(deviceType) {
  const values = Array.isArray(deviceType) ? deviceType : [deviceType];

  if (values.includes("game_console")) return "console";
  if (values.includes("laptop_or_computer")) return "computer";
  if (values.includes("smartphone") || values.includes("tablet")) return "mobile";
  if (values.includes("smart_tv")) return "smart_tv";
  if (values.includes("smartwatch")) return "smartwatch";

  return "generic";
}

function isYoungerAge(age) {
  return age === "under_6" || age === "age_7_9";
}

function isTeen(age) {
  return age === "age_13_15" || age === "age_16_18";
}

/* -----------------------
 * 1) Immediate actions
 * ----------------------- */

function actionForRiskId(riskId) {
  switch (riskId) {
    case "screen_lock":
      return { contentId: "screen_lock" };
    case "app_install":
      return { contentId: "app_install" };
    case "parental_controls":
      return { contentId: "parental_controls" };
    case "privacy_settings":
      return { contentId: "privacy_settings" };
    case "unknown_callers":
      return { contentId: "unknown_callers" };
    case "online_contacts":
      return { contentId: "online_contacts" };
    case "gaming_chat":
      return { contentId: "gaming_chat" };
    case "public_wifi":
      return { contentId: "public_wifi" };
    case "photo_sharing":
      return { contentId: "photo_sharing" };
    case "app_review":
      return { contentId: "app_review" };
    case "online_incidents":
      return { contentId: "online_incidents" };
    case "social_media":
      return { contentId: "social_media" };
    default:
      return null;
  }
}

function buildImmediateActions(assessment) {
  const topIds = pickTopRiskIds(assessment, 4);

  const actions = topIds
    .map((id) => actionForRiskId(id))
    .filter(Boolean);

  if (actions.length === 0) {
    actions.push({ contentId: "baseline_check" });
  }

  return uniqueByKey(actions).slice(0, 3).map((action) => ({
    contentId: action.contentId,
    titleKey: `guidance.immediateActions.${action.contentId}.title`,
    stepsKey: `guidance.immediateActions.${action.contentId}.steps`
  }));
}

/* -----------------------
 * 2) Device-specific tips
 * ----------------------- */

function buildDeviceGuidance(answers) {
  const key = deviceKey(answers?.device_type);

  return [
    {
      deviceKey: key,
      deviceLabelKey: `guidance.deviceSpecific.${key}.label`,
      tipsKey: `guidance.deviceSpecific.${key}.tips`
    }
  ];
}

/* -----------------------
 * 3) Online behaviour guidance
 * ----------------------- */

function buildBehaviorGuidance(answers) {
  const out = [];

  const social = normalizeMulti(answers?.social_media);
  const photoSharing = answers?.photo_sharing;
  const onlineContacts = answers?.online_contacts;
  const gamingChat = answers?.gaming_chat;
  const publicWifi = answers?.public_wifi;

  const usesSocial =
    social.length > 0 &&
    !social.includes("none") &&
    !social.includes("not_sure");

  if (usesSocial) {
    out.push({ contentId: "social_media_safety" });
  } else if (social.includes("not_sure")) {
    out.push({ contentId: "social_media_visibility_check" });
  }

  if (photoSharing === "often" || photoSharing === "sometimes") {
    out.push({ contentId: "photo_video_sharing" });
  }

  if (
    onlineContacts === "mixed_friends_and_online" ||
    onlineContacts === "mostly_online_people" ||
    onlineContacts === "not_sure"
  ) {
    out.push({ contentId: "chat_and_contacts" });
  }

  if (
    gamingChat === "yes_voice_chat" ||
    gamingChat === "yes_text_chat"
  ) {
    out.push({ contentId: "gaming_and_chat" });
  }

  if (publicWifi === "often" || publicWifi === "sometimes") {
    out.push({ contentId: "public_wifi" });
  }

  out.push({ contentId: "healthy_digital_habits" });

  return uniqueByKey(out).map((topic) => ({
    contentId: topic.contentId,
    topicKey: `guidance.behavior.${topic.contentId}.topic`,
    adviceKey: `guidance.behavior.${topic.contentId}.advice`
  }));
}

/* -----------------------
 * 4) Conversation tips
 * ----------------------- */

function buildConversationTips(answers) {
  const age = answers?.age || null;
  const incidents = answers?.online_incidents;

  const toneVariant =
    incidents === "yes"
      ? "supportive"
      : "calm";

  const phraseKeys = [
    "guidance.conversation.base.1",
    "guidance.conversation.base.2",
    "guidance.conversation.base.3",
    ...(isYoungerAge(age)
      ? [
          "guidance.conversation.younger.1",
          "guidance.conversation.younger.2"
        ]
      : []),
    ...(isTeen(age)
      ? [
          "guidance.conversation.teen.1",
          "guidance.conversation.teen.2"
        ]
      : []),
    ...(incidents === "yes"
      ? [
          "guidance.conversation.incident.1",
          "guidance.conversation.incident.2"
        ]
      : [])
  ].slice(0, 6);

  return {
    toneKey: `guidance.conversation.tone.${toneVariant}`,
    examplePhraseKeys: phraseKeys
  };
}

/* -----------------------
 * Public API
 * ----------------------- */

export function buildGuidance(assessment, answers) {
  return {
    immediate_actions: buildImmediateActions(assessment),
    device_specific_recommendations: buildDeviceGuidance(answers),
    online_behavior_guidance: buildBehaviorGuidance(answers),
    parent_child_conversation_tips: buildConversationTips(answers)
  };
}