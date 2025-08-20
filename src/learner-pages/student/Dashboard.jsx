import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../components/learner/cards/CourseCard";
import useCourseApi from "../../course-hooks/useCourseApi";
import useStudentCourseApi from "../../learner-hooks/useStudentCourseApi";
import useCurrentStudent from "../../learner-hooks/useCurrentStudent";
import texts from "../../i18n/texts";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { student, loading: studentLoading, error: studentError } = useCurrentStudent();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  const { getCourseByIdPublic } = useCourseApi();
  const { getEnrolledCourseIdsByStudent } = useStudentCourseApi();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!student?.id) return;

      setLoadingCourses(true);
      setCoursesError(null);

      try {
        const enrolledCourseIds = await getEnrolledCourseIdsByStudent(student.id);

        const courseDetailsPromises = enrolledCourseIds.map((courseId) =>
            getCourseByIdPublic(courseId)
        );

        const courseDetails = await Promise.all(courseDetailsPromises);
        setCourses(courseDetails);

      } catch (err) {
        console.error("Failed to load enrolled courses", err);
        setCoursesError("Failed to load courses. Please try again later.");

      } finally {
        setLoadingCourses(false);
      }
    };

    fetchEnrolledCourses();
  }, [student?.id, getCourseByIdPublic, getEnrolledCourseIdsByStudent]);

  const handleCourseDetailsClick = (courseId) => {
    navigate(`/student/course/${courseId}`);
  };

  // Handle student loading/error
  if (studentLoading) return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2 text-muted">Loading student info...</p>
      </div>
  );

  if (studentError) return (
      <Alert variant="danger" className="text-center">
        Failed to load student info: {studentError}
      </Alert>
  );

  if (!student) return (
      <Alert variant="warning" className="text-center">
        No student information found.
      </Alert>
  );

  return (
      <Container className="py-5">
        <Card className="mb-4">
          <Card.Body className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h3 className="mb-1">{student.firstName} {student.lastName}</h3>
              {student.gender && <p className="mb-0 text-muted">{student.gender}</p>}
              {student.email && <p className="mb-0 text-muted">{student.email}</p>}
              {student.phone && <p className="mb-0 text-muted">{student.phone}</p>}
            </div>

            <div className="mt-2 mt-md-0">
              <strong>Total Enrolled Courses:</strong> {courses.length}
            </div>
          </Card.Body>
        </Card>

        <h2 className="text-2xl font-semibold mb-4 text-center">My Courses</h2>

        {loadingCourses && (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" />
              <p className="text-muted mt-2">Loading your courses...</p>
            </div>
        )}

        {coursesError && <Alert variant="danger" className="text-center">{coursesError}</Alert>}

        {!loadingCourses && !coursesError && courses.length === 0 && (
            <Alert variant="info" className="text-center">
              You are not enrolled in any courses yet.
            </Alert>
        )}

        {!loadingCourses && !coursesError && courses.length > 0 && (
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
