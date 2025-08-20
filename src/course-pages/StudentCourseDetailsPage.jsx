// src/pages/StudentCourseDetailsPage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import ModuleCard from '../components/course/cards/ModuleCard';
import texts from '../i18n/texts';
import useCourseApi from '../course-hooks/useCourseApi';
import { getRandomModerateColor } from '../utils/colorUtils';
import useStudentCourseApi from "../learner-hooks/useStudentCourseApi.js";

// Replace with actual auth logic
const studentId = 1;

const StudentCourseDetailsPage = () => {
  const { id: courseIdParam } = useParams();
  const courseId = parseInt(courseIdParam);
  const navigate = useNavigate();

  const { getEnrolledCourseIdsByStudent, enrollInCourse } = useStudentCourseApi();
  const { data: course, loading, error, getCourseByIdPublic } = useCourseApi();

  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);

  // Determine if a student is logged in
  const studentLoggedIn = !!studentId;
  const isEnrolled = enrolledCourseIds.includes(courseId);

  // Generate a random color for the course card
  const cardColor = getRandomModerateColor();

  const generateCourseSvg = (bgColor) => `
    <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="150" fill="${bgColor}"/>
      <path d="M50 30 L150 30 L150 120 L100 100 L50 120 Z" fill="#FFFFFF" stroke="#333333" stroke-width="5" stroke-linejoin="round"/>
      <line x1="100" y1="100" x2="100" y2="120" stroke="#333333" stroke-width="3"/>
      <circle cx="100" cy="70" r="15" fill="#333333"/>
      <text x="100" y="75" font-family="Arial" font-size="20" fill="${bgColor}" text-anchor="middle" font-weight="bold">📚</text>
    </svg>
  `;

  // Fetch course details
  useEffect(() => {
    if (isNaN(courseId)) {
      console.error("Invalid course ID provided in URL.");
      return;
    }
    getCourseByIdPublic?.(courseId);
  }, [courseId, getCourseByIdPublic]);

  // Fetch student enrollment if logged in
  useEffect(() => {
    if (!studentLoggedIn) return;

    const fetchEnrollment = async () => {
      setCheckingEnrollment(true);
      try {
        const ids = await getEnrolledCourseIdsByStudent(studentId);
        setEnrolledCourseIds(ids || []);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      } finally {
        setCheckingEnrollment(false);
      }
    };

    fetchEnrollment();
  }, [getEnrolledCourseIdsByStudent, studentLoggedIn]);

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
          <h2 className="mb-4 fw-bold text-primary text-center">
            {texts.sections?.courseDetails}: {course?.name}
          </h2>

          <div className="row mb-5 align-items-center">
            <div
                className="card-img-top d-flex align-items-center justify-content-center rounded"
                style={{ width: '300px', height: '300px', backgroundColor: cardColor }}
                dangerouslySetInnerHTML={{ __html: generateCourseSvg(cardColor) }}
            ></div>

            <div className="col-md-8">
              <p className="lead text-secondary" dangerouslySetInnerHTML={{ __html: course?.description }}></p>
              <p className="mb-0"><strong>Instructor:</strong> {course?.instructorName}</p>
              <p><strong>Course ID:</strong> {course?.courseId}</p>
              <p><strong>Published Version:</strong> {course?.currentPublishedVersion || 'N/A'}</p>

              {/* Enrollment / Go to Course buttons */}
              {studentLoggedIn && (
                  <div className="my-4">
                    {checkingEnrollment ? (
                        <Spinner animation="border" size="sm" />
                    ) : isEnrolled ? (
                        <Button
                            variant="success"
                            className="me-2"
                            onClick={() => navigate(`/student/course/${courseId}`)}
                        >
                          Go to Course
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            className="me-2"
                            onClick={async () => {
                              try {
                                await enrollInCourse(studentId, courseId);

                                setEnrolledCourseIds(prev => [...prev, courseId]);

                              } catch (err) {
                                console.error(err);
                                alert("Failed to enroll: " + err.message);
                              }
                            }}
                        >
                          Enroll
                        </Button>
                    )}
                  </div>
              )}
            </div>
          </div>


          {studentLoggedIn && (
              isEnrolled ? (
                  <Alert variant="info">Go to course view page to see full course detail </Alert>

              ) : (
                  <Alert variant="info">{texts.alerts?.unenrolledCourse}</Alert>
              )
          )}


        </Container>
      </section>
  );
};

export default StudentCourseDetailsPage;
