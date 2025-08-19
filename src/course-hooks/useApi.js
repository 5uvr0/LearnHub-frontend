// src/hooks/useApi.js

import { useState, useCallback } from 'react';

// Get API base URL and context path from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const COURSE_CONFIGURATOR_PATH = import.meta.env.VITE_COURSE_CONFIGURATOR_PATH;

// NEW: Enrollment API environment variables
const ENROLLMENT_BASE_URL = import.meta.env.VITE_ENROLLMENT_BASE_URL;
const LEARNING_PROCESSOR_PATH = import.meta.env.VITE_LEARNING_PROCESSOR_PATH;


// Helper to construct full API URL with context path for Course Configurator
const getFullUrl = (endpoint) => {
    if (!API_BASE_URL || !COURSE_CONFIGURATOR_PATH) {
        console.error('Course Configurator API environment variables are not defined in .env');
        return null;
    }
    return `${API_BASE_URL}${COURSE_CONFIGURATOR_PATH}${endpoint}`;
};

// NEW: Helper to construct full API URL with context path for Learning Processor (Enrollment)
const getFullEnrollmentUrl = (endpoint) => {
    if (!ENROLLMENT_BASE_URL || !LEARNING_PROCESSOR_PATH) {
        console.error('Enrollment API environment variables are not defined in .env');
        return null;
    }
    return `${ENROLLMENT_BASE_URL}${LEARNING_PROCESSOR_PATH}${endpoint}`;
};


const useApi = (initialLoading = false) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(initialLoading);
    const [error, setError] = useState(null);

    // Generic fetchData function for Course Configurator APIs
    const fetchData = useCallback(async (
        url,
        options = {}
    ) => {
        setLoading(true);
        setError(null);
        setData(null); // Clear previous data

        const fullUrl = getFullUrl(url);
        if (!fullUrl) {
            setError('Course Configurator API URL is not configured correctly.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(fullUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                console.log("Response is not OK!!!!")
                const errorData = await response.json().catch(() => ({
                    message: `HTTP error! status: ${response.status}`,
                    status: response.status,
                    error: response.statusText
                }));

                const customError = {
                    message: errorData.message || 'An unknown error occurred',
                    status: errorData.status || response.status,
                    details: errorData.details || null,
                };

                throw customError;
            }

            if (response.status === 204 || response.headers.get('Content-Length') === '0') {
                setData(true);
                return true;
            }

            const result = await response.json();
            setData(result);
            return result;
        } catch (err) {
            console.error("API Fetch Error:", err);
            setError(err); // Set the error state with the custom error object
            throw err; // Re-throw the error for the component to catch
        } finally {
            setLoading(false);
        }
    }, []);


    // NEW: fetchDataEnrollment function for Learning Processor (Enrollment) APIs
    const fetchDataEnrollment = useCallback(async (
        url,
        options = {}
    ) => {
        setLoading(true);
        setError(null);
        setData(null); // Clear previous data

        const fullUrl = getFullEnrollmentUrl(url); // Use the new URL helper
        if (!fullUrl) {
            setError('Enrollment API URL is not configured correctly.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(fullUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                console.log("Enrollment API Response is not OK!!!!")
                const errorData = await response.json().catch(() => ({
                    message: `HTTP error! status: ${response.status}`,
                    status: response.status,
                    error: response.statusText
                }));

                const customError = {
                    message: errorData.message || 'An unknown error occurred',
                    status: errorData.status || response.status,
                    details: errorData.details || null,
                };

                throw customError;
            }

            if (response.status === 204 || response.headers.get('Content-Length') === '0') {
                setData(true);
                return true;
            }

            const result = await response.json();
            setData(result);
            return result;
        } catch (err) {
            console.error("Enrollment API Fetch Error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Return both fetchData and fetchDataEnrollment
    return { data, loading, error, fetchData, fetchDataEnrollment };
};

export default useApi;