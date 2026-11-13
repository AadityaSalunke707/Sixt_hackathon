import { useState } from 'react';
import RunEvaluation from './pages/RunEvaluation';
import JudgeBuilder from './pages/JudgeBuilder';
import Recipe from './pages/Recipe';
import './person2.css';

/** Mount this inside the existing DashboardLayout. It owns only Person 2 tabs/pages. */
export default function Person2Workspace(){
 const [page,setPage]=useState<'evaluate'|'builder'|'recipe'>('evaluate');
 return <section className="p2-workspace">
  <header className="p2-page-heading"><div><div className="p2-eyebrow">JUDGECRAFT / WORKSPACE</div><h1>Evaluation Lab</h1><p>Configure the judging task, test one reply, and review the reusable recipe.</p></div><wa-badge variant="success" pill>Claude Haiku 4.5 target</wa-badge></header>
  <nav className="p2-tabs" aria-label="Evaluation workspace">
   <wa-button size="small" variant={page==='evaluate'?'brand':'neutral'} appearance={page==='evaluate'?'filled':'outlined'} onClick={()=>setPage('evaluate')}><wa-icon slot="start" name="play-circle"></wa-icon>Run evaluation</wa-button>
   <wa-button size="small" variant={page==='builder'?'brand':'neutral'} appearance={page==='builder'?'filled':'outlined'} onClick={()=>setPage('builder')}><wa-icon slot="start" name="sliders-horizontal"></wa-icon>Judge builder</wa-button>
   <wa-button size="small" variant={page==='recipe'?'brand':'neutral'} appearance={page==='recipe'?'filled':'outlined'} onClick={()=>setPage('recipe')}><wa-icon slot="start" name="book-open"></wa-icon>Recipe</wa-button>
  </nav>
  {page==='evaluate'&&<RunEvaluation/>}{page==='builder'&&<JudgeBuilder/>}{page==='recipe'&&<Recipe/>}
 </section>;
}
