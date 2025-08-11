// src/pages/CourseConfiguratorPage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import CourseForm from '../components/forms/CourseForm';
import useCourseApi from '../hooks/useCourseApi';
import texts from '../i18n/texts';

const CourseConfiguratorPage = () => {
    const { id: courseIdParam } = useParams(); // May be null if creating new
    const courseId = courseIdParam ? parseInt(courseIdParam) : null;
    const navigate = useNavigate();

    const { data: fetchedCourse, loading, error, createCourse, getDraftCourseById, updateCourse } = useCourseApi();
    const [initialCourseData, setInitialCourseData] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (courseId) {
            setIsEditMode(true);
            getDraftCourseById(courseId); // Fetch existing course data for editing
        } else {
            setIsEditMode(false);
            setInitialCourseData(null); // Clear form for new course
        }
    }, [courseId]);

    useEffect(() => {
        if (isEditMode && fetchedCourse) {
            setInitialCourseData(fetchedCourse);
        }
    }, [fetchedCourse, isEditMode]);

    const handleSubmit = async (formData) => {
        try {
            if (isEditMode && courseId) {
                await updateCourse(courseId, formData);
                alert(texts.alerts.courseUpdatedSuccess);
            } else {
                await createCourse(formData);
                alert(texts.alerts.courseCreatedSuccess);
            }
            navigate('/teacher/dashboard'); // Go back to dashboard after submission
        } catch (err) {
            alert(texts.alerts.apiError(error || err.message));
        }
    };

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading course data...</span>
                </Spinner>
                <p className="mt-3">Loading course data...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{texts.alerts.apiError(error)}</Alert>
            </Container>
        );
    }

    // If in edit mode and course data isn't loaded yet (after initial fetch or error), don't show form
    if (isEditMode && !initialCourseData && !loading && !error) {
        return (
            <Container className="py-5">
                <Alert variant="warning">{texts.alerts.courseNotFound}</Alert>
            </Container>
        );
    }

    return (
        <section className="course-configurator-page py-5">
            <Container>
                <h2 className="text-center mb-5 fw-bold text-primary">
                    {isEditMode ? texts.sections.editCourse : texts.sections.createCourse}
                </h2>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <CourseForm
                            initialData={initialCourseData || {}}
                            onSubmit={handleSubmit}
                            isEditMode={isEditMode}
                        />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default CourseConfiguratorPage;