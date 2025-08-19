// src/learner-hooks/useSubmissionApi.js
import { useCallback } from 'react';
import useApi from './useApi';

const useSubmissionApi = () => {
  const { data, loading, error, fetchData } = useApi();

  // Submit a quiz (POST)
  const submitQuiz = useCallback(
    (quizSubmissionData) =>
      fetchData('/submissions/quizzes', {
        method: 'POST',
        body: JSON.stringify(quizSubmissionData),
      }),
    [fetchData]
  );

    /**
     * Submit an assignment (POST) with multipart form data (file upload)
     */
    const submitAssignment = useCallback(
        (studentId, contentId, fileDto) => {
            return fetchData(
                `/submissions/assignments?studentId=${studentId}&contentId=${contentId}`,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" }, // explicitly JSON
                    body: JSON.stringify(fileDto),                   // send DTO as JSON
                }
            );
        },
        [fetchData]
    );


    // Get submissions by student (GET)
  const getSubmissionsByStudent = useCallback(
    (studentId) => fetchData(`/submissions/student/${studentId}`, { method: 'GET' }),
    [fetchData]
  );

  // Get submissions by student and content (GET)
  const getSubmissionsByStudentAndContent = useCallback(
    (studentId, contentId) =>
      fetchData(`/submissions/student/${studentId}/content/${contentId}`, { method: 'GET' }),
    [fetchData]
  );

  // Get latest submission by student and content (GET)
  const getLatestSubmissionByStudentAndContent = useCallback(
    (studentId, contentId) =>
      fetchData(`/submissions/latest/student/${studentId}/content/${contentId}`, { method: 'GET' }),
    [fetchData]
  );

  // Get latest submission per student by content (GET)
  const getLatestSubmissionPerStudentByContent = useCallback(
    (contentId) => fetchData(`/submissions/latest/content/${contentId}`, { method: 'GET' }),
    [fetchData]
  );

  // Get submissions by content (GET)
  const getSubmissionsByContent = useCallback(
    (contentId) => fetchData(`/submissions/content/${contentId}`, { method: 'GET' }),
    [fetchData]
  );




  return {
    data,
    loading,
    error,
    submitQuiz,
    submitAssignment,
    getSubmissionsByStudent,
    getSubmissionsByStudentAndContent,
    getLatestSubmissionByStudentAndContent,
    getLatestSubmissionPerStudentByContent,
    getSubmissionsByContent,
  };
};

export default useSubmissionApi;
