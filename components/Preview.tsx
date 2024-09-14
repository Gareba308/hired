"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.bubble.css";
import PreviewSkeleton from "./PreviewSkeleton";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import("react-quill-new").then((module) => module.default), {
        ssr: false,
        loading: () => (
          <>
            <PreviewSkeleton />
          </>
        ),
      }),
    []
  );

  return (
    <ReactQuill
      theme="bubble"
      value={value}
      className="quill-preview -ml-3.5 text-base space-x-6 -mt-3 -mb-2 -mr-3"
      readOnly
    />
  );
};