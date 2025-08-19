import React, { useEffect, useState } from "react";
import { Container, Button, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import useSubmissionApi from "../../../../learner-hooks/useSubmisionApi.js";
import useFileApi from "../../../../file-server-hooks/useServerApi.js";
import {generateSignature} from "../../../../utils/fileSignature.js";

const studentId= 1

const Submission = ({ content }) => {
    const navigate = useNavigate();

    const { getSubmissionsByStudentAndContent, submitAssignment } = useSubmissionApi();
    const { uploadFile, downloadFile} = useFileApi();


    const [selectedFile, setSelectedFile] = useState(null);

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        console.log("useEffect triggered with:", { studentId, content });

        if (studentId && content?.id) {
            console.log("Hitting to get Submissions!");
            setLoading(true);

            getSubmissionsByStudentAndContent(studentId, content.id)
                .then((data) => {
                    console.log("Fetched submissions:", data);
                    setSubmissions(data || []);

                })
                .finally(() => setLoading(false));
        }
    }, [studentId, content?.id, getSubmissionsByStudentAndContent]);

    const latestSubmission = submissions.length > 0 ? submissions[0] : null;

    const handleSubmit = async () => {
        if (!selectedFile) {
            alert("Please select a file to submit");
            return;
        }

        try {
            // Step 1: Upload the file
            const uploadedFile = await uploadFile(selectedFile, {
                uploaderEmail: studentId,
            });

            console.log("File uploaded")
            console.log(uploadedFile)

            // Step 2: Submit assignment with uploaded file DTO
            const submission = await submitAssignment(studentId, content.id, uploadedFile);

            console.log("Submission added")
            console.log(submission)

            alert(`Submission successful! Submission ID: ${submission}`);

            // Optionally, refresh submissions list
            const data = await getSubmissionsByStudentAndContent(studentId, content.id);

            setSubmissions(data || []);

            setSelectedFile(null); // reset file input

        } catch (err) {
            console.error(err);
            alert("Error submitting assignment");
        }
    };

    const handleDownload = async (fileDto) => {
        try {

            console.log(fileDto)

            // Step 1: generate HMAC signature for this file
            const signature = generateSignature(fileDto);

            console.log(fileDto.formId)
            console.log(signature)

            // Step 2: fetch the file blob
            const blob = await downloadFile(fileDto.formId, signature);

// optional: ensure type matches
            const fileBlob = new Blob([blob], { type:  fileDto.contentType });

            const url = window.URL.createObjectURL(fileBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileDto.originalFileName;
            a.click();
            window.URL.revokeObjectURL(url);



        } catch (err) {
            console.error("Download failed", err);
            alert("Error downloading file");
        }
    };



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
                        onClick={() => handleDownload(latestSubmission)}
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
