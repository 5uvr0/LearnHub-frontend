// src/pages/CoursesPage.jsx

import React, { useEffect } from 'react';
import { Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/course/cards/CourseCard';
import texts from '../i18n/texts';
import useCourseApi from '../course-hooks/useCourseApi';

const CoursesPage = () => {
  const navigate = useNavigate();
  const { data: courses, loading, error, getAllCoursesCatalog } = useCourseApi();

  useEffect(() => {
    getAllCoursesCatalog?.();
  }, [getAllCoursesCatalog]);

  const handleCourseDetailsClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <section className="courses-page py-5">
      <Container>
        <h2 className="text-center mb-5 fw-bold text-primary">{texts.sections?.allCourses}</h2>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" role="status" className="mb-3">
              <span className="visually-hidden">Loading courses...</span>
            </Spinner>
            <p className="text-muted">Loading courses...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="text-center">
            {texts.alerts?.apiError?.(error?.message || 'Failed to load courses.')}
          </Alert>
        )}

        {!loading && !error && (!courses || courses?.length === 0) && (
          <Alert variant="info" className="text-center">
            {texts.alerts?.noCoursesFound}
          </Alert>
        )}

        {!loading && !error && courses && courses?.length > 0 && (
          <Row className="g-4">
            {courses?.map((course, key = course.id) => (
              <Col md={6} lg={4} key={course?.courseId}>
                <CourseCard
                  course={course}
                  onDetailsClick={handleCourseDetailsClick}
                  learnMoreText={texts.courseCard?.learnMore}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default CoursesPage;