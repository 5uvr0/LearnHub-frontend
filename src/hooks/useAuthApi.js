import { useState, useCallback } from "react";
import axios from "axios";

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
			const response = await axios({
				url: fullUrl,
				method: options.method || "GET",
				headers: {
					"Content-Type": "application/json",
					// Authorization header example:
					// Authorization: `Bearer YOUR_TOKEN`,
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
			let message = "An unknown error occurred";
			err = err.response.data;

			if (axios.isAxiosError(err)) {
				message = err.errors.error;
			}

			console.error(err.message);
			setError(message);

			return null;

		} finally {
			setLoading(false);
		}

	}, []);

	return { data, loading, error, fetchData };
};

export default useAuthApi;
