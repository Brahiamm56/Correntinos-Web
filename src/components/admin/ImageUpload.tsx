"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  aspectRatio?: string;
}

const MAX_SIZE_MB = 10;

export default function ImageUpload({
  value,
  onChange,
  bucket = "media",
  folder = "uploads",
  aspectRatio = "16/9",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError("");

      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten imágenes (PNG, JPG, WebP, GIF)");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`La imagen no puede superar ${MAX_SIZE_MB}MB`);
        return;
      }

      setUploading(true);

      try {
        const supabase = createClient();
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filename, file, {
            contentType: file.type,
            cacheControl: "31536000",
          });

        if (uploadError) {
          setError(
            uploadError.message.includes("Bucket not found")
              ? `El bucket "${bucket}" no existe. Crealo en Supabase → Storage.`
              : uploadError.message
          );
          return;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
        onChange(data.publicUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al subir la imagen");
      } finally {
        setUploading(false);
      }
    },
    [bucket, folder, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(async () => {
    if (!value) return;
    // Optionally delete from storage
    try {
      const supabase = createClient();
      const url = new URL(value);
      const pathParts = url.pathname.split(`/object/public/${bucket}/`);
      if (pathParts[1]) {
        await supabase.storage.from(bucket).remove([pathParts[1]]);
      }
    } catch {
      // Ignore delete errors (external URL or already removed)
    }
    onChange("");
  }, [value, bucket, onChange]);

  if (value) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200" style={{ aspectRatio }}>
        <Image
          src={value}
          alt="Preview"
          fill
          className="object-cover"
          unoptimized={value.startsWith("blob:")}
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          title="Quitar imagen"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/50 to-transparent">
          <p className="text-white text-xs truncate opacity-75">
            {value.split("/").pop()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label
        className={`flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed transition-all cursor-pointer ${
          uploading
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : dragOver
            ? "border-[var(--verde-hoja)] bg-green-50"
            : "border-gray-200 hover:border-[var(--verde-hoja)] hover:bg-green-50"
        }`}
        style={{ aspectRatio, minHeight: 140 }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-[var(--verde-hoja)] animate-spin" />
            <span className="text-sm text-gray-500">Subiendo imagen...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              {dragOver ? (
                <Upload className="w-6 h-6 text-[var(--verde-hoja)]" />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {dragOver ? "Soltá la imagen aquí" : "Arrastrá o hacé clic para subir"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WebP • máx. {MAX_SIZE_MB}MB</p>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          disabled={uploading}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">{error}</p>
      )}
    </div>
  );
}
