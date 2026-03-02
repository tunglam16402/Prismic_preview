import React from "react";

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
          <a
            key={file.sk}
            href={`${file.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex cursor-pointer flex-col items-center gap-5 p-2 py-10 shadow-xl hover:bg-gray-100"
          >
            <div className="rounded-xl border p-3 shadow-sm">
              <div className="relative flex h-40 w-full items-center justify-center rounded-lg bg-black">
                <span className="text-3xl text-white">▶</span>
              </div>

              <div className="mt-2 text-sm font-medium">{file.name}</div>
              <div className="text-xs text-gray-400">WEBM Video</div>
            </div>
          </a>
        ))}
    </div>
  );
};

export default NativePlayer;
