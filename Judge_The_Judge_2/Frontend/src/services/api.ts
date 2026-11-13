import type { Evaluation } from '../components/EvaluationResult';
import type { LabelledExample } from '../components/ExampleManager';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');
const EVALUATE_PATH = import.meta.env.VITE_EVALUATE_PATH || '/api/evaluate';

type Payload = {
  criterion: string;
  policy: string;
  prompt?: string;
  reply: string;
  language?: string;
  examples: LabelledExample[];
};

type ApiObject = Record<string, unknown>;

function list(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => typeof item === 'string' ? item : JSON.stringify(item));
  }
  if (value == null || value === '') return [];
  return [String(value)];
}

function score(value: unknown): number | null {
  if (value == null || value === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : null;
}

function normalize(data: ApiObject): Evaluation {
  const rawVerdict = String(data.verdict || data.label || data.decision || 'UNCERTAIN').toUpperCase();
  const verdict = ['PASS', 'FAIL', 'UNCERTAIN'].includes(rawVerdict) ? rawVerdict : 'UNCERTAIN';
  const scoreMap = (data.scores || data.dimension_scores || {}) as Record<string, unknown>;

  const scores = Object.entries(scoreMap).map(([name, value]) => {
    const item = (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>;
    return {
      name: name.replaceAll('_', ' ').replace(/\\b\\w/g, (letter) => letter.toUpperCase()),
      score: score(typeof value === 'object' && value !== null ? item.score : value),
      detail: String(item.explanation || item.reason || ''),
    };
  });

  return {
    verdict,
    overallScore: score(data.overall_score ?? data.score ?? data.total_score),
    explanation: String(data.explanation || data.reasoning || data.rationale || 'No explanation returned.'),
    violations: list(data.violations || data.issues || data.mistakes),
    evidence: list(data.evidence || data.supporting_evidence),
    improvements: list(data.suggested_improvements || data.improvements),
    scores,
  };
}

export async function evaluateReply(payload: Payload): Promise<Evaluation> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${EVALUATE_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Cannot reach the backend. Start the API at http://localhost:8000 and try again.');
  }

  const responseText = await response.text();
  let data: ApiObject = {};
  try {
    data = responseText ? JSON.parse(responseText) as ApiObject : {};
  } catch {
    throw new Error('Backend returned non-JSON. Check the API route and server logs.');
  }

  if (!response.ok) {
    throw new Error(String(data.detail || data.error || `Evaluation failed (${response.status}).`));
  }
  return normalize(data);
}
