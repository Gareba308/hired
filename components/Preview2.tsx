"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.bubble.css";
import PreviewSkeleton2 from "./PreviewSkeleton2";

interface PreviewProps {
  value: string;
}

export const Preview2 = ({ value }: PreviewProps) => {
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import("react-quill-new"), {
        ssr: false,
        loading: () => (
          <>
            <PreviewSkeleton2 />
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
