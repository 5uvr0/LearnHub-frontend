// src/learner-hooks/useCurrentStudent.js
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useStudentApi from "./useStudentApi";

const useCurrentStudent = () => {
    const { getStudentById, getStudentFromToken, loading, error } = useStudentApi();
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const fetchStudent = async () => {
            let studentData;
            let studentId = Cookies.get("studentId");

            console.log("[useCurrentStudent] Cookie studentId:", studentId);

            if (studentId) {
                studentData = await getStudentById(studentId);
            } else {
                studentData = await getStudentFromToken();
                if (studentData?.id) {
                    Cookies.set("studentId", studentData.id, { expires: 7 });
                }
            }

            setStudent(studentData);
        };

        fetchStudent();
    }, [getStudentById, getStudentFromToken]);

    return { student, loading, error };
};

export default useCurrentStudent;
