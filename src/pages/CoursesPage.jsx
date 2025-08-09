// src/pages/CoursesPage.jsx

import React, { useEffect } from 'react';
import { Container, Alert, Spinner, Row, Col } from 'react-bootstrap'; // Import Row, Col, Alert, Spinner
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/cards/CourseCard';
import texts from '../i18n/texts';
import useCourseApi from '../hooks/useCourseApi'; // Import the API hook

const CoursesPage = () => {
  const navigate = useNavigate();
  // Destructure data, loading, error, and the specific fetch function from your API hook
  const { data: courses, loading, error, getAllCoursesCatalog } = useCourseApi();

  useEffect(() => {
    // Call the API function to fetch all courses when the component mounts
    getAllCoursesCatalog();
  }, []); // Empty dependency array means this effect runs only once after the initial render

  const handleCourseDetailsClick = (courseId) => {
    // Navigate to the course details page, using the actual courseId from the fetched data
    navigate(`/courses/${courseId}`);
  };

  return (
    <section className="courses-page py-5">
      <Container>
        <h2 className="text-center mb-5 fw-bold text-primary">{texts.sections.allCourses}</h2>

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
            {texts.alerts.apiError(error?.message || 'Failed to load courses.')} {/* Optional chaining for error.message */}
          </Alert>
        )}

        {!loading && !error && (!courses || courses?.length === 0) && (
          <Alert variant="info" className="text-center">
            {texts.alerts.noCoursesFound}
          </Alert>
        )}

        {!loading && !error && courses && courses?.length > 0 && (
          <Row className="g-4">
            {courses?.map((course) => ( // Optional chaining for courses array
              <Col md={6} lg={4} key={course?.courseId}> {/* Optional chaining for course and courseId */}
                <CourseCard
                  course={course} // Pass the entire course object
                  onDetailsClick={handleCourseDetailsClick}
                  learnMoreText={texts.courseCard?.learnMore} // Optional chaining
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