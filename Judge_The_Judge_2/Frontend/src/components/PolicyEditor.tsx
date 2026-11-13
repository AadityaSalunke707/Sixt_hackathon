type Props = { value: string; onChange: (value: string) => void };
export default function PolicyEditor({ value, onChange }: Props) {
  return <label className="field">
    <span className="field-label">Company policy</span>
    <textarea rows={6} value={value} onChange={e => onChange(e.target.value)} placeholder="Paste the authoritative company policy…"/>
    <small>Use the supplied policy as the source of truth.</small>
  </label>;
}
