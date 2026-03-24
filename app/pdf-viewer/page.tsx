"use client";

import { useState } from "react";
import type { File } from "@/types/types";
import { DocumentViewer } from "@/components/document-viewer/DocumentViewer";

export default function PdfViewerPage() {
  const signedUrl =
    "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);

  const handleOpen = () => {
    setSelectedPdf({
      sk: `test-doc-${Date.now()}`,
      name: "Test PDF",
      signed_url: signedUrl,
      url: signedUrl,
      pin: false,
      thumbnailUrl: "",
    } as File);
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">PDF Viewer Page</h1>

      <button
        className="mb-6 rounded bg-blue-600 px-4 py-2 text-white"
        onClick={handleOpen}
      >
        Open PDF
      </button>

      {selectedPdf && (
        <DocumentViewer
          selectedPdf={selectedPdf}
          setSelectedPdf={setSelectedPdf}
        />
      )}
    </div>
  );
}
