// src/components/course/modals/StudentListModal.jsx

import React from 'react';
import { Modal, ListGroup, Button, Alert } from 'react-bootstrap';
import texts from '../../../i18n/texts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const StudentListModal = ({ show, onHide, students, isLoading, error }) => {
    return (
        <Modal show={show} onHide={onHide} centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>{texts.sections.enrolledStudents}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" role="status" />
                        <p className="mt-2">Loading students...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{texts.alerts.apiError(error.message)}</Alert>
                ) : students && students.length > 0 ? (
                    <ListGroup>
                        {students.map(student => (
                            <ListGroup.Item key={student.id} className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faUserCircle} size="2x" className="me-3 text-secondary" />
                                <div>
                                    <h6 className="mb-0">{student.firstName} {student.lastName}</h6>
                                    <small className="text-muted">{student.email}</small>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <Alert variant="info" className="text-center">
                        {texts.alerts.noStudentsEnrolled}
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StudentListModal;