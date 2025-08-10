// src/hooks/useCourseApi.js

import { useCallback } from 'react'; // Import useCallback
import useApi from './useApi';

const useCourseApi = () => {
  const { data, loading, error, fetchData } = useApi();

  // Public/Catalog Course Endpoints
  const getAllCoursesCatalog = useCallback(() => fetchData('/courses/public', { method: 'GET' }), [fetchData]);
  const getCourseByIdPublic = useCallback((id) => fetchData(`/courses/public/${id}`, { method: 'GET' }), [fetchData]);
  const getCoursesByInstructorIdPublic = useCallback((instructorId) => fetchData(`/courses/byInstructor/${instructorId}/public`, { method: 'GET' }), [fetchData]);

  // Teacher/Configurator Course Endpoints
  const getAllDraftCourses = useCallback(() => fetchData('/courses/draft', { method: 'GET' }), [fetchData]);
  const createCourse = useCallback((courseData) => fetchData('/courses/draft', {
    method: 'POST',
    body: JSON.stringify(courseData),
  }), [fetchData]);
  const getCourseDetails = useCallback((id) => fetchData(`/courses/${id}/details`, { method: 'GET' }), [fetchData]); // This endpoint returns CourseDTO
  const updateCourse = useCallback((id, courseData) => fetchData(`/courses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(courseData),
  }), [fetchData]);
  const deleteCourse = useCallback((id) => fetchData(`/courses/${id}`, { method: 'DELETE' }), [fetchData]);
  const publishCourse = useCallback((id) => fetchData(`/courses/publish/${id}`, { method: 'POST' }), [fetchData]);
  const reorderModules = useCallback((reorderData) => fetchData('/courses/modules/reorder', {
    method: 'POST',
    body: JSON.stringify(reorderData),
  }), [fetchData]);
  const getAllCourseVersions = useCallback((courseId) => fetchData(`/courses/${courseId}/versions`, { method: 'GET' }), [fetchData]);
  const getCourseVersionById = useCallback((courseId, versionNumber) => fetchData(`/courses/${courseId}/versions/${versionNumber}`, { method: 'GET' }), [fetchData]);
  const getDraftCourseById = useCallback((courseId) => fetchData(`/courses/draft/${courseId}`, { method: 'GET' }), [fetchData]);
  const getCourseByInstructorId = useCallback((instructorId) => fetchData(`/courses/byInstructor/${instructorId}`, { method: 'GET' }), [fetchData]);


  return {
    data, loading, error,
    getAllCoursesCatalog, getCourseByIdPublic, getCoursesByInstructorIdPublic,
    getAllDraftCourses, createCourse, getCourseDetails, updateCourse,
    deleteCourse, publishCourse, reorderModules,
    getAllCourseVersions, getCourseVersionById, getDraftCourseById, getCourseByInstructorId
  };
};

export default useCourseApi;