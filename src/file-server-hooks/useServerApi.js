// src/learner-hooks/useFileApi.js
import { useCallback } from 'react';
import useApi from './useApi';

const useFileApi = () => {
  const { data, loading, error, fetchData } = useApi();

  // Upload file (POST multipart form data)
  const uploadFile = useCallback(
      (file, contextMap = {}) => {

          console.log("File: ", file)
          console.log("Map: ", contextMap)

        const formData = new FormData();
        formData.append('file', file);

        // Append all contextMap entries (e.g. uploaderEmail)
        Object.entries(contextMap).forEach(([key, value]) => {
          formData.append(key, value);
        });

        return fetchData('/files', {
          method: 'POST',
          body: formData,
        });
      },
      [fetchData]
  );

  // Download file (GET with formId & signature)
  const downloadFile = useCallback(
      (formId, signature) =>
          fetchData(`/files/download?formId=${formId}&signature=${encodeURIComponent(signature)}`, {
            method: 'GET',
            responseType: 'blob', // so frontend handles file blob
          }),
      [fetchData]
  );

  // List all files (GET)
  const listFiles = useCallback(
      () => fetchData('/files', { method: 'GET' }),
      [fetchData]
  );

  // Delete file by formId (DELETE)
  const deleteFile = useCallback(
      (formId) => fetchData(`/files/hard/${formId}`, { method: 'DELETE' }),
      [fetchData]
  );

  return {
    data,
    loading,
    error,
    uploadFile,
    downloadFile,
    listFiles,
    deleteFile,
  };
};

export default useFileApi;
