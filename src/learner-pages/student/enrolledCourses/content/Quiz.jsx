import React from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Quiz = ({ content }) => {
    const navigate = useNavigate();

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

            <Row className="mt-4">
                <Col>
                    <Button
                        variant="outline-secondary"
                        onClick={() => navigate(-1)}
                    >
                        &larr; Back
                    </Button>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="primary"
                        onClick={() => alert("Submit button clicked (not yet functional)")}
                    >
                        Submit
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Quiz;
