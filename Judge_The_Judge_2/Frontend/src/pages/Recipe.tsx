const steps=[
 ['01','Diagnose failures','Run the starting judge and group false accepts and false rejects by language and edit family. Identify which semantic changes are missed.','Failure map'],
 ['02','Split deterministic checks from reasoning','Use code for reliably checkable facts such as exact numbers or structured constraints. Use the LLM for semantic interpretation and context.','Hybrid judge pipeline'],
 ['03','Improve the judge systematically','Use criterion-driven instructions, representative labelled examples, smaller atomic questions and bounded voting. Never exceed three LLM calls per reply.','Reusable judging method'],
 ['04','Validate on untouched cases','Freeze the recipe, run held-out cases twice, and report combined score, Cohen’s kappa, language breakdown and repeat consistency.','Reproducible results']
];
export default function Recipe(){
 return <div className="p2-content">
  <div className="page-intro"><div><h2>Reusable judge recipe</h2><p>A repeatable workflow intended to transfer to a new criterion without code changes.</p></div><wa-badge variant="brand">Methodology</wa-badge></div>
  <wa-callout variant="brand"><wa-icon slot="icon" name="workflow"></wa-icon><strong>Input-driven, not task-hardcoded.</strong> Criterion, policy and examples are runtime inputs. The evaluation procedure remains unchanged.</wa-callout>
  <div className="recipe-steps">{steps.map(([n,title,desc,out])=><article className="recipe-step" key={n}><span className="recipe-number">{n}</span><div><h3>{title}</h3><p>{desc}</p><small>OUTPUT · {out}</small></div></article>)}</div>
  <section className="form-card"><h3>Submission integrity checklist</h3><ul className="checklist">
   <li>Each judge call receives one candidate reply only.</li><li>No paired alternative, edit type or hidden label is sent to the judge.</li><li>Use claude-haiku-4.5 for submitted results.</li><li>Maximum three LLM calls per reply.</li><li>Surprise task changes inputs, not judge code.</li><li>Freeze final_judge.py before hidden cases are released.</li>
  </ul></section>
 </div>;
}
