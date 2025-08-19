import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import Lecture from "./Lecture.jsx";
import Quiz from "./Quiz.jsx";
import Submission from "./Submission.jsx";
import useStudentCourseApi from "../../../../course-hooks/useContentApi.js";

const StudentContentPage = () => {
    const { contentId } = useParams();
    const { getStudentContentDetails } = useStudentCourseApi();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const data = await getStudentContentDetails(contentId);

                setContent(data);

                console.log(data)

            } catch (err) {
                console.error(err);
                setError("Failed to load content.");

            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [contentId, getStudentContentDetails]);

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
