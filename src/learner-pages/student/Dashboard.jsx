import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../components/learner/cards/CourseCard";
import useCourseApi from "../../course-hooks/useCourseApi";
import useStudentCourseApi from "../../learner-hooks/useStudentCourseApi";
import texts from "../../i18n/texts";

const studentId = 1;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getCourseByIdPublic } = useCourseApi();
  const { getEnrolledCourseIdsByStudent } = useStudentCourseApi();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const enrolledCourseIds = await getEnrolledCourseIdsByStudent(studentId);

        const courseDetailsPromises = enrolledCourseIds.map((courseId) =>
          getCourseByIdPublic(courseId)
        );

        const courseDetails = await Promise.all(courseDetailsPromises);
        setCourses(courseDetails);

      } catch (err) {
        console.error("Failed to load enrolled courses", err);
        setError("Failed to load courses. Please try again later.");

      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchEnrolledCourses();
    }
  }, [studentId, getCourseByIdPublic, getEnrolledCourseIdsByStudent]);

  const handleCourseDetailsClick = (courseId) => {
    navigate(`/student/course/${courseId}`);
  };

  return (
    <Container className="py-5">
      <h1 className="text-2xl font-semibold mb-4 text-center">My Courses</h1>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
          <p className="text-muted mt-2">Loading your courses...</p>
        </div>
      )}

      {error && <Alert variant="danger" className="text-center">{error}</Alert>}

      {!loading && !error && courses.length === 0 && (
        <Alert variant="info" className="text-center">
          You are not enrolled in any courses yet.
        </Alert>
      )}

      {!loading && !error && courses.length > 0 && (
        <Row className="g-4">
          {courses.map((course) => (
            <Col md={6} lg={4} key={course.id}>
              <CourseCard
                course={course}
                onDetailsClick={() => handleCourseDetailsClick(course.id)}
                learnMoreText={texts.courseCard?.learnMore || "Learn More"}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default StudentDashboard;
