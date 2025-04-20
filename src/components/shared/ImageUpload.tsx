
import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
  inputId?: string;
  maxSize?: number; // In MB
  label?: string;
  className?: string;
  buttonClassName?: string;
}

/**
 * Reusable image upload component
 */
const ImageUpload: React.FC<ImageUploadProps> = ({
  imagePreview,
  handleImageUpload,
  clearImage,
  inputId = "uploadedImage",
  maxSize = 5, // Default max size of 5MB
  label = "Foto's van uw ruimte (optioneel)",
  className = "",
  buttonClassName = ""
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium">
          {label}
        </label>
      )}
      
      <input 
        type="file"
        id={inputId}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      {imagePreview ? (
        <div className="relative mt-2">
          <img 
            src={imagePreview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md border border-gray-200"
          />
          <Button 
            type="button"
            variant="outline" 
            size="icon"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-white rounded-full h-8 w-8 p-0 shadow-md"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          onClick={() => document.getElementById(inputId)?.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-primary transition-colors ${buttonClassName}`}
        >
          <Camera className="h-10 w-10 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Klik om foto's toe te voegen</span>
          <span className="text-xs text-gray-400 mt-1">JPG, PNG, etc. (max {maxSize}MB)</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
