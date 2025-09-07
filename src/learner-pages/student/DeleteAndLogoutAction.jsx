// src/learner-pages/student/DeleteAndLogoutAction.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useCurrentStudent from "../../learner-hooks/useCurrentStudent";
import useStudentCourseApi from "../../learner-hooks/useStudentCourseApi.js";
import useStudentApi from "../../learner-hooks/useStudentApi.js";
import Cookie from "js-cookie";

export default function DeleteAndLogoutAction() {
    const navigate = useNavigate();
    const { student, loading, error } = useCurrentStudent();
    const { unenrollFromAllCourse } = useStudentCourseApi();
    const { hardDeleteStudent } = useStudentApi();

    useEffect(() => {
        const doDelete = async () => {
            if (!student) return; // no student found

            try {
                // Step 1: Unenroll
                await unenrollFromAllCourse(student.id);

                // Step 2: Hard delete
                await hardDeleteStudent(student.id);

                // Step 3: Clear session & logout
                Cookies.remove("accessToken");
                Cookie.remove('studentId')
                localStorage.clear();

                navigate("/login");

            } catch (err) {
                console.error(err);
                navigate("/student/dashboard", { state: { error: "Delete failed" } });
            }
        };

        if (!loading && !error) {
            doDelete();
        }
    }, [student, loading, error, navigate, unenrollFromAllCourse, hardDeleteStudent]);

    return null; // headless page
}
