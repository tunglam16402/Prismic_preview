"use client";
import type { File } from "@/types/types";
import {
  type FC,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { LoadingLayer } from "../loading-layer/LoadingLayer";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

type Props = {
  selectedPdf: File;
  setSelectedPdf: (value: SetStateAction<File | null>) => void;
};

export const DocumentViewer: FC<Props> = ({ selectedPdf, setSelectedPdf }) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setSelectedPdf(null);
    setIsLoading(false);
  };

  console.log("selectedPdf :>> ", selectedPdf);

  useEffect(() => {
    let cancelled = false;

    const renderPdf = async () => {
      setIsLoading(true);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const url = selectedPdf.signed_url;
        const pdf = await pdfjsLib.getDocument(url).promise;

        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "w-full xl:w-[50dvw] mb-2 xl:mx-auto";
          containerRef.current.appendChild(canvas);

          await page.render({
            canvas,
            canvasContext: canvas.getContext("2d")!,
            viewport,
          }).promise;
        }
      } catch (error) {
        console.error("Failed to render PDF:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void renderPdf();

    return () => {
      cancelled = true;
    };
  }, [selectedPdf]);
  return (
    <Dialog
      open={!!selectedPdf}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="h-[90dvh] max-w-full bg-transparent p-0 sm:max-w-full">
        <DialogTitle></DialogTitle>
        {isLoading && <LoadingLayer className="mx-auto mt-2" />}

        <div
          ref={containerRef}
          className="mt-2 h-[calc(100dvh-4.5rem)] w-full overflow-y-auto bg-white"
        />
      </DialogContent>
    </Dialog>
  );
};
