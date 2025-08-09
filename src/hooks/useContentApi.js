// src/hooks/useContentApi.js

import useApi from './useApi';

const useContentApi = () => {
  const { data, loading, error, fetchData } = useApi();

  const createContent = (contentData) => fetchData('/api/contents/draft', {
    method: 'POST',
    body: JSON.stringify(contentData),
  });
  const editContentMetadata = (contentReleaseId, contentData) => fetchData(`/api/contents/edit/${contentReleaseId}`, {
    method: 'PATCH',
    body: JSON.stringify(contentData),
  });
  const publishContentRelease = (contentReleaseId, contentData) => fetchData(`/api/contents/publish/${contentReleaseId}`, {
    method: 'PATCH', // Swagger says PATCH for this
    body: JSON.stringify(contentData),
  });
  const deleteContentRelease = (contentReleaseId) => fetchData(`/api/contents/delete/${contentReleaseId}`, {
    method: 'POST', // Swagger shows POST for delete
  });
  const getContentReleaseById = (contentReleaseId) => fetchData(`/api/contents/detail/${contentReleaseId}`, { method: 'GET' }); // Returns ContentCatalogueDTO variants
  const getContentByModuleId = (moduleId) => fetchData(`/api/contents/byModule/${moduleId}`, { method: 'GET' }); // Returns array of ContentCatalogueDTO variants
  const getAllContentReleases = () => fetchData(`/api/contents`, { method: 'GET' }); // Returns LectureDTO, QuizDTO, SubmissionDTO
  const getSpecificContentRelease = (contentReleaseId, releaseNum) => fetchData(`/api/contents/${contentReleaseId}/releases/${releaseNum}`, { method: 'GET' });
  const getAllContentReleasesForContent = (contentId) => fetchData(`/api/contents/${contentId}/releases`, { method: 'GET' }); // Takes contentId, not contentReleaseId


  // Quiz-specific
  const createNewQuizQuestion = (questionData) => fetchData('/api/contents/quiz/questions/new', {
    method: 'POST',
    body: JSON.stringify(questionData),
  });
  const deleteQuizQuestion = (questionId) => fetchData(`/api/contents/quiz/questions/delete/${questionId}`, {
    method: 'POST', // Swagger shows POST for delete
  });
  const getAllQuizQuestions = () => fetchData('/api/contents/quiz/questions', { method: 'GET' });

  return {
    data, loading, error,
    createContent, editContentMetadata, publishContentRelease, deleteContentRelease,
    getContentReleaseById, getContentByModuleId, getAllContentReleases,
    getSpecificContentRelease, getAllContentReleasesForContent,
    createNewQuizQuestion, deleteQuizQuestion, getAllQuizQuestions
  };
};

export default useContentApi;