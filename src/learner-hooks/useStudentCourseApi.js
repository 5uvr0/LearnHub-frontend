// src/learner-hooks/useStudentCourseApi.js
import { useCallback } from 'react';
import useApi from './useApi';

const useStudentCourseApi = () => {
  const { data, loading, error, fetchData } = useApi();

  // Enroll in a course (POST)
  const enrollInCourse = useCallback(
    (studentId, courseId) =>
      fetchData(`/student-course/enrollments?studentId=${studentId}&courseId=${courseId}`, {
        method: 'POST',
      }),
    [fetchData]
  );

  // Get all enrolled course IDs by student (GET)
  const getEnrolledCourseIdsByStudent = useCallback(
    (studentId) => fetchData(`/student-course/enrollments/student/${studentId}`, { method: 'GET' }),
    [fetchData]
  );

  // Get all students enrolled in a course (GET)
  const getStudentsEnrolledInCourse = useCallback(
    (courseId) => fetchData(`/student-course/enrollments/course/${courseId}`, { method: 'GET' }),
    [fetchData]
  );

  // Get student IDs enrolled in a course (GET)
  const getStudentIdsEnrolledInCourse = useCallback(
    (courseId) => fetchData(`/student-course/enrollments/course/${courseId}/studentIds`, { method: 'GET' }),
    [fetchData]
  );

  // Get student course progress (GET)
  // const getStudentCourseProgress = useCallback(
  //   (studentId, courseId) =>
  //     fetchData(`/student-course/progress/${studentId}/${courseId}`, { method: 'GET' }),
  //   [fetchData]
  // );

  // Get student course progress (GET)
  const getStudentCourseProgress = useCallback(
      (studentId, courseDetail) =>
          fetchData(`/student-course/progress/${studentId}`, {
            method: "POST",
            body: JSON.stringify(courseDetail),
          }),
      [fetchData]
  );


  // Get detailed student course progress (GET)
  // const getStudentCourseProgressDetail = useCallback(
  //   (studentId, courseId) =>
  //     fetchData(`/student-course/progress/detailed/${studentId}/${courseId}`, { method: 'GET' }),
  //   [fetchData]
  // );

  // Get detailed student course progress (POST)
  const getStudentCourseProgressDetail = useCallback(
      (studentId, courseDetail) =>
          fetchData(`/student-course/progress/detailed/${studentId}`, {
            method: "POST",
            body: JSON.stringify(courseDetail),
          }),
      [fetchData]
  );


  // Get all students' progress for a course (GET)
  // const getAllStudentProgressForCourse = useCallback(
  //   (courseId) => fetchData(`/student-course/progress/course/${courseId}`, { method: 'GET' }),
  //   [fetchData]
  // );

  const getAllStudentProgressForCourse = useCallback(
      (courseDetail) =>
          fetchData(`/student-course/progress/course`, {
            method: "POST",
            body: JSON.stringify(courseDetail),
          }),
      [fetchData]
  );

  // Get content completion status by student (GET)
  const getContentStatus = useCallback(
    (studentId) => fetchData(`/student-course/content-status/${studentId}`, { method: 'GET' }),
    [fetchData]
  );

  // Mark content completed (PATCH)
  const markContentCompleted = useCallback(
    (studentId, courseId, contentId) =>
      fetchData(`/student-course/student-contents/student/${studentId}/course/${courseId}/content/${contentId}/complete`, {
        method: 'PATCH',
      }),
    [fetchData]
  );

  return {
    data,
    loading,
    error,
    enrollInCourse,
    getEnrolledCourseIdsByStudent,
    getStudentsEnrolledInCourse,
    getStudentIdsEnrolledInCourse,
    getStudentCourseProgress,
    getStudentCourseProgressDetail,
    getAllStudentProgressForCourse,
    getContentStatus,
    markContentCompleted,
  };
};

export default useStudentCourseApi;
