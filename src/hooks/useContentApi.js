// src/hooks/useContentApi.js

import { useCallback } from 'react'; // Make sure useCallback is imported
import useApi from './useApi';

const useContentApi = () => {
  const { data, loading, error, fetchData } = useApi();

  const createContent = useCallback((contentData) => fetchData('/contents/draft', {
    method: 'POST',
    body: JSON.stringify(contentData),
  }), [fetchData]);
  const editContentMetadata = useCallback((contentReleaseId, contentData) => fetchData(`/contents/edit/${contentReleaseId}`, {
    method: 'PATCH',
    body: JSON.stringify(contentData),
  }), [fetchData]);
  const publishContentRelease = useCallback((contentReleaseId, contentData) => fetchData(`/contents/publish/${contentReleaseId}`, {
    method: 'PATCH',
    body: JSON.stringify(contentData),
  }), [fetchData]);
  const deleteContentRelease = useCallback((contentReleaseId) => fetchData(`/contents/delete/${contentReleaseId}`, {
    method: 'POST', // Swagger shows POST for delete
  }), [fetchData]);
  const getContentReleaseById = useCallback((contentReleaseId) => fetchData(`/contents/detail/${contentReleaseId}`, { method: 'GET' }), [fetchData]);
  const getContentByModuleId = useCallback((moduleId) => fetchData(`/contents/byModule/${moduleId}`, { method: 'GET' }), [fetchData]);
  const getAllContentReleases = useCallback(() => fetchData(`/contents`, { method: 'GET' }), [fetchData]);
  const getSpecificContentRelease = useCallback((contentReleaseId, releaseNum) => fetchData(`/contents/${contentReleaseId}/releases/${releaseNum}`, { method: 'GET' }), [fetchData]);
  // THIS IS THE ONE CAUSING THE ISSUE IF NOT MEMOIZED:
  const getAllContentReleasesForContent = useCallback((contentId) => fetchData(`/contents/releases/${contentId}`, { method: 'GET' }), [fetchData]);

  // Quiz-specific
  const createNewQuizQuestion = useCallback((questionData) => fetchData('/contents/quiz/questions/new', {
    method: 'POST',
    body: JSON.stringify(questionData),
  }), [fetchData]);
  const deleteQuizQuestion = useCallback((questionId) => fetchData(`/contents/quiz/questions/delete/${questionId}`, {
    method: 'POST',
  }), [fetchData]);
  const getAllQuizQuestions = useCallback(() => fetchData('/contents/quiz/questions', { method: 'GET' }), [fetchData]);

  return {
    data, loading, error,
    createContent, editContentMetadata, publishContentRelease, deleteContentRelease,
    getContentReleaseById, getContentByModuleId, getAllContentReleases,
    getSpecificContentRelease, getAllContentReleasesForContent, // Ensure this is returned
    createNewQuizQuestion, deleteQuizQuestion, getAllQuizQuestions
  };
};

export default useContentApi;