"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useRef, type FC } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  url: string | null;
  title?: string;
};

export const VideoPopup: FC<Props> = ({ open, onClose, url, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [open]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Dialog open={open} onOpenChange={(v: any) => !v && onClose()}>
      <DialogContent
        className="flex h-dvh w-screen max-w-full items-center justify-center bg-black sm:max-w-full p-0"
        // closeBtn={
        //   <button className="absolute top-0 right-2 cursor-pointer p-4 text-gray-300 hover:text-gray-100">
        //     <X className="size-7 md:size-8" />
        //   </button>
        // }
      >
        {title && (
          <div className="absolute top-0 left-0 w-full px-6 py-4 text-gray-300 md:px-8">
            <p className="max-w-[70%] truncate text-base font-medium md:max-w-[30%]">
              {title}
            </p>
          </div>
        )}

        {url && (
          <video
            ref={videoRef}
            src={url}
            controls
            autoPlay
            playsInline
            className="max-h-[80vh] md:max-w-[90vw] min-w-[50vw]"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
