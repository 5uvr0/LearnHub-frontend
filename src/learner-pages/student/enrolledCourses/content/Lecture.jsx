import React, { useState } from "react";
import { Container, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useStudentCourseApi from "../../../../learner-hooks/useStudentCourseApi.js";
import useCurrentStudent from "../../../../learner-hooks/useCurrentStudent.js";

const Lecture = ({ content }) => {
    const navigate = useNavigate();
    const { student, loading: studentLoading, error: studentError } = useCurrentStudent();
    const { markContentCompleted } = useStudentCourseApi();
    const [marking, setMarking] = useState(false);

    const handleMarkCompleted = async () => {
        if (!student?.id) {
            alert("Cannot mark completed: student not loaded.");
            return;
        }

        if (content.completed) {
            alert("This lecture is already marked as completed.");
            return;
        }

        setMarking(true);

        try {
            await markContentCompleted(student.id, content.courseId, content.id);
            alert("Lecture marked as completed!");
            navigate(-1);
        } catch (err) {
            console.error(err);
            alert("Failed to mark as completed: " + err.message);
        } finally {
            setMarking(false);
        }
    };

    if (studentLoading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status" />
                <p className="mt-3">Loading student info...</p>
            </Container>
        );
    }

    if (studentError) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{`Failed to load student info: ${studentError}`}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="fw-bold mb-0">{content.title}</h2>
                {content.completed && (
                    <Badge
                        bg="success"
                        className="fs-6 px-3 py-1 rounded-pill shadow-sm"
                        style={{ fontWeight: "500" }}
                    >
                        ✓ Completed
                    </Badge>
                )}
            </div>



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

                {!content.completed && (
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
                )}
            </div>
        </Container>
    );
};

export default Lecture;
