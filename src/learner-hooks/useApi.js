import { useState, useCallback } from 'react';
import Cookies from "js-cookie";
import axios from "axios";

// Get API base URL and context path from environment variables
const API_BASE_URL = import.meta.env.VITE_LEARNING_BASE_URL;
const LEARNING_PROCESSOR_PATH = import.meta.env.VITE_LEARNING_PROCESSOR_PATH;

// Helper to construct full API URL with context path
const getFullUrl = (endpoint) => {
  if (!API_BASE_URL || !LEARNING_PROCESSOR_PATH) {
    console.error('API environment variables are not defined in .env');
    return null;
  }
  return `${API_BASE_URL}${LEARNING_PROCESSOR_PATH}${endpoint}`;
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
    setData(null);

    const fullUrl = getFullUrl(url);

    if (!fullUrl) {
      setError('API URL is not configured correctly.');
      setLoading(false);
      return null; // Return null consistently on error
    }

    try {
      const token = Cookies.get("accessToken");
      const response = await axios({
        url: fullUrl,
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        data: options.body || options.data || null,
        params: options.params || null,
      });

      // The check `response.ok` is not needed with axios.
      // Axios throws an error for non-2xx status codes, which are caught below.

      // Handle successful but no-content responses (e.g., 204)
      if (response.status === 204) {
        setData(true);
        return true;
      }

      // Check for empty data response
      if (!response.data) {
        setData(true);
        return true;
      }

      setData(response.data);
      return response.data;

    } catch (err) {
      // Axios error objects have a `response` property with the server's response
      const serverError = err.response?.data?.message || err.message || 'An unknown error occurred';
      console.error("API Fetch Error:", serverError);
      setError(serverError);
      return null;

    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};

export default useApi;