"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
  accept?: string;
}

export default function CloudUpload({
  disabled,
  onChange,
  onRemove,
  value,
  accept = "image/*",
}: ImageUploadProps) {
  const { register } = useForm();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_UPLOAD_NAME_REAL;
  const presetName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_UPLOAD_PRESET_NAME;
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setIsUploading(true);
    const image = data.profile[0];
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", `${presetName}`);

    try {
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const uploadedImageData = await uploadResponse.json();
      const imageUrl = uploadedImageData.secure_url;
      setImageUrl(imageUrl);
      onChange(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      await onSubmit({ profile: files });
    }
  };

  return (
    <>
      <div className="grid w-full items-center gap-1.5">
        <label className="hidden" htmlFor="upload data">Upload</label>
        <input
          {...register("profile")}
          className="block w-full h-10 text-sm text-gray-900 border rounded-sm border-gray-300 file:cursor-pointer cursor-pointer file:border-none bg-gray-50 focus:outline-none file:h-10 file:bg-gray-200 file:hover:opacity-90 file:text-sm file:py-2"
          onChange={handleFileChange}
          id="upload data"
          type="file"
          accept={accept} 
        />
      </div>
      {isUploading && (
        <p className="text-sm text-blue-500 flex items-center flex-row">
          <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          Uploading...
        </p>
      )}
      {imageUrl && <p className="text-sm text-green-500">Uploaded</p>}
    </>
  );
}
