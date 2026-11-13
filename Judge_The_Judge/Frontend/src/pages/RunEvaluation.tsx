import { useState, type FormEvent } from 'react';
import PromptInput from '../components/PromptInput';
import PolicyEditor from '../components/PolicyEditor';
import CriterionEditor from '../components/CriterionEditor';
import ExampleManager, { type LabelledExample } from '../components/ExampleManager';
import EvaluationResult, { type Evaluation } from '../components/EvaluationResult';
import { evaluateReply } from '../services/api';

const defaultCriterion = 'Evaluate whether the reply is accurate, relevant, complete, and consistent with the company policy. Reject replies that omit material conditions or make stronger promises than the policy permits. Accept harmless wording changes that preserve meaning.';
const defaultPolicy = 'Rental extensions are subject to vehicle availability. Customers can request an extension in the app or by phone. An extension can only be confirmed if the vehicle is not reserved for another customer.';
export default function RunEvaluation() {
  const [criterion,setCriterion]=useState(defaultCriterion);
  const [policy,setPolicy]=useState(defaultPolicy);
  const [prompt,setPrompt]=useState('Can I keep the car a few days longer?');
  const [reply,setReply]=useState('You can usually extend your rental in the app or by phone, as long as the car is not reserved for another customer.');
  const [examples,setExamples]=useState<LabelledExample[]>([]);
  const [result,setResult]=useState<Evaluation|null>(null);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  async function handleSubmit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(''); setResult(null);
    if(!criterion.trim()||!policy.trim()||!reply.trim()){setError('Criterion, policy and candidate reply are required.');return;}
    setLoading(true);
    try { setResult(await evaluateReply({criterion:criterion.trim(),policy:policy.trim(),prompt:prompt.trim(),reply:reply.trim(),examples})); }
    catch(err){setError(err instanceof Error?err.message:'Evaluation request failed.');}
    finally{setLoading(false);}
  }
  return <div className="p2-content">
    <div className="page-intro"><div><h2>Run an evaluation</h2><p>Submit one candidate reply at a time and inspect the judge's decision.</p></div><wa-badge variant="brand">Single-reply mode</wa-badge></div>
    <wa-callout variant="neutral"><wa-icon slot="icon" name="shield-check"></wa-icon><strong>Evaluation integrity:</strong> the judge receives one reply only—not its paired alternative, edit category or hidden label.</wa-callout>
    <form onSubmit={handleSubmit} className="evaluation-form">
      <section className="form-card"><div className="card-heading"><span>01</span><div><h3>Judging context</h3><p>Provide criterion and policy for this task.</p></div></div>
        <CriterionEditor value={criterion} onChange={setCriterion}/>
        <PromptInput value={prompt} onChange={setPrompt}/>
        <PolicyEditor value={policy} onChange={setPolicy}/>
      </section>
      <section className="form-card"><div className="card-heading"><span>02</span><div><h3>Candidate reply</h3><p>Paste only the one response you want evaluated.</p></div></div>
        <label className="field"><span className="field-label">AI-generated reply</span><textarea rows={5} required value={reply} onChange={e=>setReply(e.target.value)} placeholder="Paste one customer-support reply…"/></label>
        <div className="char-count">{reply.length} characters</div>
      </section>
      <section className="form-card"><div className="card-heading"><span>03</span><div><h3>Calibration examples <span className="optional">Optional</span></h3><p>Supply a few labelled examples for the current criterion.</p></div></div>
        <ExampleManager examples={examples} onChange={setExamples}/>
      </section>
      {error&&<wa-callout variant="danger"><wa-icon slot="icon" name="circle-alert"></wa-icon>{error}</wa-callout>}
      <div className="submit-row"><span className="muted">The required model is configured by the backend: claude-haiku-4.5.</span><wa-button type="submit" variant="brand" size="large" disabled={loading}>{loading?'Evaluating…':'Evaluate reply'}<wa-icon slot="end" name="arrow-right"></wa-icon></wa-button></div>
    </form>
    {loading&&<div className="loading"><wa-spinner></wa-spinner><div><strong>Judge is evaluating this reply</strong><p>Checking the candidate against the supplied criterion and policy.</p></div></div>}
    {result&&<EvaluationResult result={result}/>}
  </div>;
}
