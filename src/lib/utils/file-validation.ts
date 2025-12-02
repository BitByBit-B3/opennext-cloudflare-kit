import type { FileValidationOptions } from "@/types/r2";

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;
const DEFAULT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

export function validateFile(
  file: File | Buffer,
  options: FileValidationOptions = {}
): { valid: boolean; error?: string } {
  const maxSize = options.maxSize || DEFAULT_MAX_SIZE;
  const allowedTypes = options.allowedTypes || DEFAULT_ALLOWED_TYPES;

  if (file instanceof File) {
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
      };
    }
  } else {
    if (file.length > maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
      };
    }
  }

  return { valid: true };
}
