// utils/downloadUtil.js
import { generateSignature } from "./fileSignature.js";
import { isAuthorized } from "./fileAuthorization.js";
import useFileApi from "../file-server-hooks/useServerApi.js";

const { downloadFile } = useFileApi();

export async function download(downloadFileDto, courseId, type) {

    const authorized = await isAuthorized(downloadFileDto, courseId, type);

    if (!authorized) {
        alert("You are not authorized to download this file");

        return;
    }

    try {
        // Step 1: generate signature
        const signature = generateSignature(downloadFileDto);

        // Step 2: request file from server
        const blob = await downloadFile(downloadFileDto.formId, signature);

        // Step 3: trigger download
        const fileBlob = new Blob([blob], { type: downloadFileDto.contentType });
        const url = window.URL.createObjectURL(fileBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadFileDto.originalFileName;
        a.click();
        window.URL.revokeObjectURL(url);

    } catch (err) {

        console.error("Download failed", err);
        alert("Error downloading file");
    }
}