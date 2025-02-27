import { env } from "../env";

/**
 * Validates the mime type against the allowed types in the config
 *
 * @param mime the mime type to validate
 * @returns true if valid, false otherwise
 */
export function validateMimeType(mime: string): boolean {
  if (!env.ALLOWED_MIME_TYPES) {
    console.log(
      `ALLOWED_MIME_TYPES is empty, defaulting to all allowed. To make this message stop add "*/*" to the allowed list. 
        Please note this will allow any file type to be uploaded`
    );
    return true;
  }

  const allowedTypes = env.ALLOWED_MIME_TYPES.toLowerCase().split(",");
  mime = mime.toLowerCase();

  // Start with valid = false
  let valid = false;
  for (const allowedType of allowedTypes) {
    if (allowedType === "*" || allowedType === "*/*") {
      valid = true; // Allow all MIME types
      break;
    }

    const mimeParts = mime.split("/");
    const allowedParts = allowedType.split("/");

    if (mimeParts.length !== 2 || allowedParts.length !== 2) {
      continue;
    }

    if (allowedParts[0] === "*" && allowedParts[1] === "*") {
      valid = true; // Allow all MIME types
      break;
    } else if (allowedParts[0] === "*") {
      if (mimeParts[1] === allowedParts[1]) {
        valid = true;
        break;
      }
    } else if (allowedParts[1] === "*") {
      if (mimeParts[0] === allowedParts[0]) {
        valid = true;
        break;
      }
    } else if (
      mimeParts[0] === allowedParts[0] &&
      mimeParts[1] === allowedParts[1]
    ) {
      valid = true;
      break;
    }
  }

  return valid;
}
