// frontend/src/mock/mockReport.js

export const mockReport = {
  summary: {
    risk_score: 72,
    risk_level: "High",
    short_overview:
      "Your child uses an Android phone with limited safety protections. Some settings like screen lock, app approvals, and privacy controls are not fully enabled, which increases exposure to strangers, scams, and inappropriate content. This report highlights the most important steps to improve safety in a gentle and practical way."
  },

  key_risks: [
    {
      title: "Device has no screen lock or PIN",
      description:
        "If the phone is lost or someone else picks it up, they can access photos, messages, apps, or private data without barriers.",
      severity: "High"
    },
    {
      title: "Apps can be installed without approval",
      description:
        "Your child could accidentally install risky apps, including those designed for secret chats or containing harmful content.",
      severity: "High"
    },
    {
      title: "Social media accounts are not set to private",
      description:
        "Without private settings, strangers can view your child’s posts, send messages, or follow them.",
      severity: "Medium"
    },
    {
      title: "Use of public Wi-Fi without protection",
      description:
        "Public networks can expose the device to insecure connections and increase risks of data interception.",
      severity: "Medium"
    }
  ],

  immediate_actions: [
    {
      title: "Turn on a screen lock today",
      steps: [
        "Open the Settings app on the device.",
        "Go to 'Security' or 'Lock Screen'.",
        "Choose a PIN or pattern your child can remember.",
        "Explain that this protects them similar to locking a front door."
      ]
    },
    {
      title: "Enable app approval for new installs",
      steps: [
        "Install Google Family Link on your phone and your child’s device.",
        "Connect the accounts following on-screen instructions.",
        "Set 'App approvals' to require parent permission."
      ]
    }
  ],

  device_specific_recommendations: [
    {
      device_type: "Android phone",
      tips: [
        "Turn off installation from unknown sources in Settings > Security.",
        "Enable Google Play Protect to scan apps for harmful behaviour.",
        "Review which apps have location access and disable those that don't need it.",
        "Check permissions for apps like TikTok, Instagram, or WhatsApp."
      ]
    }
  ],

  online_behavior_guidance: [
    {
      topic: "Social media safety",
      advice: [
        "Switch all accounts to 'Private' so only approved contacts can see posts.",
        "Disable location tagging on photos and videos.",
        "Help your child review their follower list and remove unknown people."
      ]
    },
    {
      topic: "Gaming and chat",
      advice: [
        "Teach your child not to share personal details in chat rooms.",
        "Disable voice chat if they play with strangers.",
        "Review chat logs together occasionally in a calm and supportive way."
      ]
    },
    {
      topic: "Public Wi-Fi",
      advice: [
        "Avoid using public Wi-Fi for messaging or social media when possible.",
        "If needed, disable automatic connection to open networks.",
        "Consider enabling a VPN (if the child is old enough to understand the concept)."
      ]
    }
  ],

  parent_child_conversation_tips: {
    tone: "Calm, encouraging, and non-judgmental",
    example_phrases: [
      "I want to make sure your phone feels safe for you. Can we look at some settings together?",
      "You’re not in trouble — I just want to understand what apps you use and how we can make them safer.",
      "If anyone online makes you feel uncomfortable or asks odd questions, you can always tell me. I’m here to support you, not punish you."
    ]
  },

  disclaimer:
    "This report is general guidance based on your answers. It is not legal, medical, or emergency advice. If you believe your child is in immediate danger, please contact local authorities or a child protection organization."
};
