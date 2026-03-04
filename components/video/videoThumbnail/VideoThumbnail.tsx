"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import type { FC } from "react";

type Props = {
  thumbnail?: string | null;
};

export const VideoThumbnail: FC<Props> = ({ thumbnail }) => {
  return (
    <div className="relative h-70 md:min-w-100 w-full overflow-hidden rounded-lg bg-black">
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt="video thumbnail"
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}

      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60">
          <Play className="size-6 fill-black/80 text-transparent" />
        </div>
      </div>
    </div>
  );
};
