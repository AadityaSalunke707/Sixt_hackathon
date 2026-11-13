type Props = { value: string; onChange: (value: string) => void };
export default function CriterionEditor({ value, onChange }: Props) {
  return <label className="field">
    <span className="field-label">Evaluation criterion</span>
    <textarea rows={4} value={value} onChange={e => onChange(e.target.value)} placeholder="Describe what a good reply must satisfy…"/>
    <small>This remains an input so the surprise criterion can be supplied without changing code.</small>
  </label>;
}
