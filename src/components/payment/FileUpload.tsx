"use client";

import React, { useRef, useState } from "react";
import { Upload, FileText, X, AlertCircle, CheckCircle } from "lucide-react";
import { ALLOWED_FILE_EXTENSIONS, MAX_FILE_SIZE } from "@/lib/validation";

interface FileUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export function FileUpload({ value, onChange, error }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setLocalError(null);

    // Check extension
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !ALLOWED_FILE_EXTENSIONS.includes(extension)) {
      setLocalError(`Unsupported file format. Please upload: ${ALLOWED_FILE_EXTENSIONS.join(", ").toUpperCase()}`);
      return false;
    }

    // Check size (10MB)
    if (file.size > MAX_FILE_SIZE) {
      setLocalError("File is too large. Maximum size is 10 MB.");
      return false;
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        onChange(droppedFile);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        onChange(selectedFile);
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    setLocalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const displayError = error || localError;

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`relative flex flex-col items-center justify-center w-full min-h-[160px] p-6 text-center cursor-pointer transition-all duration-300 border-2 border-dashed rounded-2xl bg-white/40 backdrop-blur-md select-none group
          ${isDragActive 
            ? "border-orange-500 bg-orange-50/30 shadow-[0_0_20px_rgba(249,115,22,0.08)]" 
            : displayError 
              ? "border-rose-300 hover:border-rose-400 bg-rose-50/10" 
              : value 
                ? "border-emerald-300 bg-emerald-50/10" 
                : "border-slate-200 hover:border-orange-300 hover:shadow-[0_4px_20px_rgba(249,115,22,0.04)]"
          }
        `}
      >
        {value ? (
          <div className="flex flex-col items-center gap-3 w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 rounded-full bg-emerald-100/50 text-emerald-600 border border-emerald-200/20 shadow-sm animate-pulse">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 max-w-full px-4">
              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-sm font-semibold text-slate-700 truncate max-w-[200px] md:max-w-xs">
                {value.name}
              </span>
              <span className="text-xs text-slate-500 font-medium shrink-0">
                ({(value.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all ml-1"
                aria-label="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">Click icon or drag new file to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-orange-50 text-orange-500 border border-orange-100/30 group-hover:scale-105 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <Upload className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-bold text-slate-800">
                Drag & drop your screenshot here, or <span className="text-orange-500 group-hover:text-orange-600 transition-colors">browse</span>
              </p>
              <p className="text-xs text-slate-500 font-medium leading-normal">
                Supported formats: JPG, JPEG, PNG, PDF
                <br />
                Maximum size: 10 MB
              </p>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold mt-2 px-1 animate-pulse">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
