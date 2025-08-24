// src/pages/TeacherDashboardPage.jsx

import React, {useEffect, useState} from 'react';
import {Alert, Card, Col, Container, Modal, Nav, Row, Spinner} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import CustomButton from '../components/common/CustomButton';
import texts from '../i18n/texts';
import useCourseApi from '../course-hooks/useCourseApi';
import useContentApi from '../course-hooks/useContentApi';
import {faCloudUploadAlt, faEdit, faEye, faPlusCircle, faTrash} from '@fortawesome/free-solid-svg-icons';
import CourseForm from '../components/course/forms/CourseForm';
import ContentCard from '../components/course/cards/ContentCard';
import ContentEditModal from '../components/course/modals/EditContentModal.jsx';
import CourseMetadataEditModal from "../components/course/modals/CourseMetadataEditModal.jsx";

const TEACHER_ID = 1;

const TeacherDashboardPage = () => {
    const navigate = useNavigate();

    const [showCourseMetadataModal, setShowCourseMetadataModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null); // NEW: State to hold the course being edited

    const {
        loading: loadingCourse,
        error: courseError,
        createCourse,
        updateCourse // Corrected API method
    } = useCourseApi();
    const {
        data: myCourses,
        loading: loadingMyCourses,
        error: myCoursesError,
        getCourseByInstructorId,
        getAllMyCourses,
        deleteCourse,
        publishCourse,
    } = useCourseApi();

    const {
        data: draftCourses,
        loading: loadingDraftCourses,
        error: draftCoursesError,
        getAllDraftCourses,
    } = useCourseApi();

    const {
        data: incompleteContentDrafts,
        loading: loadingIncompleteContentDrafts,
        error: incompleteContentDraftsError,
        getAllContentDrafts,
        editContentMetadata,
        publishContentRelease,
    } = useContentApi();

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeTab, setActiveTab] = useState('myCourses');
    const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);

    const [showEditContentModal, setShowEditContentModal] = useState(false);
    const [editingContent, setEditingContent] = useState(null);

    useEffect(() => {
        // getCourseByInstructorId(TEACHER_ID);
        getAllMyCourses();
        getAllDraftCourses();
        getAllContentDrafts();
    }, [refreshTrigger, getAllMyCourses, getAllDraftCourses, getAllContentDrafts]);

    const handleOpenCreateCourseModal = () => {
        setShowCreateCourseModal(true);
    };

    const handleCloseCreateCourseModal = () => {
        setShowCreateCourseModal(false);
    };

    const handleCreateCourseSubmit = async (formData) => {
        try {
            await createCourse?.(formData);
            alert(texts.alerts?.courseCreatedSuccess);
            handleCloseCreateCourseModal();
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            alert(texts.alerts?.apiError?.(err?.message || "Failed to create course."));
        }
    };

    // MODIFIED: handleEditCourse to open the modal and set the course
    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setShowCourseMetadataModal(true);
    };

    const handleViewCourseDetails = (courseId) => {
        navigate(`/teacher/courses/${courseId}`);
    };

    const handleDeleteCourse = async (courseId, courseName) => {
        if (window.confirm(texts.courseCard?.confirmDelete?.(courseName))) {
            try {
                await deleteCourse?.(courseId);
                alert(texts.alerts?.courseDeletedSuccess);
                setRefreshTrigger((prev) => prev + 1);
            } catch (err) {
                alert(texts.alerts?.apiError?.(err?.message));
            }
        }
    };

    const handlePublishCourse = async (courseId, courseName) => {
        if (window.confirm(texts.courseCard?.confirmPublish?.(courseName))) {
            try {
                await publishCourse?.(courseId);
                alert(texts.alerts?.coursePublishedSuccess);
                setRefreshTrigger((prev) => prev + 1);
            } catch (err) {
                alert(texts.alerts?.apiError?.(err?.message));
            }
        }
    };

    const handleSaveCourseMetadata = async (id, newTitle) => {
        try {
            await updateCourse?.(id, {name: newTitle});
            alert("Course metadata updated successfully!");
            setShowCourseMetadataModal(false);
            setEditingCourse(null);
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.details) {
                const errorDetails = err.response.data.details;
                console.log("Errors:");
                console.log(errorDetails);
                const errorMessage = Object.values(errorDetails).join("\n");
                alert(`Validation Error:\n${errorMessage}`);
            } else {
                alert(texts.alerts?.apiError?.(err?.message || "Failed to update course metadata."));
            }
        }
    };
    const handleEditContent = (content) => {
        setEditingContent(content);
        setShowEditContentModal(true);
    };

    const handleSaveContentDraft = async (payload) => {
        try {
            await editContentMetadata?.(payload?.id, payload);
            alert('Content draft saved successfully!');
            setShowEditContentModal(false);
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            alert(texts.alerts?.apiError?.(err?.message || "Failed to save draft."));
        }
    };

    const handlePublishContent = async (contentId) => {
        try {
            await publishContentRelease?.(contentId, {});
            alert('Content published successfully!');
            setShowEditContentModal(false);
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            alert(texts.alerts?.apiError?.(err?.message || "Failed to publish content."));
        }
    };

    const onManageQuiz = (contentId) => {
        navigate(`/teacher/quizzes/${contentId}`);
    };

    const onViewContentDetails = (contentReleaseId, contentType) => {
        console.log("clicked view details:");

        switch (contentType) {
            case 'LECTURE':
                navigate(`/teacher/lectures/${contentReleaseId}`);
                break;
            case 'SUBMISSION':
                navigate(`/teacher/submissions/${contentReleaseId}`);
                break;
            case 'QUIZ':
                navigate(`/teacher/quizzes/${contentReleaseId}`);
                break;
            default:
                alert('Unknown content type for details view.');
        }
    };

    // MODIFIED: renderCourseCards to pass the full course object to handleEditCourse
    const renderCourseCards = (coursesToRender, loadingState, errorState) => {
        if (loadingState) return <div className="text-center py-5"><Spinner animation="border" role="status" className="mb-3"/><p className="text-muted">Loading courses...</p></div>;
        if (errorState) return <Alert variant="danger">{texts.alerts?.apiError?.(errorState?.message)}</Alert>;
        if (!coursesToRender || coursesToRender?.length === 0) return <Alert variant="info" className="text-center">{texts.alerts?.noCoursesFound}</Alert>;

        return (
            <Row xs={1} md={2} lg={3} className="g-4">
                {coursesToRender?.map((course) => (
                    <Col key={course?.id}>
                        <Card className="h-100 shadow-sm border-0 rounded-4">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="fw-bold text-primary">{course?.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Instructor: {course?.instructorName || 'N/A'}</Card.Subtitle>
                                <Card.Text className="text-secondary flex-grow-1">{course?.description}</Card.Text>
                                <div className="d-flex flex-wrap justify-content-between align-items-center mt-3">
                                    <CustomButton variant="info" size="sm" icon={faEye} className="mb-2 me-2" onClick={() => handleViewCourseDetails(course?.id)}>{texts.courseCard?.viewDetails}</CustomButton>
                                    <CustomButton variant="warning" size="sm" icon={faEdit} className="mb-2 me-2" onClick={() => handleEditCourse(course)}>{texts.courseCard?.edit}</CustomButton>
                                    {!course?.currentRelease && (<CustomButton variant="success" size="sm" icon={faCloudUploadAlt} className="mb-2 me-2" onClick={() => handlePublishCourse(course?.id, course?.name)}>{texts.courseCard?.publish} Course</CustomButton>)}
                                    <CustomButton variant="danger" size="sm" icon={faTrash} className="mb-2" onClick={() => handleDeleteCourse(course?.id, course?.name)}>{texts.courseCard?.delete}</CustomButton>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };

    const renderContentCards = (contentsToRender, loadingState, errorState) => {
        if (loadingState) return <div className="text-center py-5"><Spinner animation="border" role="status" className="mb-3"/><p className="text-muted">Loading drafts...</p></div>;
        if (errorState) return <Alert variant="danger">{texts.alerts?.apiError?.(errorState?.message)}</Alert>;
        const incomplete = contentsToRender?.filter(content => content?.releaseNum === 0);
        if (!incomplete || incomplete?.length === 0) return <Alert variant="info" className="text-center">{texts.alerts?.noIncompleteContentDrafts}</Alert>;

        return (
            <Row xs={1} md={2} lg={3} className="g-4">
                {incomplete.map((content) => (
                    <Col key={content?.id}>
                        <ContentCard
                            content={content}
                            onEditContent={() => handleEditContent(content)}
                            onManageQuiz={onManageQuiz}
                            onViewContentDetails={onViewContentDetails}
                        />
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
                        <Nav.Item><Nav.Link eventKey="myCourses">{texts.sections?.myCourses}</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="draftCourses">{texts.sections?.draftCourses}</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="incompleteContentDrafts">{texts.sections?.incompleteContentDrafts}</Nav.Link></Nav.Item>
                    </Nav>
                    <CustomButton variant="primary" icon={faPlusCircle} onClick={handleOpenCreateCourseModal}>
                        {texts.sections?.createCourse}
                    </CustomButton>
                </div>

                {activeTab === 'myCourses' && (<><h3 className="mb-4 text-secondary">{texts.sections?.myCourses}</h3>{renderCourseCards(myCourses, loadingMyCourses, myCoursesError)}</>)}
                {activeTab === 'draftCourses' && (<><h3 className="mb-4 text-secondary">{texts.sections?.draftCourses}</h3>{renderCourseCards(draftCourses, loadingDraftCourses, draftCoursesError)}</>)}
                {activeTab === 'incompleteContentDrafts' && (<><h3 className="mb-4 text-secondary">{texts.sections?.incompleteContentDrafts}</h3>{renderContentCards(incompleteContentDrafts, loadingIncompleteContentDrafts, incompleteContentDraftsError)}</>)}
            </Container>

            <Modal show={showCreateCourseModal} onHide={handleCloseCreateCourseModal} centered size="lg">
                <Modal.Header closeButton><Modal.Title>{texts.sections?.createCourse}</Modal.Title></Modal.Header>
                <Modal.Body><CourseForm onSubmit={handleCreateCourseSubmit} isEditMode={false}/></Modal.Body>
            </Modal>

            <ContentEditModal
                show={showEditContentModal}
                onHide={() => setShowEditContentModal(false)}
                contentToEdit={editingContent}
                onSaveDraft={handleSaveContentDraft}
                onPublish={handlePublishContent}
                isLoading={loadingIncompleteContentDrafts}
            />

            <CourseMetadataEditModal
                show={showCourseMetadataModal}
                onHide={() => setShowCourseMetadataModal(false)}
                course={editingCourse}
                onSave={(newTitle) => handleSaveCourseMetadata(editingCourse?.id, newTitle)}
                isLoading={loadingCourse}
            />
        </section>
    );
};

export default TeacherDashboardPage;