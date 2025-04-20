
import React, { ChangeEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface ImageUploadFieldProps {
  imagePreview: string | null;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  disabled?: boolean;
  acceptedFileTypes?: string;
  label?: string;
  // Adding these properties to support existing code
  onImageUpload?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClearImage?: () => void;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  imagePreview,
  onUpload,
  onClear,
  disabled = false,
  acceptedFileTypes = 'image/*',
  label,
  // Support for legacy prop names
  onImageUpload,
  onClearImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    // Use new prop name if available, otherwise use legacy prop name
    if (onUpload) {
      onUpload(e);
    } else if (onImageUpload) {
      onImageUpload(e);
    }
  };

  const handleClear = () => {
    // Use new prop name if available, otherwise use legacy prop name
    if (onClear) {
      onClear();
    } else if (onClearImage) {
      onClearImage();
    }
  };

  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-medium">{label}</div>}
      <input
        type="file"
        className="hidden"
        onChange={handleUpload}
        accept={acceptedFileTypes}
        ref={fileInputRef}
        disabled={disabled}
      />
      
      {!imagePreview ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer"
          onClick={!disabled ? handleButtonClick : undefined}
        >
          <Upload className="h-10 w-10 mb-2" />
          <p className="text-sm font-medium">Klik hier om een afbeelding te uploaden</p>
          <p className="text-xs">of sleep een bestand hierheen</p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-48 rounded-md mx-auto"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleClear}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
