import React, { PropsWithChildren } from "react";

export type Props = PropsWithChildren<{
  onDismiss: () => void;
}>;

export function Popup({ onDismiss, children }: Props) {
  return (
    <div
      className="absolute w-full h-full top-0 backdrop-blur-sm p-4 flex items-center"
      onClick={onDismiss}
    >
      <div className=" mx-auto border border-black bg-white/50 p-4 flex flex-col items-center gap-1">
        {children}
      </div>
    </div>
  );
}
