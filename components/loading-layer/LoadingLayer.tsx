import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import React, { type FC } from "react";

type Props = {
  className?: string;
};

export const LoadingLayer: FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-white/40",
        className,
      )}
    >
      <LoaderCircle className="size-8 animate-spin" />
    </div>
  );
};
