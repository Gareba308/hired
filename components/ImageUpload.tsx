"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { File, ImagePlus, Trash, UploadCloud } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {

  // convert image to base64
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };
  return (
    <div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="t9vqdoe9">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <div
              onClick={onClick}
              className="border h-48 border-dashed border-gray-400 rounded-lg"
            >
              <div className="flex items-center justify-center h-full w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-secondary/80 hover:bg-zinc-200"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="h-6 w-6 text-zinc-500 mb-2" />
                    <p className="mb-2 text-sm text-zinc-700">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-sm text-zinc-500">PDF (upto 4MB)</p>
                  </div>

                  <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                    <div className="px-3 py-2 grid h-full place-items-center">
                      <File className="h-4 w-4 text-blue-500" />
                    </div>
                      file name
                  </div>
                </label>
              </div>
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
