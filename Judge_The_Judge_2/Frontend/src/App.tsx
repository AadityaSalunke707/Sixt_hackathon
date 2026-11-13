
import { useState } from 'react';

import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import Diagnose from './pages/Diagnose';
import RunEvaluation from './pages/RunEvaluation';
import JudgeBuilder from './pages/JudgeBuilder';
import Recipe from './pages/Recipe';

import './dashboard.css';
import './person2.css';

export default function App() {
  const [active, setActive] = useState('Overview');

  let page;

  switch (active) {
    case 'Overview':
      page = <Overview />;
      break;

    case 'Analytics':
      page = <Analytics />;
      break;

    case 'Diagnose':
      page = <Diagnose />;
      break;

    case 'Run evaluation':
      page = <RunEvaluation />;
      break;

    case 'Judge builder':
      page = <JudgeBuilder />;
      break;

    default:
      page = <Recipe />;
  }

  return (
    <DashboardLayout
      active={active}
      onNavigate={setActive}
    >
      {page}
    </DashboardLayout>
  );
}
