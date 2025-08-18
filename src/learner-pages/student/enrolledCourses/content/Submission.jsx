import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Submission = ({ content }) => {
    const navigate = useNavigate();

    return (
        <Container className="py-4">

            <h2 className="fw-bold mb-3">{content.title}</h2>

            {content.description && (
                <p dangerouslySetInnerHTML={{ __html: content.description }}></p>
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

            <div className="mt-4 mb-5">
                <label htmlFor="submissionFile" className="form-label">
                    Upload your submission
                </label>
                <input type="file" id="submissionFile" className="form-control" />
            </div>

            <Button
                variant="outline-secondary"
                className="mb-3"
                onClick={() => navigate(-1)}
            >
                &larr; Back
            </Button>

        </Container>
    );
};

export default Submission;
