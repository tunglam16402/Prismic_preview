"use client";

import { useState } from "react";
import type { File } from "@/types/types";
import { DocumentViewer } from "@/components/document-viewer/DocumentViewer";

export default function PdfViewerPage() {
  const signedUrl =
    "https://ska.oa.osim-martech.com/files/private/document/SG-DOC-1760684724_9_1761205061_MENVTb0mNT.pdf?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9za2Eub2Eub3NpbS1tYXJ0ZWNoLmNvbS9maWxlcy9wcml2YXRlL2RvY3VtZW50L1NHLURPQy0xNzYwNjg0NzI0XzlfMTc2MTIwNTA2MV9NRU5WVGIwbU5ULnBkZiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc3NDYwNTM1OX19fV19&Signature=URP7UrlyxBRyq1hxp1h7LsF7yoGO7r%7eEuzeddRz6XPNbXGeWdlXhAuR99gKLET286SDuqr3vVs3bQty3ps4gAP0DcBbO3jrk5oOfDZbqPQ1hA-bJO7HF6wyhrVJ-MYQofPrQCVEakz%7eyj3hkJUGNXW-fklr%7euR9R6quoRmZlYypJPc6hRhGQabsgtMH-NIartj7HL%7eMRyN2feNBf5t%7ex8PDXAVlC7fEghzvfLqpeYrBRslL0xBqRJuC11vJFr8TzuSfegrx%7eNmtAhuW-I%7einEEGk6WXvFXcS9YI49s4JUj55Qek9AO803zU2mkQF4ipvBCs8EjjCSeJtZMzszJO89w__&Key-Pair-Id=K1TMO9RMMDST50";

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
