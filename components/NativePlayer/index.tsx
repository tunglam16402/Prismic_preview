import React from "react";
import VideoPopupItem from "./VideoPopup";

export enum FileType {
  DOCUMENT = "document",
  IMAGE = "image",
  VIDEO = "video",
}

export interface File {
  url: string;
  sk: string;
  category: string;
  name: string;
  type: FileType;
}

export const mockFiles: File[] = [
  {
    sk: "video-1",
    name: "Big Buck Bunny",
    category: "nature",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    type: FileType.VIDEO,
  },
  {
    sk: "video-2",
    name: "Flower Slow Motion",
    category: "nature",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    type: FileType.VIDEO,
  },
  {
    sk: "video-3",
    name: "Sintel Trailer",
    category: "animation",
    url: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    type: FileType.VIDEO,
  },
  {
    sk: "video-4",
    name: "Bear WebM",
    category: "wildlife",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
    type: FileType.VIDEO,
  },
];

const NativePlayer = () => {
  const videoMockdata = mockFiles;
  return (
    <div className="mx-auto grid max-w-[80%] grid-cols-2 gap-3 xl:grid-cols-4">
      {videoMockdata
        .filter((file: File) => file.type === FileType.VIDEO)
        .map((file: File) => (
          <VideoPopupItem file={file} key={file.sk} />
        ))}
    </div>
  );
};

export default NativePlayer;
