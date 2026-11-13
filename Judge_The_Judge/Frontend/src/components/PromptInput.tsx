type Props = { value: string; onChange: (value: string) => void };
export default function PromptInput({ value, onChange }: Props) {
  return <label className="field">
    <span className="field-label">Original customer prompt <span className="optional">Optional context</span></span>
    <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder="What did the customer ask?"/>
    <small>The judge receives this context with one candidate reply. Never include its paired alternative or hidden label.</small>
  </label>;
}
