// src/hooks/useContentApi.js

import { useCallback } from 'react';
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
        method: 'POST',
    }), [fetchData]);
    const getContentReleaseById = useCallback((contentReleaseId) => fetchData(`/contents/detail/exact/${contentReleaseId}`, { method: 'GET' }), [fetchData]);
    const getContentByModuleId = useCallback((moduleId) => fetchData(`/contents/byModule/${moduleId}`, { method: 'GET' }), [fetchData]);
    const getAllContentReleases = useCallback(() => fetchData(`/contents`, { method: 'GET' }), [fetchData]);
    const getSpecificContentRelease = useCallback((contentReleaseId, releaseNum) => fetchData(`/contents/${contentReleaseId}/releases/${releaseNum}`, { method: 'GET' }), [fetchData]);
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
    const addQuizOption = useCallback((payload) => fetchData('/contents/quiz/questions/add/option', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    }), [fetchData]);
    
    // NEW: API for editing a quiz question
    const editQuizQuestion = useCallback((questionId, questionData) => fetchData(`/contents/quiz/questions/question/${questionId}`, {
        method: 'PATCH',
        body: JSON.stringify(questionData),
    }), [fetchData]);

    // NEW: API for editing a quiz option
    const editQuizOption = useCallback((optionId, optionData) => fetchData(`/contents/quiz/questions/option/${optionId}`, {
        method: 'PATCH',
        body: JSON.stringify(optionData),
    }), [fetchData]);

    return {
        data, loading, error, addQuizOption,
        createContent, editContentMetadata, publishContentRelease, deleteContentRelease,
        getContentReleaseById, getContentByModuleId, getAllContentReleases,
        getSpecificContentRelease, getAllContentReleasesForContent,
        createNewQuizQuestion, deleteQuizQuestion, getAllQuizQuestions,
        editQuizQuestion, editQuizOption, // NEW: Return the new functions
    };
};

export default useContentApi;