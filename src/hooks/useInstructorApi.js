// src/hooks/useInstructorApi.js

import { useCallback } from 'react'; // Import useCallback
import useApi from './useApi';

const useInstructorApi = () => {
  const { data, loading, error, fetchData } = useApi();

  // Public/Catalog Instructor Endpoints
  const getAllInstructorsPublic = useCallback(() => fetchData('/api/instructors/public', { method: 'GET' }), [fetchData]);
  const getInstructorByIdPublic = useCallback((id) => fetchData(`/api/instructors/public/${id}`, { method: 'GET' }), [fetchData]);

  // Teacher/Configurator Instructor Endpoints
  const getAllInstructors = useCallback(() => fetchData('/api/instructors', { method: 'GET' }), [fetchData]);
  const createInstructor = useCallback((instructorData) => fetchData('/api/instructors', {
    method: 'POST',
    body: JSON.stringify(instructorData),
  }), [fetchData]);
  const getInstructorById = useCallback((id) => fetchData(`/api/instructors/${id}`, { method: 'GET' }), [fetchData]);
  const updateInstructor = useCallback((id, instructorData) => fetchData(`/api/instructors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(instructorData),
  }), [fetchData]);
  const softDeleteInstructor = useCallback((id) => fetchData(`/api/instructors/${id}`, { method: 'DELETE' }), [fetchData]);

  return {
    data, loading, error,
    getAllInstructorsPublic, getInstructorByIdPublic,
    getAllInstructors, createInstructor, getInstructorById, updateInstructor, softDeleteInstructor
  };
};

export default useInstructorApi;