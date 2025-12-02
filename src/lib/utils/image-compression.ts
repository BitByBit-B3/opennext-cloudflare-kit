import sharp from "sharp";
import type { ImageCompressionOptions } from "@/types/r2";

const DEFAULT_COMPRESSION_OPTIONS: Required<ImageCompressionOptions> = {
  quality: 80,
  maxWidth: 2000,
  maxHeight: 2000,
  format: "webp",
};

export async function compressImage(
  buffer: Buffer,
  options: ImageCompressionOptions = {}
): Promise<{ buffer: Buffer; format: string }> {
  const opts = { ...DEFAULT_COMPRESSION_OPTIONS, ...options };

  let sharpInstance = sharp(buffer);

  const metadata = await sharpInstance.metadata();

  if (metadata.width && metadata.height) {
    if (metadata.width > opts.maxWidth || metadata.height > opts.maxHeight) {
      sharpInstance = sharpInstance.resize({
        width: opts.maxWidth,
        height: opts.maxHeight,
        fit: "inside",
        withoutEnlargement: true,
      });
    }
  }

  let compressedBuffer: Buffer;

  switch (opts.format) {
    case "webp":
      compressedBuffer = await sharpInstance
        .webp({ quality: opts.quality })
        .toBuffer();
      break;
    case "jpeg":
      compressedBuffer = await sharpInstance
        .jpeg({ quality: opts.quality, mozjpeg: true })
        .toBuffer();
      break;
    case "png":
      compressedBuffer = await sharpInstance
        .png({ quality: opts.quality, compressionLevel: 9 })
        .toBuffer();
      break;
    default:
      compressedBuffer = await sharpInstance
        .webp({ quality: opts.quality })
        .toBuffer();
  }

  return {
    buffer: compressedBuffer,
    format: opts.format,
  };
}

export function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

export function getImageExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };
  return extensions[mimeType] || "jpg";
}
