// src/learner-hooks/useApi.js
import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_FILE_SERVER_BASE_URL;
const FILE_SERVER_PATH = import.meta.env.VITE_FILE_SERVER_PATH;

const getFullUrl = (endpoint) => {
  if (!API_BASE_URL || !FILE_SERVER_PATH) {
    console.error('API environment variables are not defined in .env');
    return null;
  }
  return `${API_BASE_URL}${FILE_SERVER_PATH}${endpoint}`;
};

const useApi = (initialLoading = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    setData(null);

    const fullUrl = getFullUrl(url);
    if (!fullUrl) {
      setError('API URL is not configured correctly.');
      setLoading(false);
      return;
    }

    try {
      // Decide headers dynamically
      let headers = { ...(options.headers || {}) };

      // Only set JSON header if body is plain object (not FormData / Blob)
      if (!(options.body instanceof FormData) && !(options.body instanceof Blob)) {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      }

      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else {
            errorMessage = JSON.stringify(errorData);
          }
        } catch (_) {
          // non-JSON error, keep status text
        }
        throw new Error(errorMessage);
      }

      if (response.status === 204 || response.headers.get('Content-Length') === '0') {
        setData(true);
        return true;
      }

      const contentType = response.headers.get('Content-Type') || '';
      let result;
      if (contentType.includes('application/json')) {
        result = await response.json();
      } else if (contentType.includes('application/octet-stream') || contentType.includes('blob')) {
        result = await response.blob();
      } else {
        result = await response.text();
      }

      setData(result);
      return result;

    } catch (err) {
      console.error("API Fetch Error:", err);
      setError(err.message || 'An unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};

export default useApi;