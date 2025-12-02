import type { FileUploadResult } from "@/types/r2";
import { v4 as uuidv4 } from "uuid";

export function generateFilePath(
  folder: string,
  filename: string,
  extension: string = "webp"
): string {
  const timestamp = Date.now();
  const uuid = uuidv4();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9]/g, "-");
  return `${folder}/${sanitizedFilename}-${timestamp}-${uuid}.${extension}`;
}

export function generatePublicUrl(key: string, bucketUrl: string): string {
  return `${bucketUrl}/${key}`;
}

export function createUploadResult(
  url: string,
  key: string,
  originalSize: number,
  compressedSize: number,
  format: string
): FileUploadResult {
  return {
    success: true,
    url,
    key,
    originalSize,
    compressedSize,
    format,
  };
}

export function createFailedUploadResult(error: string): FileUploadResult {
  return {
    success: false,
    error,
  };
}
