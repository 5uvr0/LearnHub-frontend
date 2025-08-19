// src/hooks/useEnrollmentApi.js

import { useCallback } from 'react';
import useApi from './useApi';

const useEnrollmentApi = () => {
    const { data, loading, error, fetchDataEnrollment } = useApi();

    const getStudentsEnrolledInCourse = useCallback((courseId) =>
        fetchDataEnrollment(`/student-course/enrollments/course/${courseId}`, {
            method: 'GET',
        }), [fetchDataEnrollment]);

    const getContentStatus = useCallback((studentId) =>
        fetchDataEnrollment(`/student-course/content-status/${studentId}`, {
            method: 'GET',
        }), [fetchDataEnrollment]);

    return {
        data,
        loading,
        error,
        getStudentsEnrolledInCourse,
        getContentStatus,
    };
};

export default useEnrollmentApi;