export type DimensionScore = { name: string; score: number | null; detail?: string };
export default function ScoreBreakdown({ scores }: { scores: DimensionScore[] }) {
  if (!scores.length) return <p className="muted">The API did not return dimension-level scores.</p>;
  return <div className="score-list">{scores.map((s,i)=><div className="score-item" key={`${s.name}-${i}`}>
    <div className="score-label"><strong>{s.name}</strong><span>{s.score==null?'—':`${s.score}/100`}</span></div>
    <div className="progress"><span style={{width:`${s.score??0}%`}}/></div>
    {s.detail&&<small>{s.detail}</small>}
  </div>)}</div>;
}
