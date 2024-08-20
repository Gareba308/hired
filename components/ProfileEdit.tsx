"use client";

import { useState, useRef } from "react";
import { Loader2, Camera } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  value: string;
  accept?: string;
}

export default function ProfileEditUpload({
  disabled,
  onChange,
  value,
  accept = "image/*",
}: ImageUploadProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_UPLOAD_NAME_REAL;
  const presetName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_UPLOAD_PRESET_NAME;
  const [imageUrl, setImageUrl] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const triggerFileSelect = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", `${presetName}`);

      try {
        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );
        const uploadedImageData = await uploadResponse.json();
        const uploadedImageUrl = uploadedImageData.secure_url;

        setImageUrl(uploadedImageUrl);
        onChange(uploadedImageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
      <div
        onClick={triggerFileSelect}
        className="relative flex justify-center items-center w-24 h-24 sm:w-28 sm:h-28 cursor-pointer bg-white rounded-full"
      >
        {isUploading ? (
          <Loader2 className="h-10 w-10 text-gray-500 animate-spin" />
        ) : (
          <div className="inline-flex w-24 cursor-pointer h-24 sm:w-28 sm:h-28 shrink-0 relative justify-center rounded-full bg-transparent border border-gray-400">
            <Image
              src={
                imageUrl ||
                "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png"
              }
              alt="author"
              fill
              sizes="100%"
              priority
              style={{ objectFit: "cover" }}
              className="rounded-full border border-gray-400"
            />
            <div className="absolute bottom-4 right-3 w-5 h-5 ">
              <Button size="sm" variant="link" type="button">
                <Camera className="h-5 w-5 bg-white rounded-lg text-gray-700" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
