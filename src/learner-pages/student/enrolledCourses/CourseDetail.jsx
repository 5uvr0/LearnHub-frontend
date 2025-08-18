import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, ProgressBar } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useStudentCourseApi from "../../../learner-hooks/useStudentCourseApi.js";
import ModuleCard from "../../../components/learner/cards/ModuleCard.jsx";
import texts from "../../../i18n/texts.js";

const studentId = 1;

const StudentCourseDetailPage = () => {
  const { courseId } = useParams();
  const { getStudentCourseProgressDetail } = useStudentCourseApi();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(courseId)

        const data = await getStudentCourseProgressDetail(studentId, courseId);
        setCourse(data);

        console.log(data)

      } catch (err) {
        console.error("Failed to load course detail", err);
        setError("Failed to load course details. Please try again later.");

      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
        <Container className="text-center py-5">
          <Spinner animation="border" role="status" />
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
          <Alert variant="warning">Course not found.</Alert>
        </Container>
    );
  }

  const handleViewContent = (content) => {
    navigate(`/student/courses/${courseId}/content/${content.id}`);
  };

  return (
      <Container className="py-5">
        {/* Course Header */}
        <div className="mb-5 text-center">
          <h2 className="fw-bold text-primary">{course.name}</h2>
          <div className="text-secondary mb-2">
            {/* Avoid <p> around div/Markdown content */}
            {course.description}
          </div>
          <p className="text-muted mb-2">
            Instructor: <strong>{course.instructorName}</strong>
          </p>
          <ProgressBar
              now={typeof course.progress === "number" ? course.progress : 0}
              label={`${course.progress || 0}%`}
              className="my-3"
          />
        </div>

        {/* Modules */}
        <h3 className="mb-4 fw-bold text-secondary">{texts.sections?.modules || "Modules"}</h3>
        {course.modules && course.modules.length > 0 ? (
            <Row className="g-4">
              {course.modules.map((module) => (
                  <Col md={12} key={module.id}>
                    <ModuleCard module={module} onViewContent={handleViewContent} />
                  </Col>
              ))}
            </Row>
        ) : (
            <Alert variant="info">{"No modules found in the course."}</Alert>
        )}
      </Container>
  );
};

export default StudentCourseDetailPage;
