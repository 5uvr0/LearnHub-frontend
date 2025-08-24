// src/course-hooks/useEnrollmentApi.js

import { useCallback } from 'react';
import useApi from './useApi'; // Assuming useApi is in src/hooks

const LEARNING_PROCESSOR_PATH = import.meta.env.VITE_LEARNING_PROCESSOR_PATH;

const useEnrollmentApi = () => {
    // Use the useApi hook with the LEARNING_PROCESSOR_PATH context
    const { data, loading, error, fetchDataEnrollment } = useApi();

    const getStudentsEnrolledInCourse = useCallback((courseId) =>
        fetchDataEnrollment(`/student-course/enrollments/course/${courseId}`, {
            method: 'GET',
        }), [fetchDataEnrollment]);

    const getContentStatus = useCallback((studentId) =>
        fetchDataEnrollment(`/student-course/content-status/${studentId}`, {
            method: 'GET',
        }), [fetchDataEnrollment]);

    // NEW: API to get latest submissions for a specific content
    const getLatestSubmissionsForContent = useCallback((courseId, contentId) =>
        fetchDataEnrollment(`/submissions/latest/course/${courseId}/content/${contentId}`, {
            method: 'GET',
        }), [fetchDataEnrollment]);

    // NEW: API to mark a submission as resolved
    // const markContentCompleted = useCallback(
    //     (studentId, courseId, contentId) =>
    //         fetchData(`/student-course/student-contents/student/${studentId}/course/${courseId}/content/${contentId}/complete`, {
    //             method: 'PATCH',
    //         }),
    //     [fetchData]
    // );
    //
    // // NEW: Placeholder API for downloading a submission file
    // const downloadSubmissionFile = useCallback((submissionId) =>
    //     fetchDataEnrollment(`/submissions/${submissionId}/download`, {
    //         method: 'GET',
    //         responseType: 'blob', // Important for file downloads
    //     }), [fetchDataEnrollment]);

    return {
        data,
        loading,
        error,
        getStudentsEnrolledInCourse,
        getContentStatus,
        getLatestSubmissionsForContent, // NEW: Return the new function
        // markSubmissionAsResolved,       // NEW: Return the new function
        // downloadSubmissionFile,         // NEW: Return the new function
    };
};

export default useEnrollmentApi;