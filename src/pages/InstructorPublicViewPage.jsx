// src/pages/InstructorPublicViewPage.jsx

import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Card, Carousel } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import CourseCard from '../components/cards/CourseCardCarousel';
import texts from '../i18n/texts';
import useInstructorApi from '../hooks/useInstructorApi';
import useCourseApi from '../hooks/useCourseApi';
import { getRandomModerateColor } from '../utils/colorUtils';

const InstructorPublicViewPage = () => {
    const { id: instructorIdParam } = useParams();
    const instructorId = parseInt(instructorIdParam);
    const navigate = useNavigate();

    const { data: instructor, loading: loadingInstructor, error: instructorError, getInstructorByIdPublic } = useInstructorApi();
    const { data: coursesTaught, loading: loadingCourses, error: coursesError, getCoursesByInstructorIdPublic } = useCourseApi();

    useEffect(() => {
        if (isNaN(instructorId)) {
            console.error("Invalid instructor ID provided in URL for public view.");
            return;
        }
        getInstructorByIdPublic?.(instructorId);
        getCoursesByInstructorIdPublic?.(instructorId); // Fetch public courses taught by this instructor
    }, [instructorId, getInstructorByIdPublic, getCoursesByInstructorIdPublic]);

    const handleCourseDetailsClick = (courseId) => {
        // For public view, navigate to the public course overview page
        navigate(`/courses/${courseId}`);
    };

    // Determine background color for placeholder if no image
    const backgroundColor = getRandomModerateColor();
    const borderColor = getRandomModerateColor();

    if (loadingInstructor || loadingCourses) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading instructor profile...</span>
                </Spinner>
                <p className="mt-3">Loading instructor profile...</p>
            </Container>
        );
    }

    if (instructorError || coursesError) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    {texts.alerts?.apiError?.(instructorError?.message || coursesError?.message || texts.alerts?.failedToLoadInstructors)}
                </Alert>
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
        <section className="instructor-public-view-page py-5">
            <Container>
                <h2 className="mb-4 fw-bold text-primary text-center">{texts.sections?.instructorPublicProfile}</h2>

                <Card className="shadow-sm border-0 rounded-4 mb-5 p-4 text-center text-md-start"
                    // style={{width: '200px'}}
                >
                    <Row className="align-items-center">
                        <Col md={4} className="text-center mb-3 mb-md-0">
                            <div
                                      className="rounded-circle d-flex align-items-center justify-content-center text-white font-bold text-2xl mb-3"
                                      style={{
                                        width: '200px',
                                        height: '200px',
                                        backgroundColor: backgroundColor,
                                        border: `3px solid ${borderColor}`,
                                      }}
                                    >
                                      {/* Use FontAwesomeIcon for the placeholder */}
                                      <FontAwesomeIcon icon={faUserGraduate} size="5x" />
                                    </div>
                        </Col>
                        <Col md={8}>
                            <h3 className="fw-bold text-primary mb-2">{instructor?.name}</h3>
                            <p className="text-muted mb-2">
                                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                                {instructor?.email}
                            </p>
                            {/* Add more instructor details here if available from API */}
                        </Col>
                    </Row>
                </Card>

                <h3 className="mb-4 fw-bold text-secondary text-center">{texts.sections?.coursesTaught}</h3>
                {!loadingCourses && !coursesError && (!coursesTaught || coursesTaught?.length === 0) ? (
                    <Alert variant="info" className="text-center">
                        {texts.sections?.noCoursesTaughtPublic}
                    </Alert>
                ) : (
                    <Carousel indicators={false} interval={3000} pause="hover" className="course-carousel pb-5">
                        {/* Group courses into sets of 3 for display in carousel items */}
                        {coursesTaught && coursesTaught.reduce((acc, course, index) => {
                            const groupIndex = Math.floor(index / 3);
                            if (!acc[groupIndex]) acc[groupIndex] = [];
                            acc[groupIndex].push(course);
                            return acc;
                        }, [])?.map((courseGroup, groupIndex) => (
                            <Carousel.Item key={groupIndex}>
                                <Row className="justify-content-center g-2">
                                    {courseGroup?.map((course) => (
                                        <Col md={4} key={course?.courseId} className="d-flex">
                                            <CourseCard
                                                course={course}
                                                onDetailsClick={handleCourseDetailsClick}
                                                learnMoreText={texts.courseCard?.learnMore}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}
            </Container>
        </section>
    );
};

export default InstructorPublicViewPage;