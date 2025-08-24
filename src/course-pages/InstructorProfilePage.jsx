// src/pages/course-pages/InstructorProfilePage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import useInstructorApi from '../course-hooks/useInstructorApi';
import texts from '../i18n/texts';
import CustomButton from '../components/common/CustomButton';
import InstructorEditModal from '../components/course/modals/InstructorEditModal'; // New modal for editing

const InstructorProfilePage = () => {
    const navigate = useNavigate();

    const {
        data: instructor, // This will hold the fetched instructor profile
        loading: loadingInstructor,
        error: instructorError,
        getMyProfile, // API call to fetch the logged-in instructor's profile
        softDeleteInstructor,
        updateInstructor
    } = useInstructorApi();

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        // Call getMyProfile directly as it should fetch the currently logged-in user's profile
        getMyProfile();
    }, [refreshTrigger, getMyProfile]); // Dependency on refreshTrigger to refetch after edits

    const handleEditProfile = () => {
        // No need to pass instructorData here, as the modal will receive the 'instructor' prop
        setShowEditModal(true);
    };

    const handleSaveProfile = async (updatedData) => {
        if (!instructor?.id) {
            alert(texts.alerts?.apiError?.('Instructor ID not available for update.'));
            return;
        }
        try {
            // Use the ID from the fetched instructor data
            await updateInstructor?.(instructor.id, updatedData);
            alert(texts.alerts?.instructorUpdatedSuccess);
            setShowEditModal(false);
            setRefreshTrigger(prev => prev + 1); // Trigger a re-fetch of the profile
        } catch (err) {
            alert(texts.alerts?.apiError?.(err.message || 'Failed to update instructor.'));
        }
    };

    const handleDeleteProfile = async () => {
        if (!instructor?.id) {
            alert(texts.alerts?.apiError?.('Instructor ID not available for deletion.'));
            return;
        }
        if (window.confirm(texts.instructorCard?.confirmDelete?.(instructor?.name))) {
            try {
                // Use the ID from the fetched instructor data
                await softDeleteInstructor?.(instructor.id);
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

    // Check if instructor data is available after loading, before rendering
    if (!instructor) {
        return (
            <Container className="py-5">
                <Alert variant="warning">{texts.alerts?.instructorNotFound || 'Instructor profile not found.'}</Alert>
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
                instructor={instructor} // Pass the fetched instructor object directly
                onSave={handleSaveProfile}
                isLoading={loadingInstructor}
            />
        </Container>
    );
};

export default InstructorProfilePage;