// src/learner-hooks/useSubmissionApi.js
import { useCallback } from 'react';
import useApi from './useApi';

const useSubmissionApi = () => {
    const { data, loading, error, fetchData } = useApi();

    /**
     * Generate submission signature (POST)
     */
    const generateSignature = useCallback(
        (courseId, studentSubmissionDto) =>
            fetchData(`/submissions/course/${courseId}/generateSignature`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(studentSubmissionDto),
            }),
        [fetchData]
    );

    /**
     * Submit an assignment (POST)
     */
    const submitAssignment = useCallback(
        (studentId, contentId, fileDto) =>
            fetchData(`/submissions/assignments?studentId=${studentId}&contentId=${contentId}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fileDto),
            }),
        [fetchData]
    );

    /**
     * Submit a quiz (POST)
     */
    const submitQuiz = useCallback(
        (quizSubmissionData) =>
            fetchData('/submissions/quizzes', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(quizSubmissionData),
            }),
        [fetchData]
    );

    /**
     * Get submissions by student (GET)
     */
    const getSubmissionsByStudent = useCallback(
        (studentId) =>
            fetchData(`/submissions/student/${studentId}`, { method: 'GET' }),
        [fetchData]
    );

    /**
     * Get submissions by content inside a course (GET)
     */
    const getSubmissionsByContent = useCallback(
        (courseId, contentId) =>
            fetchData(`/submissions/course/${courseId}/content/${contentId}`, { method: 'GET' }),
        [fetchData]
    );

    /**
     * Get submissions by student and content (GET)
     */
    const getSubmissionsByStudentAndContent = useCallback(
        (studentId, contentId) =>
            fetchData(`/submissions/student/${studentId}/content/${contentId}`, { method: 'GET' }),
        [fetchData]
    );

    /**
     * Get latest submission by student and content (GET)
     */
    const getLatestSubmissionByStudentAndContent = useCallback(
        (studentId, courseId, contentId) =>
            fetchData(`/submissions/latest/student/${studentId}/course/${courseId}/content/${contentId}`, {
                method: 'GET',
            }),
        [fetchData]
    );

    /**
     * Get latest submission per student by content in a course (GET)
     */
    const getLatestSubmissionPerStudentByContent = useCallback(
        (courseId, contentId) =>
            fetchData(`/submissions/latest/course/${courseId}/content/${contentId}`, { method: 'GET' }),
        [fetchData]
    );

    return {
        data,
        loading,
        error,
        generateSignature,
        submitAssignment,
        submitQuiz,
        getSubmissionsByStudent,
        getSubmissionsByContent,
        getSubmissionsByStudentAndContent,
        getLatestSubmissionByStudentAndContent,
        getLatestSubmissionPerStudentByContent,
    };
};

export default useSubmissionApi;
