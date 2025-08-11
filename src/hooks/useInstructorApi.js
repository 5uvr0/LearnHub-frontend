// src/hooks/useInstructorApi.js

import { useCallback } from 'react';
import useApi from './useApi';

const useInstructorApi = () => {
  // useApi already provides data, loading, and error states
  const { data, loading, error, fetchData } = useApi();

  // Public/Catalog Instructor Endpoints
  // Added '' prefix to all endpoints
  const getAllInstructorsPublic = useCallback(() => fetchData('/public/instructors', { method: 'GET' }), [fetchData]);
  const getInstructorByIdPublic = useCallback((id) => fetchData(`/public/instructors/${id}`, { method: 'GET' }), [fetchData]);

  // Teacher/Configurator Instructor Endpoints
  // Added '' prefix to all endpoints
  const getAllInstructors = useCallback(() => fetchData('/instructors', { method: 'GET' }), [fetchData]);
  const createInstructor = useCallback((instructorData) => fetchData('/instructors', {
    method: 'POST',
    body: JSON.stringify(instructorData),
  }), [fetchData]);
  const getInstructorById = useCallback((id) => fetchData(`/instructors/${id}`, { method: 'GET' }), [fetchData]);
  const updateInstructor = useCallback((id, instructorData) => fetchData(`/instructors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(instructorData),
  }), [fetchData]);
  const softDeleteInstructor = useCallback((id) => fetchData(`/instructors/${id}`, { method: 'DELETE' }), [fetchData]);

  return {
    // These states are directly from the underlying useApi hook
    data,
    loading, // This is your loading feature
    error,
    getAllInstructorsPublic, getInstructorByIdPublic,
    getAllInstructors, createInstructor, getInstructorById, updateInstructor, softDeleteInstructor
  };
};

export default useInstructorApi;