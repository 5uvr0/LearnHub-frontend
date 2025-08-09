// src/pages/StudentCourseDetailsPage.jsx

import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ModuleCard from '../components/cards/ModuleCard';
import texts from '../i18n/texts';
import useCourseApi from '../hooks/useCourseApi'; // For fetching public course details

const StudentCourseDetailsPage = () => {
  const { id: courseIdParam } = useParams();
  const courseId = parseInt(courseIdParam);

  const { data: course, loading, error, getCourseDetails } = useCourseApi();

  useEffect(() => {
    if (isNaN(courseId)) {
      console.error("Invalid course ID provided in URL.");
      // Optionally navigate to a 404 page or display an error message more prominently
      return;
    }
    getCourseDetails(courseId); // Fetch public course details (CourseCatalogDTO)
  }, [courseId, getCourseDetails]); // Added getCourseByIdPublic to dependency array for best practice

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
    <section className="course-details-page py-5">
      <Container>
        <h2 className="mb-4 fw-bold text-primary text-center">{texts.sections.courseDetails}: {course?.name}</h2>
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
          </div>
        </div>

        <h3 className="mb-4 fw-bold text-secondary">{texts.sections.modules}</h3>
        {course?.modules && course.modules?.length > 0 ? (
          <Row className="g-4">
            {/* ModuleCatalogDTO contains contents which are ContentCatalogueDTOs (latest) */}
            {course.modules
              ?.sort((a, b) => (a?.orderIndex || 0) - (b?.orderIndex || 0)) // Sort by orderIndex
              ?.map(module => (
              <Col md={12} key={module?.id}>
                <ModuleCard module={module} isTeacherView={false} /> {/* Student view */}
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info">{texts.alerts.noModulesFound}</Alert>
        )}
      </Container>
    </section>
  );
};

export default StudentCourseDetailsPage;