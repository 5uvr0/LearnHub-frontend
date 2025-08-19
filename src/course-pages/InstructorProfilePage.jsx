// src/pages/course-pages/InstructorProfilePage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import useInstructorApi from '../course-hooks/useInstructorApi';
import texts from '../i18n/texts';
import CustomButton from '../components/common/CustomButton';
import InstructorEditModal from '../components/course/modals/InstructorEditModal'; // New modal for editing

const InstructorProfilePage = () => {
    const { id: instructorIdParam } = useParams();
    const instructorId = parseInt(instructorIdParam, 10);
    const navigate = useNavigate();

    const {
        data: instructor,
        loading: loadingInstructor,
        error: instructorError,
        getInstructorById,
        softDeleteInstructor,
        updateInstructor
    } = useInstructorApi();

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (isNaN(instructorId)) {
            console.error("Invalid instructor ID provided in URL.");
            return;
        }
        getInstructorById?.(instructorId);
    }, [instructorId, refreshTrigger, getInstructorById]);

    const handleEditProfile = (instructorData) => {
        setShowEditModal(true);
    };

    const handleSaveProfile = async (updatedData) => {
        try {
            await updateInstructor?.(instructorId, updatedData);
            alert(texts.alerts?.instructorUpdatedSuccess);
            setShowEditModal(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            alert(texts.alerts?.apiError?.(err.message || 'Failed to update instructor.'));
        }
    };

    const handleDeleteProfile = async () => {
        if (window.confirm(texts.instructorCard?.confirmDelete?.(instructor?.name))) {
            try {
                await softDeleteInstructor?.(instructorId);
                alert(texts.alerts?.instructorDeletedSuccess);
                navigate('/instructors'); // Navigate back to the list of instructors
            } catch (err) {
                alert(texts.alerts?.apiError?.(err.message || 'Failed to delete instructor.'));
            }
        }
    };

    if (loadingInstructor) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status" />
                <p className="mt-3">Loading instructor profile...</p>
            </Container>
        );
    }

    if (instructorError) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{texts.alerts?.apiError?.(instructorError.message)}</Alert>
            </Container>
        );
    }

    if (!instructor) {
        return (
            <Container className="py-5">
                <Alert variant="warning">{texts.alerts?.instructorNotFound}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Card className="p-4 shadow-sm border-0 rounded-4">
                <div className="text-end mb-3">
                    <CustomButton variant="warning" icon={faEdit} className="me-2" onClick={handleEditProfile}>
                        Edit Profile
                    </CustomButton>
                    <CustomButton variant="danger" icon={faTrash} onClick={handleDeleteProfile}>
                        Delete Profile
                    </CustomButton>
                </div>
                <div className="text-center mb-4">
                    <FontAwesomeIcon icon={faUserCircle} size="5x" className="text-secondary" />
                </div>
                <h2 className="text-center fw-bold text-primary">{instructor.name}</h2>
                <hr />
                <div className="px-4">
                    <p className="lead text-muted mb-4">{instructor.bio || 'No biography provided.'}</p>
                    <Row>
                        <Col md={6}>
                            <p><strong>Email:</strong> {instructor.email}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Phone:</strong> {instructor.phone || 'N/A'}</p>
                        </Col>
                    </Row>
                </div>
            </Card>

            <InstructorEditModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                instructor={instructor}
                onSave={handleSaveProfile}
                isLoading={loadingInstructor}
            />
        </Container>
    );
};

export default InstructorProfilePage;