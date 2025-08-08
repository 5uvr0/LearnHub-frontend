// src/pages/CourseDetailsPage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import ModuleCard from '../components/cards/ModuleCard';
import texts from '../i18n/texts';

const CourseDetailsPage = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch course details and modules here
    // For now, we'll simulate fetching from sample data
    setLoading(true);
    setError(null);

    const fetchedCourse = texts.sampleCourses.find(c => c.id === courseId);
    if (fetchedCourse) {
      // Simulate API call for modules related to this course
      const courseModules = texts.sampleModules.filter(m => m.courseId === courseId);
      setCourse({ ...fetchedCourse, modules: courseModules });
      setLoading(false);
    } else {
      setError("Course not found!");
      setLoading(false);
    }
  }, [courseId]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading course details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="py-5">
        <Alert variant="warning">No course data available.</Alert>
      </Container>
    );
  }

  return (
    <section className="course-details-page py-5">
      <Container>
        <h2 className="mb-4 fw-bold text-primary text-center">{texts.sections.courseDetails}: {course.name}</h2>
        <div className="row mb-5 align-items-center">
          <div className="col-md-4 text-center">
            <img
              src={course.imageUrl || "https://placehold.co/300x200/cccccc/333333?text=Course"}
              alt={course.name}
              className="img-fluid rounded-4 shadow-sm"
            />
          </div>
          <div className="col-md-8">
            <p className="lead text-secondary">{course.description}</p>
            <p className="mb-0"><strong>Instructor:</strong> {course.instructorName}</p>
            <p><strong>Course ID:</strong> {course.id}</p>
            {/* You can add more course details here */}
          </div>
        </div>

        <h3 className="mb-4 fw-bold text-secondary">{texts.sections.modules}</h3>
        {course.modules && course.modules.length > 0 ? (
          <Row className="g-4">
            {course.modules.map(module => (
              <Col md={12} lg={6} key={module.id}>
                <ModuleCard module={module} />
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info">No modules available for this course yet.</Alert>
        )}
      </Container>
    </section>
  );
};

export default CourseDetailsPage;