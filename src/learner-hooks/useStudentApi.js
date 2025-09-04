// src/learner-hooks/useStudentApi.js

import { useCallback } from 'react';
import useApi from './useApi'; // learner version

const useStudentApi = () => {
  const { data, loading, error, fetchData } = useApi();

  const getAllStudents = useCallback(
    () => fetchData('/students', { method: 'GET' }),
    [fetchData]
  );

  const createStudent = useCallback(
    (studentData) =>
      fetchData('/students', {
        method: 'POST',
        body: JSON.stringify(studentData),
      }),
    [fetchData]
  );

  const getStudentById = useCallback(
    (id) => fetchData(`/students/${id}`, { method: 'GET' }),
    [fetchData]
  );

    const getStudentFromToken = useCallback(
        () => fetchData(`/students/fromToken`, { method: 'GET' }),
        [fetchData]
    );

  const updateStudent = useCallback(
    (id, studentData) =>
      fetchData(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(studentData),
      }),
    [fetchData]
  );

  const softDeleteStudent = useCallback(
    (id) => fetchData(`/students/${id}`, { method: 'DELETE' }),
    [fetchData]
  );

  const hardDeleteStudent = useCallback(
      (id) => fetchData(`/students/hard/${id}`, { method: 'DELETE' }),
      [fetchData]
  );

  return {
    data,
    loading,
    error,
    getAllStudents,
    createStudent,
    getStudentById,
    getStudentFromToken,
    updateStudent,
    softDeleteStudent,
    hardDeleteStudent,
  };
};

export default useStudentApi;
