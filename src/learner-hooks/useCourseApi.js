// src/learner-hooks/useCourseApi.js
import { useCallback } from 'react';
import useApi from './useApi';

const useCourseApi = () => {
  const { data, loading, error, fetchData } = useApi();

  // Public / Catalog endpoints
  const getAllCoursesPublic = useCallback(
    () => fetchData('/courses/public', { method: 'GET' }),
    [fetchData]
  );

  const getCourseCatalogById = useCallback(
    (courseId) => fetchData(`/courses/public/${courseId}`, { method: 'GET' }),
    [fetchData]
  );

  // Course detail endpoints
  const getCourseDetail = useCallback(
    (courseId) => fetchData(`/courses/${courseId}`, { method: 'GET' }),
    [fetchData]
  );

  // Modules and Contents
  const getContentsByModule = useCallback(
    (moduleId) => fetchData(`/courses/modules/${moduleId}/contents`, { method: 'GET' }),
    [fetchData]
  );

  const getContentDetail = useCallback(
    (contentId) => fetchData(`/courses/contents/${contentId}`, { method: 'GET' }),
    [fetchData]
  );

  return {
    data,
    loading,
    error,
    getAllCoursesPublic,
    getCourseCatalogById,
    getCourseDetail,
    getContentsByModule,
    getContentDetail,
  };
};

export default useCourseApi;
