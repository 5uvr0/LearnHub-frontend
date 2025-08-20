// src/student-pages/StudentCourseDetailPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
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
  const { getStudentCourseProgressDetail, getEnrolledCourseIdsByStudent, enrollInCourse } = useStudentCourseApi();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  useEffect(() => {
    const checkEnrollmentAndFetch = async () => {
      if (!student?.id) return;

      setCheckingEnrollment(true);
      setError(null);

      try {
        // 1. Check enrollment
        const enrolledIds = await getEnrolledCourseIdsByStudent(student.id);
        const enrolled = enrolledIds.includes(parseInt(courseId));
        setIsEnrolled(enrolled);

        if (!enrolled) {
          setError("You are not enrolled in this course.");
          return; // skip fetching course details
        }

        // 2. Fetch base course
        const baseCourse = await getStudentCourse(courseId);

        // 3. Fetch detailed progress
        const detailedCourse = await getStudentCourseProgressDetail(student.id, baseCourse);

        setCourse(detailedCourse);

      } catch (err) {
        console.error("Failed to load course detail", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
        setCheckingEnrollment(false);
      }
    };

    checkEnrollmentAndFetch();
  }, [student?.id, courseId, getStudentCourse, getStudentCourseProgressDetail, getEnrolledCourseIdsByStudent]);

  const handleEnroll = async () => {
    if (!student?.id) return;

    try {
      await enrollInCourse(student.id, parseInt(courseId));
      alert("You are enrolled into the course!");
      // reload page
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to enroll: " + err.message);
    }
  };

  if (studentLoading || loading || checkingEnrollment) {
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

  if (error && !isEnrolled) {
    return (
        <Container className="py-5 text-center">
          <Alert variant="warning">{error}</Alert>
          <Button variant="primary" onClick={handleEnroll}>Enroll in this course</Button>
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
                  .slice()
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
