// src/guidance/buildGuidance.js

/**
 * buildGuidance(assessment, answers)
 *
 * Phase 2 (rules-based): Generates optional guidance sections that RiskReport.jsx can render:
 * - immediate_actions: [{ title, steps: [] }]
 * - device_specific_recommendations: [{ device_type, tips: [] }]
 * - online_behavior_guidance: [{ topic, advice: [] }]
 * - parent_child_conversation_tips: { tone, example_phrases: [] }
 *
 * Notes:
 * - Calm, non-judgmental tone
 * - Deterministic rules (no AI yet)
 * - Uses assessment.topRisks and answers context
 */

function asArray(val) {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function normalizeMulti(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string")
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function pickTopRiskIds(assessment, max = 3) {
  const topRisks = assessment?.topRisks ?? [];
  return topRisks.slice(0, max).map((r) => r.id);
}

function uniqueByTitle(actions) {
  const seen = new Set();
  const out = [];
  for (const a of actions) {
    const key = (a?.title || "").trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(a);
  }
  return out;
}

function deviceLabel(deviceType) {
  return deviceType || "Your device";
}

function isYoungerAge(age) {
  // very simple heuristic for optional wording
  return age === "Under 6" || age === "7–9";
}

function isTeen(age) {
  return age === "13–15" || age === "16–17";
}

/* -----------------------
 * 1) Immediate actions
 * ----------------------- */

function actionForRiskId(riskId, answers) {
  const deviceType = answers?.device_type;

  switch (riskId) {
    case "screen_lock":
      return {
        title: "Turn on a screen lock",
        steps: [
          "Open device Settings.",
          "Go to Security / Lock Screen (or Face ID / Touch ID / Passcode).",
          "Choose a PIN or passcode that your child can remember.",
          "Explain it like locking the front door — it protects photos, messages, and apps if the device is lost.",
        ],
      };

    case "app_install":
      return {
        title: "Require approval for app installs",
        steps: [
          "Enable family safety controls for the device (Screen Time / Family Link / Family Safety).",
          "Turn on app approvals (parent permission) for new installs.",
          "Review existing installed apps together and remove anything you don’t recognize.",
        ],
      };

    case "parental_controls":
      return {
        title: "Enable parental controls / family safety tools",
        steps: [
          "Turn on the built-in family safety features for the device.",
          "Set age-appropriate content restrictions and basic screen-time limits.",
          "Start simple — you can adjust later based on what works for your family.",
        ],
      };

    case "privacy_settings":
      return {
        title: "Set apps to Private / Friends-only",
        steps: [
          "Open the settings inside each social app your child uses.",
          "Set the account to Private (or Friends-only).",
          "Disable public profile visibility where possible.",
          "Review who can message/comment and limit to known contacts.",
        ],
      };

    case "unknown_callers":
      return {
        title: "Limit unknown callers and messages",
        steps: [
          "Enable spam/unknown caller filtering on the device.",
          "If available, use a contacts-only mode (or block unknown callers).",
          "Review messaging app privacy settings so only approved contacts can message.",
        ],
      };

    case "online_contacts":
      return {
        title: "Review who your child chats with online",
        steps: [
          "Ask your child to show the apps they use for chatting and gaming.",
          "Review the contact/friends list together and remove unknown people.",
          "Agree on a simple rule: no sharing personal details (school, address, schedules).",
        ],
      };

    case "gaming_chat":
      return {
        title: "Reduce exposure in game chat",
        steps: [
          "Check game privacy settings for chat and friend requests.",
          "Disable voice chat with strangers (or limit chat to friends).",
          "Remind your child not to share personal information in chats.",
        ],
      };

    case "public_wifi":
      return {
        title: "Make public Wi-Fi use safer",
        steps: [
          "Turn off auto-join for open Wi-Fi networks.",
          "Avoid logging into sensitive accounts on public Wi-Fi when possible.",
          "If your family uses public Wi-Fi often, consider a reputable VPN later (optional).",
        ],
      };

    case "photo_sharing":
      return {
        title: "Reduce privacy exposure from photo/video sharing",
        steps: [
          "Disable location tagging in the camera and social apps.",
          "Set who can view posts to Friends-only/Private.",
          "Agree on a ‘pause and check’ habit: ask a parent before posting personal photos.",
        ],
      };

    case "app_review":
      return {
        title: "Set a simple routine to review installed apps",
        steps: [
          "Once a month, review installed apps together for 5 minutes.",
          "Remove apps your child doesn’t use or that feel uncomfortable.",
          "Check app permissions (location, camera, microphone) and turn off what isn’t needed.",
        ],
      };

    case "online_incidents":
      return {
        title: "Create a safe reporting path for incidents",
        steps: [
          "Let your child know they can tell you about bullying or unwanted messages without getting in trouble.",
          "Save evidence (screenshots) if something concerning happens.",
          "Block/report accounts within the app, and consider adjusting privacy settings afterward.",
        ],
      };

    case "social_media":
      return {
        title: "Review social media exposure",
        steps: [
          "Check which platforms are used and what the profiles look like from an outsider view.",
          "Set accounts to Private/Friends-only and limit who can message.",
          "Review followers/friends and remove unknown contacts.",
        ],
      };

    default:
      return null;
  }
}

function buildImmediateActions(assessment, answers) {
  // Base actions from top risks (most impactful first)
  const topIds = pickTopRiskIds(assessment, 4);

  const actions = topIds
    .map((id) => actionForRiskId(id, answers))
    .filter(Boolean);

  // If assessment is high risk or there are no top risks, add a safe baseline
  if (actions.length === 0) {
    actions.push({
      title: "Start with a quick safety check",
      steps: [
        "Confirm the device has a screen lock.",
        "Review privacy settings on the main apps.",
        "Check that app installs require parent approval (where available).",
      ],
    });
  }

  // Keep it short and doable: max 3 actions
  return uniqueByTitle(actions).slice(0, 3);
}

/* -----------------------
 * 2) Device-specific tips
 * ----------------------- */

function buildDeviceGuidance(answers) {
  const type = answers?.device_type || "";
  const tips = [];

  if (type.includes("Android")) {
    tips.push(
      "Enable Google Play Protect (built-in app scanning).",
      "Disable installation from unknown sources (sideloading).",
      "Review app permissions (location, camera, microphone) and disable what isn’t needed.",
      "Consider using Google Family Link for approvals and limits."
    );
  } else if (type.includes("iPhone") || type.includes("iPad")) {
    tips.push(
      "Enable Screen Time for content restrictions and app limits.",
      "Use ‘Communication Limits’ to reduce unknown contact.",
      "Turn off AirDrop from ‘Everyone’ (use Contacts Only).",
      "Review app permissions (Location Services, Photos, Microphone)."
    );
  } else if (type.includes("Windows")) {
    tips.push(
      "Use a standard (non-admin) account for the child.",
      "Enable Microsoft Family Safety for filters and limits.",
      "Keep Windows updates and Microsoft Defender enabled.",
      "Turn on browser protections (SmartScreen) and safe browsing features."
    );
  } else if (type.includes("MacBook")) {
    tips.push(
      "Use Screen Time on macOS for app limits and content restrictions.",
      "Ensure the child uses a standard user account (not admin).",
      "Keep macOS updates enabled.",
      "Review privacy permissions in System Settings (Location, Camera, Microphone)."
    );
  } else if (type.includes("Game console")) {
    tips.push(
      "Enable the console’s parental controls and set a PIN.",
      "Restrict voice chat with strangers (friends-only is safer).",
      "Limit friend requests and messages to known contacts.",
      "Review privacy settings and online play permissions."
    );
  } else {
    tips.push(
      "Ensure a screen lock is enabled.",
      "Keep automatic updates on.",
      "Review app permissions and privacy settings regularly."
    );
  }

  return [
    {
      device_type: deviceLabel(type),
      tips,
    },
  ];
}

/* -----------------------
 * 3) Online behaviour guidance
 * ----------------------- */

function buildBehaviorGuidance(assessment, answers) {
  const out = [];

  const social = normalizeMulti(answers?.social_media);
  const photoSharing = answers?.photo_sharing;
  const onlineContacts = answers?.online_contacts;
  const gamingChat = answers?.gaming_chat;
  const publicWifi = answers?.public_wifi;

  // Social media safety
  const usesSocial =
    social.length > 0 &&
    !social.includes("None") &&
    !social.includes("I'm not sure");

  if (usesSocial) {
    out.push({
      topic: "Social media safety",
      advice: [
        "Set profiles to Private/Friends-only where possible.",
        "Disable location tagging for posts and stories.",
        "Review followers/friends together and remove unknown people.",
        "Limit who can message your child (friends-only is safest).",
      ],
    });
  } else if (social.includes("I'm not sure")) {
    out.push({
      topic: "Social media visibility check",
      advice: [
        "Ask your child which apps they use to post or message friends.",
        "Check whether any accounts are public and switch to Private/Friends-only if needed.",
      ],
    });
  }

  // Photos/videos
  if (photoSharing === "Often" || photoSharing === "Sometimes") {
    out.push({
      topic: "Photo & video sharing",
      advice: [
        "Avoid sharing personal details in photos (school name, street signs, schedules).",
        "Turn off location in the camera app and in social apps.",
        "Agree on a simple rule: ask before posting a new photo/video.",
      ],
    });
  }

  // Online contacts
  if (
    onlineContacts === "Mixed (friends + online people)" ||
    onlineContacts === "Mostly online people" ||
    onlineContacts === "I'm not sure"
  ) {
    out.push({
      topic: "Chat and contacts",
      advice: [
        "Keep friend lists to people your child knows in real life when possible.",
        "Teach a clear rule: never share address, school, phone number, or meeting plans online.",
        "Encourage your child to tell you if someone makes them uncomfortable.",
      ],
    });
  }

  // Gaming chat
  if (
    gamingChat === "Yes, with voice chat" ||
    gamingChat === "Yes, with text chat"
  ) {
    out.push({
      topic: "Gaming and chat",
      advice: [
        "Limit chat to friends-only where the game allows it.",
        "Disable voice chat with strangers (or use party chat with real friends).",
        "Remind your child: no personal details in chat, ever.",
      ],
    });
  }

  // Public Wi-Fi
  if (publicWifi === "Often" || publicWifi === "Sometimes") {
    out.push({
      topic: "Public Wi-Fi",
      advice: [
        "Turn off auto-join for open Wi-Fi networks.",
        "Avoid logging into sensitive accounts on public Wi-Fi when possible.",
        "If public Wi-Fi is frequent, consider a reputable VPN later (optional).",
      ],
    });
  }

  // Universal core safety habits (always helpful, not fear-based)
  out.push({
    topic: "Healthy digital safety habits",
    advice: [
      "Only answer calls or messages from people you recognize, or check with a parent first.",
      "Share photos or videos only with people you know and trust in real life.",
      "If a message asks you to act quickly or keep secrets, pause and involve a parent.",
      "Only accept new chat contacts if you know them personally.",
      "If you’re unsure whether someone online is real, verify together with a parent.",
      "If something feels unusual or uncomfortable, tell a parent — you won’t be in trouble.",
    ],
  });

  // If nothing triggered, keep it empty (RiskReport will hide the section)
  return out;
}

/* -----------------------
 * 4) Conversation tips
 * ----------------------- */

function buildConversationTips(assessment, answers) {
  const age = answers?.age || null;
  const incidents = answers?.online_incidents;

  const tone =
    incidents === "Yes"
      ? "Calm, supportive, and reassuring"
      : "Calm, encouraging, and non-judgmental";

  const basePhrases = [
    "I want your device to feel safe for you — can we look at a few settings together?",
    "You’re not in trouble. I’m here to support you if anything online feels weird or uncomfortable.",
    "If someone online asks personal questions, what do you think is a safe response?",
  ];

  const youngerAdditions = [
    "If a stranger sends a message, what should we do together?",
    "It’s always okay to tell me — even if you clicked something by accident.",
  ];

  const teenAdditions = [
    "If someone pressures you to share photos or meet up, you can tell me — I’ll help, not judge.",
    "Let’s agree on what’s okay to share online and what stays private.",
  ];

  const incidentAdditions =
    incidents === "Yes"
      ? [
          "Thank you for telling me. You did the right thing — we’ll handle it together.",
          "Let’s save evidence (screenshots) and block/report the account if needed.",
        ]
      : [];

  const example_phrases = [
    ...basePhrases,
    ...(isYoungerAge(age) ? youngerAdditions : []),
    ...(isTeen(age) ? teenAdditions : []),
    ...incidentAdditions,
  ].slice(0, 6); // keep it short

  return { tone, example_phrases };
}

/* -----------------------
 * Public API
 * ----------------------- */

export function buildGuidance(assessment, answers) {
  return {
    immediate_actions: buildImmediateActions(assessment, answers),
    device_specific_recommendations: buildDeviceGuidance(answers),
    online_behavior_guidance: buildBehaviorGuidance(assessment, answers),
    parent_child_conversation_tips: buildConversationTips(assessment, answers),
  };
}