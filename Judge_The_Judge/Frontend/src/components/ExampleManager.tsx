import { useState } from 'react';
export type LabelledExample = { reply: string; verdict: 'PASS' | 'FAIL'; rationale?: string };
type Props = { examples: LabelledExample[]; onChange: (items: LabelledExample[]) => void };

export default function ExampleManager({ examples, onChange }: Props) {
  const [reply, setReply] = useState('');
  const [verdict, setVerdict] = useState<'PASS'|'FAIL'>('FAIL');
  const [rationale, setRationale] = useState('');
  const add = () => {
    if (!reply.trim()) return;
    onChange([...examples, { reply: reply.trim(), verdict, rationale: rationale.trim() }]);
    setReply(''); setRationale('');
  };
  return <section className="examples">
    <div className="section-title"><div><h3>Labelled examples</h3><p>Optional examples are task inputs, not hard-coded rules.</p></div><wa-badge>{examples.length} added</wa-badge></div>
    <label className="field"><span className="field-label">Example reply</span><textarea rows={2} value={reply} onChange={e=>setReply(e.target.value)} placeholder="Paste one labelled reply…"/></label>
    <div className="example-controls">
      <label className="field"><span className="field-label">Label</span><select value={verdict} onChange={e=>setVerdict(e.target.value as 'PASS'|'FAIL')}><option value="FAIL">FAIL</option><option value="PASS">PASS</option></select></label>
      <label className="field"><span className="field-label">Rationale (optional)</span><input value={rationale} onChange={e=>setRationale(e.target.value)} placeholder="Why is this label correct?"/></label>
    </div>
    <wa-button size="small" appearance="outlined" variant="neutral" onClick={add}><wa-icon slot="start" name="plus"></wa-icon>Add example</wa-button>
    {examples.map((ex,i)=><div className="example-row" key={i}>
      <div><wa-badge variant={ex.verdict==='PASS'?'success':'danger'}>{ex.verdict}</wa-badge><p>{ex.reply}</p>{ex.rationale&&<small>{ex.rationale}</small>}</div>
      <wa-button size="small" appearance="plain" variant="danger" onClick={()=>onChange(examples.filter((_,n)=>n!==i))}><wa-icon name="trash-2"></wa-icon></wa-button>
    </div>)}
  </section>;
}
