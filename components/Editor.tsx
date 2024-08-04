"use client";

import dynamic from "next/dynamic";
import { useEffect, forwardRef, ForwardedRef, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorLoader from "./EditorLoader";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

const QuillEditor = dynamic(
  () => import("react-quill").then((module) => module.default),
  {
    ssr: false,
    loading: () => (
      <>
        <EditorLoader />
      </>
    ),
  }
) as any;

export const Editor = forwardRef(
  ({ onChange, value }: EditorProps, ref: ForwardedRef<ReactQuill | null>) => {
    const quillRef = useRef<ReactQuill | null>(null);

    const handleQuillChange = (content: string) => {
      if (onChange) {
        onChange(content);
      }
    };

    useEffect(() => {
      if (quillRef.current && value !== undefined) {
        quillRef.current.getEditor().root.innerHTML = value;
      }
    }, [value]);

    return (
      <div className="bg-white pb-4">
        <QuillEditor
          theme="snow"
          value={value}
          className="max-h-[26rem] h-[10rem] sm:h-[11rem] text-base mb-10 sm:mb-8 pb-5 lg:pb-3 xl:pb-0 text-gray-700"
          onChange={handleQuillChange}
          forwardedRef={(node: ReactQuill | null) => {
            if (node) {
              quillRef.current = node;
            }
            if (ref) {
              if (typeof ref === "function") {
                ref(node);
              } else if (typeof ref === "object") {
                ref.current = node;
              }
            }
          }}
        />
      </div>
    );
  }
);

Editor.displayName = "Editor";