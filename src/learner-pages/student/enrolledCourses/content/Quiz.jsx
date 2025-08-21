import React, { useState } from "react";
import { Container, Button, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useSubmissionApi from "../../../../learner-hooks/useSubmisionApi.js";
import useCurrentStudent from "../../../../learner-hooks/useCurrentStudent.js";

const Quiz = ({ content }) => {
    const navigate = useNavigate();
    const { student, loading: studentLoading, error: studentError } = useCurrentStudent();
    const [answers, setAnswers] = useState({});
    const { submitQuiz, loading: submitLoading, error: submitError } = useSubmissionApi();

    const handleSelect = (questionId, optionId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: [optionId] // wrap in array to match backend DTO
        }));
    };

    const handleSubmit = async () => {
        if (!student?.id) {
            alert("Cannot submit quiz: student not loaded.");
            return;
        }

        const submissionPayload = {
            studentId: student.id,
            contentId: content.id,
            answers: answers,
            quiz: content
        };

        try {
            const result = await submitQuiz(submissionPayload);

            alert(
                `Score: ${result.scorePercentage}% - ${
                    result.passed ? "Passed 🎉" : "Failed ❌, You need to score at least 60% to pass!"
                }`
            );

            navigate(-1);

        } catch (err) {
            console.error(err);
            alert("Error submitting quiz");
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
            <h2 className="fw-bold mb-3">{content.title}</h2>

            {content.description && (
                <p dangerouslySetInnerHTML={{ __html: content.description }}></p>
            )}

            {content.questions?.map((q, idx) => (
                <Card key={q.id} className="mb-3 shadow-sm">
                    <Card.Body>
                        <p className="fw-semibold">{idx + 1}. {q.questionText}</p>
                        <ul className="list-unstyled">
                            {q.options.map((opt) => (
                                <li key={opt.id} className="mb-1">
                                    <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        id={`option-${opt.id}`}
                                        onChange={() => handleSelect(q.id, opt.id)}
                                    />
                                    <label htmlFor={`option-${opt.id}`} className="ms-2">
                                        {opt.optionText}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </Card.Body>
                </Card>
            ))}

            {submitError && (
                <Alert variant="danger" className="mt-3">
                    {submitError}
                </Alert>
            )}

            <Row className="mt-4">
                <Col>
                    <Button
                        variant="outline-secondary"
                        onClick={() => navigate(-1)}
                        disabled={submitLoading}
                    >
                        &larr; Back
                    </Button>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={submitLoading}
                    >
                        {submitLoading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Submitting...
                            </>
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Quiz;
