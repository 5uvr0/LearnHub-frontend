import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Lecture = ({ content }) => {
    const navigate = useNavigate();

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

export default Lecture;
