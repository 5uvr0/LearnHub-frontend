// src/pages/CoursePublicView.jsx

import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import texts from '../i18n/texts';
import useCourseApi from '../course-hooks/useCourseApi'; // For fetching public course details

const CoursePublicView = () => {
    const { id: courseIdParam } = useParams();
    const courseId = parseInt(courseIdParam);

    const { data: course, loading, error, getCourseByIdPublic } = useCourseApi();

    useEffect(() => {
        if (isNaN(courseId)) {
            console.error("Invalid course ID provided in URL for public view.");
            return;
        }
        getCourseByIdPublic(courseId); // Fetch public course details (CourseCatalogDTO)
    }, [courseId, getCourseByIdPublic]);

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3">Loading public course view...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{texts.alerts.apiError(error?.message)}</Alert>
            </Container>
        );
    }

    if (!course) {
        return (
            <Container className="py-5">
                <Alert variant="warning">{texts.alerts.courseNotFound}</Alert>
            </Container>
        );
    }

    return (
        <section className="course-public-view py-5">
            <Container>
                <h2 className="mb-4 fw-bold text-primary text-center">
                    {texts.sections.coursePublicView}: {course?.name} {/* New text entry needed for texts.sections.coursePublicView */}
                </h2>
                <div className="row mb-5 align-items-center">
                    <div className="col-md-4 text-center">
                        <img
                            src={course?.imageUrl || "https://placehold.co/300x200/cccccc/333333?text=Course"}
                            alt={course?.name || 'Course Image'}
                            className="img-fluid rounded-4 shadow-sm"
                        />
                    </div>
                    <div className="col-md-8">
                        <p className="lead text-secondary">{course?.description}</p>
                        <p className="mb-0"><strong>Instructor:</strong> {course?.instructorName}</p>
                        <p><strong>Course ID:</strong> {course?.courseId}</p>
                        <p><strong>Published Version:</strong> {course?.currentPublishedVersion || 'N/A'}</p>
                        <hr />
                        <p className="text-muted fst-italic">
                            {/* Message indicating this is a public view without detailed content */}
                            {texts.sections.publicViewNote} {/* New text entry needed */}
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default CoursePublicView;