// src/learner-pages/student/UnenrollAllAction.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCurrentStudent from "../../learner-hooks/useCurrentStudent";
import useStudentCourseApi from "../../learner-hooks/useStudentCourseApi.js";
import useStudentApi from "../../learner-hooks/useStudentApi.js";

export default function UnenrollAllAction({ fetchData }) {
    const navigate = useNavigate();
    const { student, loading, error } = useCurrentStudent();
    const {unenrollFromAllCourse} = useStudentCourseApi();
    const {hardDeleteStudent} = useStudentApi()

    useEffect(() => {
        const doUnenroll = async () => {
            if (!student) return; // no student found

            try {
                await unenrollFromAllCourse(student?.id)

                navigate("/student/dashboard");

            } catch (err) {
                console.error(err);
                navigate("/student/dashboard", { state: { error: "Unenroll failed" } });
            }
        };

        if (!loading && !error) {
            doUnenroll();
        }
    }, [fetchData, student, loading, error, navigate]);

    return null;
}
