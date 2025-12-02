import type { FileObject, FileUploadResult, FileValidationOptions, ImageCompressionOptions } from "@/types/r2";
import { logger } from "./logger";
import {
  generateFilePath,
  generatePublicUrl,
  createUploadResult,
  createFailedUploadResult,
} from "@/lib/utils/file-upload";
import { validateFile } from "@/lib/utils/file-validation";
import { compressImage, isImage } from "@/lib/utils/image-compression";

export enum UploadFolder {
  EVENTS_MAIN_IMAGES = "events/main-images",
  EVENTS_GALLERY = "events/gallery",
  EVENTS_DOCUMENTS = "events/documents",
  PROJECTS_MAIN_IMAGES = "projects/main-images",
  PROJECTS_GALLERY = "projects/gallery",
  PROJECTS_DOCUMENTS = "projects/documents",
  MISSIONS_IMAGES = "missions/images",
  PROFILE_PICTURES = "users/profile-pictures",
  MEMBER_PORTAL = "member-portal/posts",
  PRODUCTS_MAIN_IMAGES = "shop/products/main-images",
  PRODUCTS_GALLERY = "shop/products/gallery",
  GALLERY = "gallery/images",
  GENERAL_UPLOADS = "general/uploads",
}

const getR2Bucket = async (): Promise<R2Bucket> => {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = await getCloudflareContext({ async: true });
  return env.R2_STORAGE;
};

function getContentType(filePath: string, format?: string): string {
  if (format === "webp") return "image/webp";
  if (format === "jpeg") return "image/jpeg";
  if (format === "png") return "image/png";

  const ext = filePath.toLowerCase().split(".").pop();
  const contentTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  return contentTypes[ext || ""] || "application/octet-stream";
}

export async function uploadFile(
  file: Buffer,
  filePath: string
): Promise<void> {
  try {
    const bucket = await getR2Bucket();

    await bucket.put(filePath, file, {
      httpMetadata: {
        contentType: getContentType(filePath),
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    logger.info(`File uploaded successfully to R2: ${filePath}`);
  } catch (error: unknown) {
    logger.error(`Error uploading file to R2: ${error}`);
    throw error;
  }
}

export async function uploadFileWithCompression(
  file: Buffer | File,
  folder: UploadFolder,
  filename: string,
  options: {
    validation?: FileValidationOptions;
    compression?: ImageCompressionOptions;
  } = {}
): Promise<FileUploadResult> {
  try {
    let fileBuffer: Buffer;
    let mimeType: string;
    const originalSize = file instanceof File ? file.size : file.length;

    if (file instanceof File) {
      mimeType = file.type;
      fileBuffer = Buffer.from(await file.arrayBuffer());
    } else {
      fileBuffer = file;
      mimeType = "application/octet-stream";
    }

    const validation = validateFile(file, options.validation);
    if (!validation.valid) {
      return createFailedUploadResult(validation.error || "Validation failed");
    }

    let finalBuffer = fileBuffer;
    let format = "original";

    if (isImage(mimeType)) {
      const compressed = await compressImage(fileBuffer, {
        ...options.compression,
        format: options.compression?.format || "webp",
      });
      finalBuffer = compressed.buffer;
      format = compressed.format;
    }

    const filePath = generateFilePath(folder, filename, format);

    await uploadFile(finalBuffer, filePath);

    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const bucketUrl = env.R2_PUBLIC_URL || "";
    const publicUrl = generatePublicUrl(filePath, bucketUrl);

    return createUploadResult(
      publicUrl,
      filePath,
      originalSize,
      finalBuffer.length,
      format
    );
  } catch (error: unknown) {
    logger.error(`Error in uploadFileWithCompression: ${error}`);
    return createFailedUploadResult(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function getFile(filePath: string): Promise<R2ObjectBody | null> {
  try {
    const bucket = await getR2Bucket();
    const object = await bucket.get(filePath);
    return object;
  } catch (error: unknown) {
    logger.error(`Error getting file from R2: ${error}`);
    throw error;
  }
}

export async function listFiles(folder: string = ""): Promise<FileObject[]> {
  try {
    const bucket = await getR2Bucket();
    const listed = await bucket.list({
      prefix: folder,
    });

    return listed.objects.map((obj) => ({
      Key: obj.key,
      LastModified: obj.uploaded,
      Size: obj.size,
      ETag: obj.etag,
      StorageClass: obj.storageClass,
    }));
  } catch (error: unknown) {
    logger.error(`Error listing files: ${error}`);
    throw error;
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const bucket = await getR2Bucket();
    await bucket.delete(filePath);
    logger.info(`File deleted successfully from R2: ${filePath}`);
  } catch (error: unknown) {
    logger.error(`Error deleting file from R2: ${error}`);
    throw error;
  }
}

export async function deleteMultipleFiles(filePaths: string[]): Promise<void> {
  try {
    const bucket = await getR2Bucket();
    await bucket.delete(filePaths);
    logger.info(`Multiple files deleted successfully from R2`);
  } catch (error: unknown) {
    logger.error(`Error deleting multiple files from R2: ${error}`);
    throw error;
  }
}
