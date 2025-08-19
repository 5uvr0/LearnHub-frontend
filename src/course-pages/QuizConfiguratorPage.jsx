// src/pages/QuizConfiguratorPage.jsx

import React, { useEffect, useState } from 'react';
import {Container, Spinner, Alert, ListGroup, Form, InputGroup, Modal, Badge} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faCheckCircle, faTimesCircle, faCloudUploadAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import CustomButton from '../components/common/CustomButton';
import texts from '../i18n/texts';
import useContentApi from '../course-hooks/useContentApi';
import ContentPublishModal from '../components/course/modals/ContentPublishModal';

const QuizConfiguratorPage = () => {
    const { contentId: quizReleaseIdParam } = useParams();
    const quizReleaseId = parseInt(quizReleaseIdParam);

    const {
        data: quizToDisplay,
        loading: loadingParentQuiz,
        error: parentQuizError,
        getContentReleaseById,
    } = useContentApi();

    const {
        publishContentRelease,
        loading: loadingQuizApi,
        error: quizApiError,
    } = useContentApi();

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [questions, setQuestions] = useState([]); // Re-add questions state

    const [showPublishModal, setShowPublishModal] = useState(false);
    const [quizToPublish, setQuizToPublish] = useState(null);

    useEffect(() => {
        if (isNaN(quizReleaseId)) {
            console.error("Invalid quiz content ID provided in URL.");
            return;
        }
        getContentReleaseById?.(quizReleaseId);
    }, [quizReleaseId, refreshTrigger, getContentReleaseById]);

    useEffect(() => {
        if (quizToDisplay) {
            if (quizToDisplay.type === 'QUIZ') {
                setQuestions(quizToDisplay?.questions || []);
                setQuizToPublish(quizToDisplay);
            } else {
                setQuestions([]);
                setQuizToPublish(null);
            }
        }
    }, [quizToDisplay]);

    const handleOpenPublishQuizModal = async () => {
        if (quizToPublish) {
            setShowPublishModal(true);
        } else {
            alert("No quiz content loaded to publish.");
        }
    };

    const handleConfirmPublishQuiz = async (payload) => {
        try {
            await publishContentRelease?.(payload?.id, payload);
            alert(texts.alerts?.contentPublishedSuccess);
            setShowPublishModal(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            alert(texts.alerts?.apiError?.(quizApiError?.message || err?.message));
        }
    };

    if (loadingParentQuiz) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading quiz...</span>
                </Spinner>
                <p className="mt-3">Loading quiz configurator...</p>
            </Container>
        );
    }

    if (parentQuizError || quizApiError) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{texts.alerts?.apiError?.(parentQuizError?.message || quizApiError?.message)}</Alert>
            </Container>
        );
    }

    if (!quizToDisplay || quizToDisplay?.type !== 'QUIZ') {
        return (
            <Container className="py-5">
                <Alert variant="warning">Quiz content not found or is not of type 'QUIZ' (ID: {quizReleaseId}).</Alert>
            </Container>
        );
    }

    const quizContentRelease = quizToDisplay?.currentContentRelease || quizToDisplay?.contentReleases?.[0];

    return (
        <section className="quiz-configurator-page py-5">
            <Container>
                <h2 className="mb-4 fw-bold text-primary text-center">
                    {texts.sections?.quizConfigurator}: {quizToDisplay?.title}
                    {quizToDisplay?.releaseNum !== 0 ? (
                        <Badge bg="success"
                               className="me-2 mb-md-2 ms-2">{texts?.sections.published}</Badge>
                    ) : (
                        <Badge bg="danger"
                               className="me-2 mb-md-2">{texts?.sections.draft}</Badge>
                    )}
                </h2>
                <p className="text-center text-muted">Content ID: {quizReleaseId}</p>

                <div className="d-flex justify-content-end mb-4">
                    <CustomButton variant="success" icon={faCloudUploadAlt} onClick={handleOpenPublishQuizModal} isLoading={loadingQuizApi}>
                        {texts.sections?.publish} Quiz
                    </CustomButton>
                </div>

                {/*{JSON.stringify(quizToDisplay)}*/}

                <Alert variant="info" className="text-center">
                    Click "Publish Quiz" to add, edit, or delete questions and options.
                </Alert>

                {/* List of Questions */}
                <h3 className="mb-4 fw-bold text-secondary">{texts.sections?.quizQuestions}</h3>
                {questions?.length > 0 ? (
                    <ListGroup className="g-3">
                        {questions?.map((question) => (
                            <ListGroup.Item key={question?.id} className="mb-3 p-3 shadow-sm rounded-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="mb-0">{question?.questionText}</h5>
                                    {/* Edit and Delete buttons for the modal */}
                                </div>
                                {/* Options List */}
                                <h6 className="text-muted mt-3">{texts.sections?.options}</h6>
                                {question?.options?.length > 0 ? (
                                    <ListGroup className="ms-3">
                                        {question.options?.map((opt) => (
                                            <ListGroup.Item key={opt?.id} className="d-flex justify-content-between align-items-center py-2 px-3 bg-light-subtle">
                                                <span>
                                                    {opt?.optionText}
                                                    {opt?.correct && <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />}
                                                    {!opt?.correct && <FontAwesomeIcon icon={faTimesCircle} className="ms-2 text-danger" />}
                                                </span>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p className="text-muted ms-3">No options added yet.</p>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <Alert variant="info" className="text-center">No questions found for this quiz.</Alert>
                )}
            </Container>

            <ContentPublishModal
                show={showPublishModal}
                onHide={() => setShowPublishModal(false)}
                contentToPublish={quizToPublish}
                parentContent={quizToDisplay}
                onConfirmPublish={handleConfirmPublishQuiz}
                isLoading={loadingQuizApi}
            />
        </section>
    );
};

export default QuizConfiguratorPage;