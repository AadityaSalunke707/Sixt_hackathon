import { useState } from 'react';
import CriterionEditor from '../components/CriterionEditor';
import PolicyEditor from '../components/PolicyEditor';
import ExampleManager, { type LabelledExample } from '../components/ExampleManager';
export default function JudgeBuilder() {
  const [criterion,setCriterion]=useState('Evaluate whether a customer-support reply satisfies the provided criterion and company policy. Detect material omissions, unsupported claims and over-promising. Accept harmless wording changes that preserve meaning.');
  const [policy,setPolicy]=useState('Rental extensions are subject to vehicle availability. Customers can request an extension in the app or by phone. An extension can only be confirmed if the vehicle is not reserved for another customer.');
  const [examples,setExamples]=useState<LabelledExample[]>([]);
  const [notice,setNotice]=useState(false);
  function exportConfig(){
    const blob=new Blob([JSON.stringify({criterion,policy,examples},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a');
    a.href=url;a.download='judge-configuration.json';a.click();URL.revokeObjectURL(url);setNotice(true);
  }
  return <div className="p2-content">
    <div className="page-intro"><div><h2>Judge builder</h2><p>Configure the judge using runtime inputs, without embedding criterion-specific logic in code.</p></div><wa-badge variant="success">Reusable setup</wa-badge></div>
    <wa-callout variant="warning"><wa-icon slot="icon" name="lightbulb"></wa-icon>For the surprise task, change only the criterion, policy and labelled examples. Keep the judging procedure unchanged.</wa-callout>
    <section className="form-card"><div className="card-heading"><span>01</span><div><h3>Evaluation criterion</h3><p>What does a compliant response need to do?</p></div></div><CriterionEditor value={criterion} onChange={v=>{setCriterion(v);setNotice(false)}}/></section>
    <section className="form-card"><div className="card-heading"><span>02</span><div><h3>Company policy</h3><p>Authoritative facts and constraints for the task.</p></div></div><PolicyEditor value={policy} onChange={v=>{setPolicy(v);setNotice(false)}}/></section>
    <section className="form-card"><div className="card-heading"><span>03</span><div><h3>Labelled examples</h3><p>Examples are supplied to the model as input, not encoded as special cases.</p></div></div><ExampleManager examples={examples} onChange={v=>{setExamples(v);setNotice(false)}}/></section>
    <div className="builder-footer"><div><strong>{examples.length} examples configured</strong><small>Export the current configuration as JSON.</small></div><wa-button variant="brand" onClick={exportConfig}><wa-icon slot="start" name="download"></wa-icon>Export configuration</wa-button></div>
    {notice&&<wa-callout variant="success"><wa-icon slot="icon" name="check-circle"></wa-icon>Configuration exported. This file is an input bundle; it does not alter the official final_judge.py runner.</wa-callout>}
  </div>;
}
