type Props={label:string,value:string,change:string,icon:string,tone?:'blue'|'green'|'amber'|'purple'};
export default function MetricCard({label,value,change,icon,tone='blue'}:Props){return <article className="metric-card"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}>{icon}</span></div><strong>{value}</strong><small>{change}</small></article>}
