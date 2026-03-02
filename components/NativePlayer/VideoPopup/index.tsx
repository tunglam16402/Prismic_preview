"use client";

import React from "react";
import { FileType } from "..";

export interface File {
  url: string;
  sk: string;
  category: string;
  name: string;
  type: FileType;
}

interface VideoPopupItemProps {
  file: File;
}

const VideoPopupItem: React.FC<VideoPopupItemProps> = ({ file }) => {
  const openInNativePlayer = () => {
    if (!file.url) return;

    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);

    // ✅ Cách ổn định nhất cho Web
    if (isIOS) {
      // iOS Safari sẽ tự dùng AVPlayer khi mở trực tiếp file
      window.location.href = file.url;
    } else {
      // Android + Desktop
      window.open(file.url, "_self");
    }
  };

  return (
    <div
      onClick={openInNativePlayer}
      className="group flex cursor-pointer flex-col items-center gap-5 p-2 py-10 shadow-xl hover:bg-gray-100 relative transition-all"
    >
      <div className="rounded-xl border p-3 shadow-sm w-full">
        <div className="relative flex h-40 w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 overflow-hidden">
          <div className="relative z-10">
            <div className="relative bg-white rounded-full p-6 shadow-2xl">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
            Native
          </div>
        </div>

        <div className="mt-3">
          <div className="text-sm font-semibold truncate">{file.name}</div>
        </div>
      </div>
    </div>
  );
};

export default VideoPopupItem;
