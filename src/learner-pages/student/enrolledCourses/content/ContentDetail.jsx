import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import Lecture from "./Lecture.jsx";
import Quiz from "./Quiz.jsx";
import Submission from "./Submission.jsx";
import useContentApi from "../../../../course-hooks/useContentApi.js";
import useCurrentStudent from "../../../../learner-hooks/useCurrentStudent";
import useStudentCourseApi from "../../../../learner-hooks/useStudentCourseApi.js";

const StudentContentPage = () => {
    const { courseId, contentId } = useParams();

    const { getStudentContentDetails } = useContentApi();
    const { student } = useCurrentStudent();
    const { getEnrolledCourseIdsByStudent, isContentCompleted } = useStudentCourseApi()

    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Check if student is enrolled in this course
                if (!student?.id) {
                    setError("Student not loaded.");

                    return;
                }

                const enrolledIds = await getEnrolledCourseIdsByStudent(student.id);
                const enrolled = enrolledIds.includes(parseInt(courseId));

                if (!enrolled) {
                    setError("Cannot access this content ! You are not enrolled in this course.");

                    return; // stop fetching content
                }

                // 2. Fetch content details
                const data = await getStudentContentDetails(contentId);

                const isCompleted = await isContentCompleted(student?.id, courseId, contentId);

                if (data) {
                    data.courseId = courseId;
                    data.completed = isCompleted;
                }

                setContent(data);

            } catch (err) {
                console.error(err);
                setError("Failed to load content.");
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [contentId, courseId, getStudentContentDetails, student?.id, getEnrolledCourseIdsByStudent, isContentCompleted]);


    if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!content) return <Alert variant="warning">Content not found</Alert>;

    const renderContent = () => {
        switch (content.type) {
            case "LECTURE":
                return <Lecture content={content} />;
            case "QUIZ":
                return <Quiz content={content} />;
            case "SUBMISSION":
                return <Submission content={content} />;
            default:
                return <p>Unknown content type.</p>;
        }
    };

    return (
        <Container className="py-5">
            {renderContent()}
        </Container>
    );
};

export default StudentContentPage;
