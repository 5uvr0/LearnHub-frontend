// utils/downloadFileDto.js
export function buildDownloadFileDto({
    formId,
    contentId,
    contentType,
    originalFileName,
    downloadUrl,
    uploaderEmail,
    studentId = null,
    instructorId = null,}) {

    return {
        formId,
        contentId,
        contentType,
        originalFileName,
        downloadUrl,
        uploaderEmail,
        studentId,
        instructorId,
    };
}
