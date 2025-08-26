import React, { useEffect, useState } from "react";
import { Container, Button, Card, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import useSubmissionApi from "../../../../learner-hooks/useSubmisionApi.js";
import useFileApi from "../../../../file-server-hooks/useServerApi.js";
import useCurrentStudent from "../../../../learner-hooks/useCurrentStudent.js";

const Submission = ({ content }) => {
    const navigate = useNavigate();
    const { student } = useCurrentStudent();
    const { getSubmissionsByStudentAndContent, submitAssignment, generateSignature } = useSubmissionApi();
    const { uploadFile, downloadFile } = useFileApi();

    const [selectedFile, setSelectedFile] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (student?.id && content?.id) {
            setLoading(true);
            getSubmissionsByStudentAndContent(student.id, content.id)
                .then((data) => setSubmissions(data || []))
                .finally(() => setLoading(false));
        }
    }, [student?.id, content?.id, getSubmissionsByStudentAndContent]);

    const handleSubmit = async () => {
        if (!selectedFile) {
            alert("Please select a file to submit");
            return;
        }

        try {
            const uploadedFile = await uploadFile(selectedFile, { uploaderEmail: student?.email });
            const submission = await submitAssignment(student?.id, content.id, uploadedFile);

            alert(`Submission successful! File name: ${submission.originalFileName}`);
            const data = await getSubmissionsByStudentAndContent(student?.id, content.id);
            setSubmissions(data || []);
            setSelectedFile(null);
        } catch (err) {
            console.error(err);
            alert(err?.message || "Error submitting assignment");
        }
    };

    const handleDownload = async (fileDto) => {
        try {
            const signature = await generateSignature(content.courseId, fileDto);
            const blob = await downloadFile(fileDto.formId, signature);
            const fileBlob = new Blob([blob], { type: fileDto.contentType });
            const url = window.URL.createObjectURL(fileBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileDto.originalFileName;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
            alert("Error downloading file: " + err.message);
        }
    };

    const latestSubmission = submissions.length > 0 ? submissions[0] : null;
    const completed = content.completed;

    return (
        <Container className="py-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="fw-bold mb-0">{content.title}</h2>
            </div>

            {completed && (
                <Alert variant="success" className="fw-semibold">
                    ✅ Instructor has approved your submission!
                </Alert>
            )}

            {content.description && (
                <p dangerouslySetInnerHTML={{ __html: content.description }}></p>
            )}

            {content.resourceLink && (
                <p>
                    Resource:{" "}
                    <a href={content.resourceLink} target="_blank" rel="noopener noreferrer">
                        Download
                    </a>
                </p>
            )}

            {/* Upload Section (disabled if completed) */}
            {!completed && (
                <div className="mt-4 mb-5">
                    <label htmlFor="submissionFile" className="form-label">
                        Upload your submission
                    </label>
                    <input
                        type="file"
                        id="submissionFile"
                        className="form-control"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                    <Button
                        variant="primary"
                        className="mt-2"
                        onClick={handleSubmit}
                        disabled={!selectedFile}
                    >
                        Submit Assignment
                    </Button>
                </div>
            )}

            {/* Submissions Section */}
            <h4 className="fw-bold mt-4">Your Submission</h4>
            {loading ? (
                <Spinner animation="border" />
            ) : latestSubmission ? (
                <Card className="p-3 mb-3 shadow-sm d-flex justify-content-between align-items-center">
                    <div>
                        <p><strong>File:</strong> {latestSubmission.originalFileName}</p>
                        <p><strong>Type:</strong> {latestSubmission.contentType}</p>
                        <p><strong>Submitted:</strong> {new Date(latestSubmission.submittedAt).toLocaleString()}</p>
                    </div>
                    <Button variant="outline-primary" onClick={() => handleDownload(latestSubmission)}>
                        <FontAwesomeIcon icon={faDownload} /> Download
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
                                        Submitted at: {new Date(s.submittedAt).toLocaleString()}
                                    </small>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
                &larr; Back
            </Button>
        </Container>
    );
};

export default Submission;
