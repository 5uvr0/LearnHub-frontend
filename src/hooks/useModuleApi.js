// src/hooks/useModuleApi.js

import { useCallback } from 'react'; // Import useCallback
import useApi from './useApi';

const useModuleApi = () => {
    const { data, loading, error, fetchData } = useApi();

    const getAllModules = useCallback(() => fetchData('/modules', { method: 'GET' }), [fetchData]);
    const createModule = useCallback((moduleData) => fetchData('/modules', {
        method: 'POST',
        body: JSON.stringify(moduleData),
    }), [fetchData]);
    const getModuleById = useCallback((id) => fetchData(`/modules/${id}`, { method: 'GET' }), [fetchData]);
    const updateModule = useCallback((id, moduleData) => fetchData(`/modules/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(moduleData),
    }), [fetchData]);
    const deleteModule = useCallback((id) => fetchData(`/modules/${id}`, { method: 'DELETE' }), [fetchData]);
    const getModulesByCourse = useCallback((courseId) => fetchData(`/modules/byCourse/${courseId}`, { method: 'GET' }), [fetchData]);
    const reorderModuleContents = useCallback((reorderData) => fetchData('/modules/contents/reorder', {
        method: 'POST',
        body: JSON.stringify(reorderData),
    }), [fetchData]);

    return {
        data, loading, error,
        getAllModules, createModule, getModuleById, updateModule, deleteModule,
        getModulesByCourse, reorderModuleContents
    };
};

export default useModuleApi;