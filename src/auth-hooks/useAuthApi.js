import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL;
const URI = import.meta.env.VITE_AUTH_PATH;

const getFullUrl = (endpoint) => {
    if (!BASE_URL || !URI) {
        console.error("API environment variables are not defined in .env");
        return null;
    }

    return `${BASE_URL}${URI}${endpoint}`;
};

const useAuthApi = (initialLoading = false) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(initialLoading);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (url, options = {}) => {
        setLoading(true);
        setError(null);
        setData(null);

        const fullUrl = getFullUrl(url);
        if (!fullUrl) {
            setError("API URL is not configured correctly.");
            setLoading(false);
            return;
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

            if (response.status === 204 || !response.data) {
                setData(true);
                return true;
            }

            setData(response.data);
            return response.data;

        } catch (err) {
            let message = "An unknown error occurred.";

            if (axios.isAxiosError(err) && err.response) {
                try {
                    message = JSON.stringify(err.response.data);

                } catch (e) {
                    message = err.response.statusText || message;
                }

            } else if (err.request) {
                message = "No response from server. Please check your network connection.";

            } else {
                message = err.message || message;
            }
            
            console.error("API Fetch Error:", message);
            setError(message);

            return null;

        } finally {
            setLoading(false);
        }

    }, []);

    return { data, loading, error, fetchData };
};

export default useAuthApi;