// src/learner-hooks/useApi.js
import { useState, useCallback } from 'react';

// Get API base URL and context path from environment variables
const API_BASE_URL = import.meta.env.VITE_FILE_SERVER_BASE_URL;
const FILE_SERVER_PATH = import.meta.env.VITE_FILE_SERVER_PATH;

// Helper to construct full API URL with context path
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

  const fetchData = useCallback(async (
    url,
    options = {}
  ) => {
    setLoading(true);
    setError(null);
    setData(null); // Clear previous data

    const fullUrl = getFullUrl(url);

    if (!fullUrl) {
      setError('API URL is not configured correctly.');
      setLoading(false);

      return;
    }

    try {
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers here if needed later (e.g., Bearer Token):
          // 'Authorization': `Bearer YOUR_TOKEN`,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = await response.json();

          if (errorData.message) {
            errorMessage = errorData.message;

          } else if (typeof errorData === 'string') { // Backend might return plain error string
            errorMessage = errorData;

          } else {
            errorMessage = JSON.stringify(errorData);
          }

        } catch (jsonError) {
          // If response is not JSON, use default status message
        }
        throw new Error(errorMessage);
      }

      // Check for empty response (e.g., successful DELETE often returns 200 with no body)
      if (response.status === 204 || response.headers.get('Content-Length') === '0') {
        setData(true); // Indicate success for no-content responses
        
        return true;
      }

      const result = await response.json();
      setData(result);

      return result; // Return data for direct use in the component

    } catch (err) {
      console.error("API Fetch Error:", err);
      setError(err.message || 'An unknown error occurred');

      return null; // Return null on error

    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};

export default useApi;