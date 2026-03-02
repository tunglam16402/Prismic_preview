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
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);

    if (isAndroid) {
      // Android: Tạo một link tạm thời với intent
      const link = document.createElement("a");

      // Remove protocol
      const urlWithoutProtocol = file.url.replace(/^https?:\/\//, "");
      const mimeType = file.url.endsWith(".webm") ? "video/webm" : "video/mp4";

      // Intent URL format
      link.href = `intent://${urlWithoutProtocol}#Intent;action=android.intent.action.VIEW;type=${mimeType};end`;

      // Thêm vào DOM, click, rồi xóa
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Intent URL:", link.href);
    } else if (isIOS) {
      // iOS: Mở trực tiếp URL - Safari sẽ dùng player của nó
      const link = document.createElement("a");
      link.href = file.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Desktop
      window.open(file.url, "_blank");
    }
  };

  return (
    <div
      onClick={openInNativePlayer}
      className="group flex cursor-pointer flex-col items-center gap-5 p-2 py-10 shadow-xl hover:bg-gray-100 relative transition-all"
    >
      <div className="rounded-xl border p-3 shadow-sm w-full">
        <div className="relative flex h-40 w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.2),transparent_50%)]"></div>
          </div>

          {/* Play button with glow effect */}
          <div className="relative z-10">
            <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white bg-opacity-90 rounded-full p-6 group-hover:bg-opacity-100 group-hover:scale-110 transition-all duration-300 shadow-2xl">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Platform badge */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
            <span>Native</span>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <div className="text-sm font-semibold truncate text-gray-800 group-hover:text-blue-600 transition-colors">
            {file.name}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
              {file.url.endsWith(".webm") ? "WebM" : "MP4"}
            </span>
            <span>•</span>
            <span>Tap to play</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPopupItem;
