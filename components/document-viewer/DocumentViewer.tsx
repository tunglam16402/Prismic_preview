"use client";

import dynamic from "next/dynamic";
import type { File } from "@/types/types";
import type { FC, SetStateAction } from "react";

type Props = {
  selectedPdf: File;
  setSelectedPdf: (value: SetStateAction<File | null>) => void;
};

const DocumentViewerClient = dynamic(
  () =>
    import("../DocumentViewerClient").then((mod) => mod.DocumentViewerClient),
  {
    ssr: false,
  },
);

export const DocumentViewer: FC<Props> = (props) => {
  return <DocumentViewerClient {...props} />;
};
