// src/assessment/assess.js
import { QUESTION_CONFIG } from "./questionConfig";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function normalizeMulti(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") return val.split(",").map(s => s.trim()).filter(Boolean);
  return [];
}

/**
 * social_media risk scoring (multi-select):
 * - None => 0
 * - I'm not sure => 2
 * - Otherwise: more platforms => higher risk (capped)
 *   1 app => 2, 2 apps => 3, 3+ apps => 5
 */
function scoreSocialMedia(selected) {
  const arr = normalizeMulti(selected);
  if (arr.length === 0) return 2;            // unanswered => unknown
  if (arr.includes("None")) return 0;
  if (arr.includes("I'm not sure")) return 2;

  const n = arr.length;
  if (n === 1) return 2;
  if (n === 2) return 3;
  return 5;
}

export function assessSafety(answers) {
  const entries = Object.entries(QUESTION_CONFIG);

  // Max possible risk (only scored questions)
  const maxRisk = entries.reduce((sum, [, q]) => {
    if (q.scored === false) return sum;
    const w = q.weight ?? 1;

    if (q.type === "multi") return sum + 5 * w; // worst is 5
    const worst = Math.max(...Object.values(q.scoreMap ?? { ok: 0 }));
    return sum + worst * w;
  }, 0);

  // Per-question scoring
  const perQuestion = entries.map(([id, q]) => {
    const chosen = answers?.[id];

    if (q.scored === false) {
      return { id, title: q.title, domain: q.domain, chosen, scored: false, riskPoints: 0 };
    }

    const w = q.weight ?? 1;

    let base = 0;
    if (q.type === "multi") {
      base = scoreSocialMedia(chosen);
    } else {
      base =
        chosen == null
          ? (q.scoreMap?.["I'm not sure"] ?? 2)
          : (q.scoreMap?.[chosen] ?? 0);
    }

    return {
      id,
      title: q.title,
      domain: q.domain,
      chosen,
      scored: true,
      basePoints: base,
      weight: w,
      riskPoints: base * w,
    };
  });

  const totalRisk = perQuestion.reduce((s, r) => s + (r.riskPoints || 0), 0);
  const score = clamp(Math.round(100 * (1 - totalRisk / (maxRisk || 1))), 0, 100);

  const riskLevel =
  score >= 85 ? "Low" :
  score >= 70 ? "Medium" :
  "High";

  // Domain breakdown (scored only)
  const domainAgg = {};
  for (const r of perQuestion) {
    if (!r.scored) continue;
    const q = QUESTION_CONFIG[r.id];
    const w = q.weight ?? 1;

    const worst = q.type === "multi"
      ? 5
      : Math.max(...Object.values(q.scoreMap));

    if (!domainAgg[r.domain]) domainAgg[r.domain] = { risk: 0, max: 0 };
    domainAgg[r.domain].risk += r.riskPoints;
    domainAgg[r.domain].max += worst * w;
  }

  const domainScores = Object.entries(domainAgg)
    .map(([domain, v]) => ({
      domain,
      score: clamp(Math.round(100 * (1 - v.risk / (v.max || 1))), 0, 100),
    }))
    .sort((a, b) => a.score - b.score); // weakest first

  // Top risk drivers (scored only)
  const topRisks = perQuestion
    .filter(r => r.scored)
    .sort((a, b) => b.riskPoints - a.riskPoints)
    .slice(0, 5);

  // Context (for later phases, but harmless to include now)
  const context = {
    age: answers?.age ?? null,
    device_ownership: answers?.device_ownership ?? null,
    device_type: answers?.device_type ?? null,
  };

  return {
    score,
    riskLevel,
    domainScores,
    topRisks,
    context,
    _debug: { totalRisk, maxRisk },
  };
}