export type Props = {
  isBlocked?: boolean;
};

export function CardPlaceholder({ isBlocked }: Props) {
  return (
    <div className="w-[160px] h-[220px] flex p-8">
      <div className="grow border-4 border-slate-400  border-dashed rounded-lg">
        {isBlocked && "❌"}
      </div>
    </div>
  );
}
