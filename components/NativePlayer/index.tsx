"use client";

import React, { useState } from "react";
import { VideoPopup } from "../video/videoPopup/VideoPopup";
import { VideoCard } from "../video/video-card/VideoCard";

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
  thumbnail: string;
}

export const mockFiles: File[] = [
  {
    sk: "video-1",
    name: "Big Buck Bunny",
    category: "nature",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    type: FileType.VIDEO,
    thumbnail: "",
  },
  {
    sk: "video-2",
    name: "Flower Slow Motion",
    category: "nature",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    type: FileType.VIDEO,
    thumbnail: "",
  },
  {
    sk: "video-3",
    name: "Sintel Trailer",
    category: "animation",
    url: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    type: FileType.VIDEO,
    thumbnail: "",
  },
  {
    sk: "video-4",
    name: "Bear WebM",
    category: "wildlife",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
    type: FileType.VIDEO,
    thumbnail: "",
  },
];

const NativePlayer = () => {
  const [openVideo, setOpenVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const handleOpenVideoPopup = (file: File) => {
    setSelectedVideo(file);
    setOpenVideo(true);
  };
  const videoMockdata = mockFiles;
  return (
    <>
      <div className="mx-auto mt-2 flex flex-wrap gap-3 sm:max-w-[60%] md:max-w-[90%]">
        {videoMockdata.map((file: File) => (
          <div key={file.sk} onClick={() => handleOpenVideoPopup(file)}>
            <VideoCard file={file} />
          </div>
        ))}
      </div>

      <VideoPopup
        open={openVideo}
        onClose={() => setOpenVideo(false)}
        url={selectedVideo?.url ?? null}
        title={selectedVideo?.name}
      />
    </>
  );
};

export default NativePlayer;
