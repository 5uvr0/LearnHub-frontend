import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, ProgressBar } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import useStudentCourseApi from "../../../learner-hooks/useStudentCourseApi.js";
import useCourseApi from "../../../course-hooks/useCourseApi.js";
import useCurrentStudent from "../../../learner-hooks/useCurrentStudent";
import ModuleCard from "../../../components/learner/cards/ModuleCard.jsx";
import texts from "../../../i18n/texts.js";

const StudentCourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { student, loading: studentLoading, error: studentError } = useCurrentStudent();
  const { getStudentCourse } = useCourseApi();
  const { getStudentCourseProgressDetail } = useStudentCourseApi();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!student?.id) return;

      setLoading(true);
      setError(null);

      try {
        // 1. Fetch base course
        const baseCourse = await getStudentCourse(courseId);

        // 2. Fetch detailed progress using logged-in student
        const detailedCourse = await getStudentCourseProgressDetail(student.id, baseCourse);

        setCourse(detailedCourse);

      } catch (err) {
        console.error("Failed to load course detail", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [student?.id, courseId, getStudentCourse, getStudentCourseProgressDetail]);

  if (studentLoading || loading) {
    return (
        <Container className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="mt-3">Loading course details...</p>
        </Container>
    );
  }

  if (studentError) {
    return (
        <Container className="py-5">
          <Alert variant="danger">{`Failed to load student info: ${studentError}`}</Alert>
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
          <div className="text-secondary mb-2">{course.description}</div>

          <p className="text-muted mb-2">
            Instructor: <strong>{course.instructorName}</strong>
          </p>

          <ProgressBar
              now={typeof course.progress === "number" ? course.progress : 0}
              label={`${(course.progress || 0).toFixed(2)}%`}
              className="my-3"
          />

        </div>

        {/* Modules */}
        <h3 className="mb-4 fw-bold text-secondary">{texts.sections?.modules || "Modules"}</h3>
        {course.modules && course.modules.length > 0 ? (
            <Row className="g-4">
              {course.modules
                  .slice() // make a shallow copy so we don't mutate state
                  .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                  .map((module) => (
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
