import CryptoJS from "crypto-js";

const DOWNLOAD_PATH_PREFIX = "/api/secure-file-server/files/download";

const FILE_HMAC_SECRET = import.meta.env.VITE_FILE_HMAC_SECRET;

function buildPayload(file) {
  const downloadUrl = `${DOWNLOAD_PATH_PREFIX}?formId=${file.formId}`;

  console.log("Building paylaod: ")
  console.log(file.uploaderEmail)
  console.log(file.contentType)
  console.log(file.originalFileName)
  console.log(downloadUrl)

  return (
    file.uploaderEmail +
    "|" +
    file.contentType +
    "|" +
    file.originalFileName +
    "|" +
    downloadUrl
  );
}

export function generateSignature(file) {
  const payload = buildPayload(file);

  console.log("Payload: ")
  console.log(payload)

  const hash = CryptoJS.HmacSHA256(payload, FILE_HMAC_SECRET);

  console.log("Hash")
  console.log(hash)

  return CryptoJS.enc.Base64.stringify(hash);
}
