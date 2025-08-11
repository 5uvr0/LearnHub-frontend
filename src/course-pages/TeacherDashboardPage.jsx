// src/pages/TeacherDashboardPage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Alert, Spinner, Row, Col, Card, Nav, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/common/CustomButton';
import texts from '../i18n/texts';
import useCourseApi from '../hooks/useCourseApi';
import { faPlusCircle, faEdit, faEye, faCloudUploadAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import CourseForm from '../components/forms/CourseForm'
const TEACHER_ID = 1; // Hardcoded instructor ID for demonstration

const TeacherDashboardPage = () => {
  const navigate = useNavigate();

  const {
    createCourse
  } = useCourseApi();
  const {
    data: myCourses,
    loading: loadingMyCourses,
    error: myCoursesError,
    getCourseByInstructorId,
    deleteCourse,
    publishCourse,
  } = useCourseApi();

  const {
    getAllDraftCourses,
    data: draftCourses, // Renamed to avoid conflict with 'myCourses'
    loading: loadingDraftCourses,
    error: draftCoursesError,
  } = useCourseApi();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('myCourses'); // State for active tab
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false); // NEW: State for create course modal

  useEffect(() => {
    // Fetch courses by instructor ID
    if (typeof getCourseByInstructorId === 'function') {
      getCourseByInstructorId(TEACHER_ID);
    } else {
      console.error("getCourseByInstructorId is not a function. Check useCourseApi.js.");
    }

    // Fetch all draft courses
    if (typeof getAllDraftCourses === 'function') {
      getAllDraftCourses();
    } else {
      console.error("getAllDraftCourses is not a function. Check useCourseApi.js.");
    }
  }, [refreshTrigger, getCourseByInstructorId, getAllDraftCourses]); // Dependencies for useCallback stability

  console.log("drafts:" + draftCourses?.length);

  // NEW: Handle opening the create course modal
  const handleOpenCreateCourseModal = () => {
    setShowCreateCourseModal(true);
  };

  // NEW: Handle closing the create course modal
  const handleCloseCreateCourseModal = () => {
    setShowCreateCourseModal(false);
  };

  // NEW: Handle submission of the create course form
  const handleCreateCourseSubmit = async (formData) => {
    try {
      await createCourse?.(formData); // Call the createCourse API
      alert(texts.alerts?.courseCreatedSuccess);
      handleCloseCreateCourseModal(); // Close modal on success
      setRefreshTrigger((prev) => prev + 1); // Refresh dashboard data
    } catch (err) {
      alert(texts.alerts?.apiError?.(err?.message || "Failed to create course."));
    }
  };

  const handleEditCourse = (courseId) => {
    navigate(`/teacher/courses/${courseId}/edit`);
  };

  const handleViewCourseDetails = (courseId) => {
    navigate(`/teacher/courses/${courseId}`); // Navigate to teacher course details page
  };

  const handleDeleteCourse = async (courseId, courseName) => {
    if (window.confirm(texts.courseCard?.confirmDelete?.(courseName))) {
      try {
        await deleteCourse?.(courseId);
        alert(texts.alerts?.courseDeletedSuccess);
        setRefreshTrigger((prev) => prev + 1); // Trigger re-fetch
      } catch (err) {
        alert(texts.alerts?.apiError?.(error?.message || err?.message));
      }
    }
  };

  const handlePublishCourse = async (courseId, courseName) => {
    if (window.confirm(texts.courseCard?.confirmPublish?.(courseName))) {
      try {
        await publishCourse?.(courseId);
        alert(texts.alerts?.coursePublishedSuccess);
        setRefreshTrigger((prev) => prev + 1); // Trigger re-fetch
      } catch (err) {
        alert(texts.alerts?.apiError?.(error?.message || err?.message));
      }
    }
  };

  const renderCourseCards = (coursesToRender, loadingState, errorState) => {
    if (loadingState) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading courses...</span>
          </Spinner>
          <p className="text-muted">Loading courses...</p>
        </div>
      );
    }

    if (errorState) {
      return <Alert variant="danger">{texts.alerts?.apiError?.(errorState?.message)}</Alert>;
    }

    if (!coursesToRender || coursesToRender?.length === 0) {
      return <Alert variant="info" className="text-center">{texts.alerts?.noCoursesFound}</Alert>;
    }

    return (
      <Row xs={1} md={2} lg={3} className="g-4">
        {coursesToRender?.map((course) => (
          <Col key={course?.id}>
            <Card className="h-100 shadow-sm border-0 rounded-4">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold text-primary">{course?.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Instructor: {course?.instructorName || 'N/A'}
                </Card.Subtitle>
                <Card.Text className="text-secondary flex-grow-1">
                  {course?.description}
                </Card.Text>
                <div className="d-flex flex-wrap justify-content-between align-items-center mt-3">
                  <CustomButton
                    variant="info"
                    size="sm"
                    icon={faEye}
                    className="mb-2 me-2"
                    onClick={() => handleViewCourseDetails(course?.id)}
                  >
                    {texts.courseCard?.viewDetails}
                  </CustomButton>
                  <CustomButton
                    variant="warning"
                    size="sm"
                    icon={faEdit}
                    className="mb-2 me-2"
                    onClick={() => handleEditCourse(course?.id)}
                  >
                    {texts.courseCard?.edit}
                  </CustomButton>
                  {!course?.currentRelease && ( // Only show publish if it's a draft
                    <CustomButton
                      variant="success"
                      size="sm"
                      icon={faCloudUploadAlt}
                      className="mb-2 me-2"
                      onClick={() => handlePublishCourse(course?.id, course?.name)}
                    >
                      {texts.courseCard?.publish} Course
                    </CustomButton>
                  )}
                  <CustomButton
                    variant="danger"
                    size="sm"
                    icon={faTrash}
                    className="mb-2"
                    onClick={() => handleDeleteCourse(course?.id, course?.name)}
                  >
                    {texts.courseCard?.delete}
                  </CustomButton>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <section className="teacher-dashboard-page py-5">
      <Container>
        <h2 className="text-center mb-5 fw-bold text-primary">{texts.sections?.teacherDashboard}</h2>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <Nav variant="pills" defaultActiveKey="myCourses" onSelect={(selectedKey) => setActiveTab(selectedKey)}>
            <Nav.Item>
              <Nav.Link eventKey="myCourses">{texts.sections?.myCourses}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="draftCourses">{texts.sections?.draftCourses}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="incompleteContentDrafts">{texts.sections?.incompleteContentDrafts}</Nav.Link>
            </Nav.Item>
          </Nav>
          <CustomButton variant="primary" icon={faPlusCircle} onClick={handleOpenCreateCourseModal}>
            {texts.sections?.createCourse}
          </CustomButton>
        </div>

        {activeTab === 'myCourses' && (
          <>
            <h3 className="mb-4 text-secondary">{texts.sections?.myCourses}</h3>
            {renderCourseCards(myCourses, loadingMyCourses, myCoursesError)}
          </>
        )}

        {activeTab === 'draftCourses' && (
          <>
            <h3 className="mb-4 text-secondary">{texts.sections?.draftCourses}</h3>
            {JSON.stringify(draftCourses.length)}
            {renderCourseCards(draftCourses, loadingDraftCourses, draftCoursesError)}
          </>
        )}

        {activeTab === 'incompleteContentDrafts' && (
          <>
            <h3 className="mb-4 text-secondary">{texts.sections?.incompleteContentDrafts}</h3>
            <Alert variant="info" className="text-center">
              {texts.sections?.noIncompleteContentDrafts}
            </Alert>
          </>
        )}
      </Container>

      {/* NEW: Create Course Modal */}
      <Modal show={showCreateCourseModal} onHide={handleCloseCreateCourseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{texts.sections?.createCourse}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CourseForm
            onSubmit={handleCreateCourseSubmit}
            isEditMode={false} // Always false for creation
          />
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default TeacherDashboardPage;