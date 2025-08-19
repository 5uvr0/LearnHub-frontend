// src/pages/StudentCourseDetailsPage.jsx

import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ModuleCard from '../components/course/cards/ModuleCard';
import texts from '../i18n/texts';
import useCourseApi from '../course-hooks/useCourseApi';
import { getRandomModerateColor } from '../utils/colorUtils'; // Import the color utility
import { width } from '@fortawesome/free-solid-svg-icons/fa0';


const StudentCourseDetailsPage = () => {
  const { id: courseIdParam } = useParams();
  const courseId = parseInt(courseIdParam);

  const { data: course, loading, error, getCourseByIdPublic } = useCourseApi();

  // Generate a random color for this card
  const cardColor = getRandomModerateColor();

  // Function to generate a simple SVG icon based on the color
  const generateCourseSvg = (bgColor) => {
    // A simple book icon as an example
    return `
        <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="150" fill="${bgColor}"/>
          <path d="M50 30 L150 30 L150 120 L100 100 L50 120 Z" fill="#FFFFFF" stroke="#333333" stroke-width="5" stroke-linejoin="round"/>
          <line x1="100" y1="100" x2="100" y2="120" stroke="#333333" stroke-width="3"/>
          <circle cx="100" cy="70" r="15" fill="#333333"/>
          <text x="100" y="75" font-family="Arial" font-size="20" fill="${bgColor}" text-anchor="middle" font-weight="bold">📚</text>
        </svg>
      `;
  };


  useEffect(() => {
    if (isNaN(courseId)) {
      console.error("Invalid course ID provided in URL.");
      return;
    }
    getCourseByIdPublic?.(courseId);
  }, [courseId, getCourseByIdPublic]);

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
        <Alert variant="danger">{texts.alerts?.apiError?.(error?.message)}</Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="py-5">
        <Alert variant="warning">{texts.alerts?.courseNotFound}</Alert>
      </Container>
    );
  }

  return (
    <section className="course-details-page py-5">
      <Container>
        <h2 className="mb-4 fw-bold text-primary text-center">{texts.sections?.courseDetails}: {course?.name}</h2>
        <div className="row mb-5 align-items-center">
          <div
            className="card-img-top d-flex align-items-center justify-content-center rounded"
            style={{ width: '300px', height: '300px', backgroundColor: cardColor }}
            dangerouslySetInnerHTML={{ __html: generateCourseSvg(cardColor) }}
          ></div>
          <div className="col-md-8">
            {/* Render HTML description using dangerouslySetInnerHTML */}
            <p className="lead text-secondary" dangerouslySetInnerHTML={{ __html: course?.description }}></p>
            <p className="mb-0"><strong>Instructor:</strong> {course?.instructorName}</p>
            <p><strong>Course ID:</strong> {course?.courseId}</p>
            <p><strong>Published Version:</strong> {course?.currentPublishedVersion || 'N/A'}</p>
          </div>
        </div>

        <h3 className="mb-4 fw-bold text-secondary">{texts.sections?.modules}</h3>
        {course?.modules && course.modules?.length > 0 ? (
          <Row className="g-4">
            {course.modules
              ?.sort((a, b) => (a?.orderIndex || 0) - (b?.orderIndex || 0))
              ?.map(module => (
                <Col md={12} key={module?.id}>
                  <ModuleCard module={module} isTeacherView={false} />
                </Col>
              ))}
          </Row>
        ) : (
          <Alert variant="info">{texts.alerts?.unenrolledCourse}</Alert>
        )}
      </Container>
    </section>
  );
};

export default StudentCourseDetailsPage;