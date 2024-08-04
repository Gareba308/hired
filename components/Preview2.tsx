"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.bubble.css";
import PreviewSkeleton2 from "./PreviewSkeleton2";

interface PreviewProps {
  value: string;
}

export const Preview2 = ({ value }: PreviewProps) => {
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import("react-quill"), {
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
      style={{
        fontSize: "0.88rem !important",
        lineHeight: "1.35rem !important",
        color: "#334155 !important"
      }}
      className="-ml-3.5 text-base space-x-6 -mt-3 -mb-2 -mr-3"
      readOnly
    />
  );
};
