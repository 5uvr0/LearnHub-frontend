import React, { useState } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useStudentCourseApi from "../../../../learner-hooks/useStudentCourseApi.js";


const studentId = 1;

const Lecture = ({ content }) => {
    const navigate = useNavigate();
    const { markContentCompleted } = useStudentCourseApi();
    const [marking, setMarking] = useState(false);

    const handleMarkCompleted = async () => {
        setMarking(true);

        try {
            await markContentCompleted(studentId, content.id);
            alert("Lecture marked as completed!");
            navigate(-1);

        } catch (err) {
            console.error(err);
            alert("Failed to mark as completed: " + err.message);

        } finally {
            setMarking(false);
        }
    };

    return (
        <Container className="py-4">
            <h2 className="fw-bold mb-3">{content.title}</h2>

            {content.description && (
                <p dangerouslySetInnerHTML={{ __html: content.description }}></p>
            )}

            {content.videoUrl && (
                <div className="my-4">
                    <video src={content.videoUrl} controls className="w-100" />
                </div>
            )}

            {content.resourceLink && (
                <p>
                    Resource:{" "}
                    <a
                        href={content.resourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download
                    </a>
                </p>
            )}

            <div className="d-flex gap-2 mt-3">
                <Button
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                >
                    &larr; Back
                </Button>

                <Button
                    variant="success"
                    onClick={handleMarkCompleted}
                    disabled={marking}
                >
                    {marking ? (
                        <>
                            <Spinner
                                animation="border"
                                size="sm"
                                className="me-2"
                            />
                            Marking...
                        </>
                    ) : (
                        "Mark as Completed"
                    )}
                </Button>
            </div>
        </Container>
    );
};

export default Lecture;
