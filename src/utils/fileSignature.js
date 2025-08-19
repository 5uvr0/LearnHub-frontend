import CryptoJS from "crypto-js";

const DOWNLOAD_PATH_PREFIX = "/api/secure-file-server/files/download";

const FILE_HMAC_SECRET = process.env.FILE_HMAC_SECRET;

function buildPayload(file) {
  const downloadUrl = `${DOWNLOAD_PATH_PREFIX}?formId=${file.formId}`;

  return (
    file.uploaderEmail +
    "|" +
    file.contentType +
    "|" +
    file.originalFilename +
    "|" +
    downloadUrl
  );
}

export function generateSignature(file) {
  const payload = buildPayload(file);
  const hash = CryptoJS.HmacSHA256(payload, FILE_HMAC_SECRET);
  return CryptoJS.enc.Base64.stringify(hash);
}
