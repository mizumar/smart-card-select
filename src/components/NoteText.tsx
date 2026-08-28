// components/NoteText.tsx
type NoteTextProps = {
  text?: string;
};

export default function NoteText({ text = "" }: NoteTextProps) {
  const match = text.match(/^(.*?)(?:\s+※(\d+))?$/);

  if (!match) {
    return <>{text}</>;
  }

  const [, label, note] = match;

  return (
    <>
      {label}
      {note && <span className="ml-0.5 text-[8px] align-super">※{note}</span>}
    </>
  );
}
