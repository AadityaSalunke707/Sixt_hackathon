type Props = { verdict: string };
export default function VerdictBadge({ verdict }: Props) {
  const v = ['PASS','FAIL','UNCERTAIN'].includes(verdict) ? verdict : 'UNCERTAIN';
  return <wa-badge pill variant={v==='PASS'?'success':v==='FAIL'?'danger':'warning'}>{v}</wa-badge>;
}
