// src/components/course/modals/CourseMetadataEditModal.jsx

import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import CustomButton from '../common/CustomButton';

const CourseMetadataEditModal = ({show, onHide, course, onSave, isLoading}) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (course) {
            setTitle(course.name || '');
        }
    }, [course]);

    const handleSave = () => {
        if (!title.trim()) {
            alert('Course title cannot be empty.');
            return;
        }
        onSave?.(title);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Course Metadata</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="courseTitle">
                        <Form.Label>Course Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <CustomButton
                    variant="primary"
                    onClick={handleSave}
                    isLoading={isLoading}
                >
                    Save Changes
                </CustomButton>
            </Modal.Footer>
        </Modal>
    );
};

export default CourseMetadataEditModal;