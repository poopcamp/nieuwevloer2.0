
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Handles the upload of a file to Supabase storage
 * @param file The file to upload
 * @param bucketName The name of the storage bucket
 * @param filePath Path within the bucket
 * @returns The public URL of the uploaded file or null if failed
 */
export async function uploadFile(
  file: File,
  bucketName: string = 'clientphotos',
  filePath?: string
): Promise<string | null> {
  try {
    if (!file) return null;
    
    const fileName = filePath || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${file.name}`;
    const path = filePath ? filePath : `uploads/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, file);
      
    if (uploadError) throw uploadError;
    
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);
      
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

/**
 * Creates a form state handler with standardized behavior
 * @param initialState Initial form state
 * @returns Form state management utilities
 */
export function useFormState<T extends Record<string, any>>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const { toast } = useToast();
  
  // Handle text/select field changes
  const handleChange = (field: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (field: keyof T) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Basic validation function
  const validateForm = (rules?: Partial<Record<keyof T, (value: any) => string | undefined>>) => {
    if (!rules) return true;
    
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;
    
    Object.entries(rules).forEach(([field, validationFn]) => {
      const key = field as keyof T;
      const error = validationFn?.(formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  const showError = (message: string) => {
    toast({
      title: "Fout",
      description: message,
      variant: "destructive",
    });
  };
  
  const showSuccess = (message: string) => {
    toast({
      title: "Succes",
      description: message,
      variant: "success",
    });
  };
  
  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    errors,
    handleChange,
    handleCheckboxChange,
    validateForm,
    showError,
    showSuccess
  };
}

import { useState } from 'react';

/**
 * Handles file upload preview functionality
 */
export function useFileUploadPreview() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
  
  const clearFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  };
  
  return {
    file,
    preview,
    handleFileChange,
    clearFile,
    setFile
  };
}
