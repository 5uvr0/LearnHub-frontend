// src/hooks/useModuleApi.js

import { useCallback } from 'react'; // Import useCallback
import useApi from './useApi';

const useModuleApi = () => {
    const { data, loading, error, fetchData } = useApi();

    const getAllModules = useCallback(() => fetchData('/api/modules', { method: 'GET' }), [fetchData]);
    const createModule = useCallback((moduleData) => fetchData('/api/modules', {
        method: 'POST',
        body: JSON.stringify(moduleData),
    }), [fetchData]);
    const getModuleById = useCallback((id) => fetchData(`/api/modules/${id}`, { method: 'GET' }), [fetchData]);
    const updateModule = useCallback((id, moduleData) => fetchData(`/api/modules/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(moduleData),
    }), [fetchData]);
    const deleteModule = useCallback((id) => fetchData(`/api/modules/${id}`, { method: 'DELETE' }), [fetchData]);
    const getModulesByCourse = useCallback((courseId) => fetchData(`/api/modules/byCourse/${courseId}`, { method: 'GET' }), [fetchData]);
    const reorderModuleContents = useCallback((reorderData) => fetchData('/api/modules/contents/reorder', {
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