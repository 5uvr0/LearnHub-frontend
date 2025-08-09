// src/pages/QuizConfiguratorPage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, ListGroup, Form, Button, InputGroup, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import CustomButton from '../components/common/CustomButton';
import texts from '../i18n/texts';
import useContentApi from '../hooks/useContentApi'; // For quiz question APIs

const QuizConfiguratorPage = () => {
    const { contentId: quizContentIdParam } = useParams();
    const quizContentId = parseInt(quizContentIdParam);

    // We'll fetch the content details to get its current questions
    const { data: quizContent, loading: loadingQuiz, error: quizError, getContentReleaseById, createNewQuizQuestion, deleteQuizQuestion } = useContentApi();

    const [questions, setQuestions] = useState([]);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        if (isNaN(quizContentId)) {
            console.error("Invalid quiz content ID provided in URL.");
            return;
        }
        // Fetch the specific quiz content to get its questions
        getContentReleaseById?.(quizContentId);
    }, [quizContentId, refreshTrigger, getContentReleaseById]);

    useEffect(() => {
        if (quizContent && quizContent?.questions) {
            setQuestions(quizContent.questions);
        }
    }, [quizContent]);

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!newQuestionText.trim()) {
            alert("Question text cannot be empty.");
            return;
        }
        try {
            // API call to create a new quiz question
            const newQuestion = {
                questionText: newQuestionText,
                quizId: quizContentId, // Associate with this quiz content
                options: [], // Start with no options, add them separately
            };
            await createNewQuizQuestion?.(newQuestion);
            alert(texts.alerts?.questionAddedSuccess);
            setNewQuestionText('');
            setRefreshTrigger(prev => prev + 1); // Trigger re-fetch of quiz content
        } catch (err) {
            alert(texts.alerts?.apiError?.(quizError?.message || err?.message));
        }
    };

    const handleDeleteQuestion = async (questionId, questionText) => {
        if (window.confirm(`Are you sure you want to delete question: "${questionText}"?`)) {
            try {
                await deleteQuizQuestion?.(questionId);
                alert(texts.alerts?.questionDeletedSuccess);
                setRefreshTrigger(prev => prev + 1); // Trigger re-fetch
            } catch (err) {
                alert(texts.alerts?.apiError?.(quizError?.message || err?.message));
            }
        }
    };

    // Placeholder for Option management (will be more complex)
    const handleAddOption = (questionId) => {
        alert(`Functionality to add options for question ID ${questionId} not yet implemented.`);
        // You would typically open a modal or inline form here
    };

    const handleDeleteOption = (optionId, optionText) => {
        alert(`Functionality to delete option ID ${optionId} ("${optionText}") not yet implemented.`);
    };


    if (loadingQuiz) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading quiz...</span>
                </Spinner>
                <p className="mt-3">Loading quiz configurator...</p>
            </Container>
        );
    }

    if (quizError) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{texts.alerts?.apiError?.(quizError?.message)}</Alert>
            </Container>
        );
    }

    if (!quizContent || quizContent?.type !== 'QUIZ') {
        return (
            <Container className="py-5">
                <Alert variant="warning">Quiz content not found or is not of type 'QUIZ' (ID: {quizContentId}).</Alert>
            </Container>
        );
    }

    return (
        <section className="quiz-configurator-page py-5">
            <Container>
                <h2 className="mb-4 fw-bold text-primary text-center">
                    {texts.sections?.quizConfigurator}: {quizContent?.title}
                </h2>
                <p className="text-center text-muted">Content ID: {quizContentId}</p>

                {/* Add New Question Form */}
                <Form onSubmit={handleAddQuestion} className="mb-5 p-4 border rounded-4 shadow-sm bg-light">
                    <h4 className="mb-3 text-secondary">{texts.sections?.addQuestion}</h4>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder={texts.sections?.questionText}
                            value={newQuestionText}
                            onChange={(e) => setNewQuestionText(e.target.value)}
                        />
                        <CustomButton variant="primary" type="submit" icon={faPlus}>
                            {texts.sections?.addQuestion}
                        </CustomButton>
                    </InputGroup>
                </Form>

                {/* List of Questions */}
                <h3 className="mb-4 fw-bold text-secondary">{texts.sections?.quizQuestions}</h3>
                {questions?.length > 0 ? (
                    <ListGroup className="g-3">
                        {questions?.map((question) => (
                            <ListGroup.Item key={question?.id} className="mb-3 p-3 shadow-sm rounded-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="mb-0">{question?.questionText}</h5>
                                    <CustomButton variant="outline-danger" size="sm" icon={faTrash} onClick={() => handleDeleteQuestion(question?.id, question?.questionText)}>
                                        Delete
                                    </CustomButton>
                                </div>
                                {/* Options List */}
                                <h6 className="text-muted mt-3">{texts.sections?.options}</h6> {/* Need to add 'options' to texts.sections */}
                                {question?.options?.length > 0 ? (
                                    <ListGroup className="ms-3">
                                        {question.options?.map((option) => (
                                            <ListGroup.Item key={option?.id} className="d-flex justify-content-between align-items-center py-2 px-3 bg-light-subtle">
                                                <span>
                                                    {option?.optionText}
                                                    {option?.correct && <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />}
                                                    {!option?.correct && <FontAwesomeIcon icon={faTimesCircle} className="ms-2 text-danger" />}
                                                </span>
                                                <CustomButton variant="outline-danger" size="sm" icon={faTrash} onClick={() => handleDeleteOption(option?.id, option?.optionText)}>
                                                    Delete
                                                </CustomButton>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p className="text-muted ms-3">No options added yet.</p>
                                )}
                                <div className="text-end mt-3">
                                    <CustomButton variant="info" size="sm" icon={faPlus} onClick={() => handleAddOption(question?.id)}>
                                        {texts.sections?.addOption}
                                    </CustomButton>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <Alert variant="info" className="text-center">No questions found for this quiz.</Alert>
                )}
            </Container>
        </section>
    );
};

export default QuizConfiguratorPage;