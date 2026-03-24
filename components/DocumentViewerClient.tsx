"use client";

import { File } from "@/types/types";
import {
  type FC,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { LoadingLayer } from "./loading-layer/LoadingLayer";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

type Props = {
  selectedPdf: File;
  setSelectedPdf: (value: SetStateAction<File | null>) => void;
};

export const DocumentViewerClient: FC<Props> = ({
  selectedPdf,
  setSelectedPdf,
}) => {
  const [numPages, setNumPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(600);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    ro.observe(node);

    return () => ro.disconnect();
  }, []);

  const handleClose = () => {
    setSelectedPdf(null);
    setIsLoading(true);
    setNumPages(0);
  };

  const pdfUrl = selectedPdf.signed_url;

  return (
    <Dialog
      open={!!selectedPdf}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="h-[90dvh] max-w-full bg-transparent p-0 sm:max-w-full">
        <DialogTitle className="text-white">Pdf file</DialogTitle>

        <div
          ref={containerRef}
          className="h-[calc(100dvh-4.5rem)] w-screen overflow-y-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {isLoading && <LoadingLayer className="mx-auto w-screen" />}

          <Document
            key={selectedPdf.sk}
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setIsLoading(false);
            }}
            onLoadError={(error) => {
              console.error("PDF load error:", error);
              setIsLoading(false);
            }}
            loading={null}
            error={
              <p className="p-8 text-center text-red-400">
                Không thể tải file PDF.
              </p>
            }
          >
            {Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                width={containerWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="mx-auto"
              />
            ))}
          </Document>
        </div>
      </DialogContent>
    </Dialog>
  );
};
