import VerdictBadge from './VerdictBadge';
import ScoreBreakdown, { type DimensionScore } from './ScoreBreakdown';
export type Evaluation = {
  verdict: string; overallScore: number | null; explanation: string;
  violations: string[]; evidence: string[]; improvements: string[]; scores: DimensionScore[];
};
function ResultList({title,items,empty}:{title:string;items:string[];empty:string}) {
  return <section className="result-section"><h4>{title}</h4>{items.length?<ul>{items.map((x,i)=><li key={i}>{x}</li>)}</ul>:<p className="muted">{empty}</p>}</section>;
}
export default function EvaluationResult({result}:{result:Evaluation}) {
  return <wa-card class="result-card">
    <div className="result-head"><div><div className="eyebrow">JUDGE DECISION</div><h2>Evaluation report</h2></div><VerdictBadge verdict={result.verdict}/></div>
    <div className="result-score"><strong>{result.overallScore??'—'}</strong><span>{result.overallScore==null?'Score not supplied':'/ 100'}</span></div>
    <section className="result-section"><h4>Explanation</h4><p>{result.explanation}</p></section>
    <div className="result-columns"><ResultList title="Violations / issues" items={result.violations} empty="The binary judge does not return issue details."/><ResultList title="Evidence" items={result.evidence} empty="The binary judge does not return evidence excerpts."/></div>
    <section className="result-section"><h4>Score breakdown</h4><ScoreBreakdown scores={result.scores}/></section>
    <ResultList title="Suggested improvements" items={result.improvements} empty="The binary judge does not generate improvement suggestions."/>
  </wa-card>;
}
