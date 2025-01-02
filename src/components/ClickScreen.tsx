export type Props = {
  onClick: () => void;
  label?: string;
};

export function ClickScreen({ onClick, label }: Props) {
  return (
    <div
      className="absolute w-full h-full top-0 flex flex-col gap-2 p-2"
      onClick={onClick}
    >
      {label || "Click to continue"}
    </div>
  );
}
