"use client";
import { type FC } from "react";
import { VideoThumbnail } from "../videoThumbnail/VideoThumbnail";
import { File } from "@/components/NativePlayer";

type Props = {
  file: File;
};
export const VideoCard: FC<Props> = ({ file }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative w-full">
        <VideoThumbnail thumbnail={file?.thumbnail} />
      </div>

      <p className="mt-2 line-clamp-2 text-sm">{file.name}</p>
    </div>
  );
};
