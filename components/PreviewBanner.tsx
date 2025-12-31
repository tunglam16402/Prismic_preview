"use client";

import { useState } from "react";
import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";

export default function PagePreview() {
  const [title, setTitle] = useState("Default page title");
  const [description, setDescription] = useState(
    "This is default description."
  );

  return (
    <PrismicPreview repositoryName={repositoryName}>
      {/* Toolbar custom */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 rounded  px-4 py-2 text-sm border">
        <span>Preview mode</span>
        <input
          className="p-1 text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Edit title"
        />
        <textarea
          className="p-1 text-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Edit description"
        />
        <a href="/api/prismicio/exit-preview" className="mt-1 underline">
          Exit
        </a>
      </div>

      {/* Page content */}
      <div className="p-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-4">{description}</p>
      </div>
    </PrismicPreview>
  );
}
