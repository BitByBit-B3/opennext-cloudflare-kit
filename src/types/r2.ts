export interface FileObject {
  Key: string;
  LastModified: Date;
  Size: number;
  ETag: string;
  StorageClass?: string;
}

export interface FileUploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
  originalSize?: number;
  compressedSize?: number;
  format?: string;
}

export interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export interface ImageCompressionOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: "webp" | "jpeg" | "png";
}
