import React, { useEffect, useState } from "react";
import { Container, Button, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const Submission = ({ content, studentId, getSubmissionsByStudentAndContent }) => {
    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (studentId && content?.id) {
            setLoading(true);
            getSubmissionsByStudentAndContent(studentId, content.id)
                .then((data) => {
                    setSubmissions(data || []);
                })
                .finally(() => setLoading(false));
        }
    }, [studentId, content?.id, getSubmissionsByStudentAndContent]);

    const latestSubmission = submissions.length > 0 ? submissions[0] : null;

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

            {/* Upload Section */}
            <div className="mt-4 mb-5">
                <label htmlFor="submissionFile" className="form-label">
                    Upload your submission
                </label>
                <input type="file" id="submissionFile" className="form-control" />
            </div>

            {/* Submissions Section */}
            <h4 className="fw-bold mt-4">Your Submission</h4>
            {loading ? (
                <Spinner animation="border" />
            ) : latestSubmission ? (
                <Card className="p-3 mb-3 shadow-sm">
                    <p>
                        <strong>File:</strong> {latestSubmission.originalFileName}
                    </p>
                    <p>
                        <strong>Type:</strong> {latestSubmission.contentType}
                    </p>
                    <p>
                        <strong>Submitted:</strong>{" "}
                        {new Date(latestSubmission.submittedAt).toLocaleString()}
                    </p>
                    <Button
                        variant="link"
                        onClick={() => alert("TODO: Implement download")}
                    >
                        Download
                    </Button>
                </Card>
            ) : (
                <p className="text-muted">No submission yet.</p>
            )}

            {/* Expandable History */}
            {submissions.length > 1 && (
                <div className="mb-3">
                    <div
                        className="d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        <FontAwesomeIcon
                            icon={showHistory ? faChevronDown : faChevronRight}
                            className="text-primary me-2"
                        />
                        <span className="fw-bold">Submission History</span>
                    </div>

                    {showHistory && (
                        <div className="mt-2">
                            {submissions.slice(1).map((s) => (
                                <Card key={s.id} className="p-2 mb-2">
                                    <small>
                                        <strong>{s.originalFileName}</strong> ({s.contentType}) <br />
                                        Submitted at:{" "}
                                        {new Date(s.submittedAt).toLocaleString()}
                                    </small>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
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

export default Submission;
