// src/pages/TeacherCourseDetailsPage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Modal, Form, Accordion } from 'react-bootstrap'; // Import Accordion
import { useParams, useNavigate } from 'react-router-dom';
import ModuleCard from '../components/cards/ModuleCard';
import ModuleForm from '../components/forms/ModuleForm';
import ContentForm from '../components/forms/ContentForm';
import CustomButton from '../components/common/CustomButton';
import texts from '../i18n/texts';
import useCourseApi from '../hooks/useCourseApi';
import useModuleApi from '../hooks/useModuleApi';
import useContentApi from '../hooks/useContentApi';
import { faPlusCircle, faCloudUploadAlt, faEdit } from '@fortawesome/free-solid-svg-icons';


const TeacherCourseDetailsPage = () => {
    const { id: courseIdParam } = useParams();
    const courseId = parseInt(courseIdParam);
    const navigate = useNavigate();

    // API Hooks
    const { data: course, loading: loadingCourse, error: courseError, getCourseDetails, publishCourse } = useCourseApi();
    const { createModule, updateModule, deleteModule, loading: loadingModuleApi, error: moduleApiError } = useModuleApi();
    const { createContent, editContentMetadata, publishContentRelease, deleteContentRelease, loading: loadingContentApi, error: contentApiError, getContentReleaseById } = useContentApi();

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Modals for add/edit operations
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [editingModule, setEditingModule] = useState(null);

    const [showContentModal, setShowContentModal] = useState(false);
    const [editingContentData, setEditingContentData] = useState(null);
    const [activeModuleIdForContent, setActiveModuleIdForContent] = useState(null);
    const [isCreatingNewContent, setIsCreatingNewContent] = useState(false);
    const [isCreatingNewContentRelease, setIsCreatingNewContentRelease] = useState(false);


    useEffect(() => {
        if (isNaN(courseId)) {
            console.error("Invalid course ID provided in URL.");
            return;
        }
        fetchCourseDetails();
    }, [courseId, refreshTrigger, getCourseDetails]); // Add getCourseDetails to dependencies

    const fetchCourseDetails = async () => {
        try {
            await getCourseDetails?.(courseId);
        } catch (err) {
            console.error("Error fetching course details:", err);
        }
    };

    // --- Module Management Handlers ---
    const handleAddModule = () => {
        setEditingModule(null);
        setShowModuleModal(true);
    };

    const handleEditModule = (module) => {
        setEditingModule(module);
        setShowModuleModal(true);
    };

    const handleModuleFormSubmit = async (formData) => {
        try {
            if (editingModule) {
                await updateModule?.(editingModule?.id, { ...formData, courseId: courseId });
                alert(texts.alerts?.moduleUpdatedSuccess);
            } else {
                await createModule?.({ ...formData, courseId: courseId });
                alert(texts.alerts?.moduleCreatedSuccess);
            }
            setShowModuleModal(false);
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            alert(texts.alerts?.apiError?.(moduleApiError?.message || err?.message));
        }
    };

    const handleDeleteModule = async (moduleId, moduleTitle) => {
        if (window.confirm(texts.courseCard?.confirmDelete?.(moduleTitle))) {
            try {
                await deleteModule?.(moduleId);
                alert(texts.alerts?.moduleDeletedSuccess);
                setRefreshTrigger((prev) => prev + 1);
            } catch (err) {
                alert(texts.alerts?.apiError?.(moduleApiError?.message || err?.message));
            }
        }
    };

    // --- Content Management Handlers ---
    const handleAddContent = (moduleId) => {
        setEditingContentData(null);
        setActiveModuleIdForContent(moduleId);
        setIsCreatingNewContent(true);
        setIsCreatingNewContentRelease(false);
        setShowContentModal(true);
    };

    const handleEditContent = async (contentOrRelease, isSpecificRelease = false, parentContentId = null) => {
        setEditingContentData(contentOrRelease);
        setIsCreatingNewContent(false);

        if (parentContentId) {
            setIsCreatingNewContentRelease(true);
            setEditingContentData(null);
            setActiveModuleIdForContent(parentContentId);
        } else if (isSpecificRelease) {
            setIsCreatingNewContentRelease(false);
            try {
                const fullReleaseDetails = await getContentReleaseById?.(contentOrRelease?.id);
                setEditingContentData(fullReleaseDetails);
            } catch (err) {
                alert(texts.alerts?.apiError?.(contentApiError?.message || err?.message));
                setEditingContentData(contentOrRelease);
            }
        } else {
            setIsCreatingNewContentRelease(false);
        }
        setShowContentModal(true);
    };


    const handleContentFormSubmit = async (formData) => {
        try {
            if (isCreatingNewContent) {
                const payload = { ...formData, moduleId: activeModuleIdForContent };
                await createContent?.(payload);
                alert(texts.alerts?.contentCreatedSuccess);
            } else if (isCreatingNewContentRelease && activeModuleIdForContent) {
                const payload = { ...formData, moduleId: activeModuleIdForContent };
                await publishContentRelease?.(activeModuleIdForContent, payload); // Reusing publish endpoint for new release
                alert(texts.alerts?.contentPublishedSuccess);
            } else if (editingContentData) {
                await editContentMetadata?.(editingContentData?.id, formData);
                alert(texts.alerts?.contentUpdatedSuccess);
            }
            setShowContentModal(false);
            setEditingContentData(null);
            setActiveModuleIdForContent(null);
            setIsCreatingNewContent(false);
            setIsCreatingNewContentRelease(false);
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            alert(texts.alerts?.apiError?.(contentApiError?.message || err?.message));
        }
    };


    const handleDeleteContent = async (contentId, contentTitle, isRelease = false) => {
        const confirmMessage = isRelease
            ? `Are you sure you want to delete content release "${contentTitle}"?`
            : `Are you sure you want to delete content "${contentTitle}" and all its releases?`;

        if (window.confirm(confirmMessage)) {
            try {
                await deleteContentRelease?.(contentId);
                alert(texts.alerts?.contentDeletedSuccess);
                setRefreshTrigger((prev) => prev + 1);
            } catch (err) {
                alert(texts.alerts?.apiError?.(contentApiError?.message || err?.message));
            }
        }
    };

    const handlePublishContent = async (contentReleaseId, contentTitle, parentContentId) => {
        if (window.confirm(texts.courseCard?.confirmPublish?.(`"${contentTitle}"`))) {
            try {
                const fullContentDetails = await getContentReleaseById?.(contentReleaseId);
                if (!fullContentDetails) throw new Error("Could not retrieve content details for publishing.");

                const payload = {
                    id: contentReleaseId,
                    title: fullContentDetails?.title,
                    orderIndex: fullContentDetails?.orderIndex,
                    moduleId: fullContentDetails?.moduleId,
                    type: fullContentDetails?.type,
                    ...(fullContentDetails?.description && { description: fullContentDetails.description }),
                    ...(fullContentDetails?.videoUrl && { videoUrl: fullContentDetails.videoUrl }),
                    ...(fullContentDetails?.resourceLink && { resourceLink: fullContentDetails.resourceLink }),
                    ...(fullContentDetails?.questions && { questions: fullContentDetails.questions }),
                };

                await publishContentRelease?.(contentReleaseId, payload);
                alert(texts.alerts?.contentPublishedSuccess);
                setRefreshTrigger((prev) => prev + 1);
            } catch (err) {
                alert(texts.alerts?.apiError?.(contentApiError?.message || err?.message));
            }
        }
    };

    const handlePublishCourse = async () => {
        if (window.confirm(texts.courseCard?.confirmPublish?.(`"${course?.name}"`))) {
            try {
                await publishCourse?.(course?.id);
                alert(texts.alerts?.coursePublishedSuccess);
                setRefreshTrigger((prev) => prev + 1);
            }
            catch (err) {
                alert(texts.alerts?.apiError?.(courseError?.message || err?.message));
            }
        }
    };

    // NEW: Navigation handlers for content versions and quiz configurator
    const handleViewContentVersions = (contentId, contentTitle) => {
        navigate(`/teacher/contents/${contentId}/versions`);
    };

    const handleManageQuiz = (contentId, contentTitle) => {
        navigate(`/teacher/quizzes/${contentId}`);
    };


    if (loadingCourse) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading course details for teacher view...</span>
                </Spinner>
                <p className="mt-3">Loading course details for teacher view...</p>
            </Container>
        );
    }

    if (courseError) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{texts.alerts?.apiError?.(courseError?.message)}</Alert>
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

    let contentModalTitle = '';
    let contentModalInitialData = {};
    let contentModalModuleId = activeModuleIdForContent;

    if (isCreatingNewContent) {
        contentModalTitle = texts.forms?.addContent;
    } else if (isCreatingNewContentRelease) {
        contentModalTitle = `Add New Release to "${editingContentData?.title || 'Content'}"`;
        contentModalInitialData = {};
        contentModalModuleId = activeModuleIdForContent;
    } else if (editingContentData) {
        contentModalTitle = texts.forms?.updateContent;
        contentModalInitialData = editingContentData;
        contentModalModuleId = editingContentData?.moduleId;
    }


    return (
        <section className="course-details-page py-5">
            <Container>
                <h2 className="mb-4 fw-bold text-primary text-center">{texts.sections?.courseConfigurator}: {course?.name}</h2>
                <div className="d-flex justify-content-end mb-4">
                    {!course?.currentRelease ? (
                        <CustomButton
                            variant="success"
                            icon={faCloudUploadAlt}
                            onClick={handlePublishCourse}
                            isLoading={loadingModuleApi || loadingContentApi}
                        >
                            {texts.courseCard?.publish} Course
                        </CustomButton>
                    ) : (
                        <Alert variant="info" className="mb-0 p-2">Course is currently published (Version: {course?.currentRelease}).</Alert>
                    )}
                    <CustomButton
                        variant="warning"
                        icon={faEdit}
                        className="ms-3"
                        onClick={() => navigate(`/teacher/courses/${course?.id}/edit`)}
                    >
                        Edit Course Metadata
                    </CustomButton>
                </div>

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
                        <p><strong>Course ID:</strong> {course?.id}</p>
                        <p><strong>Current Published Version:</strong> {course?.currentRelease || 'N/A'}</p>
                    </div>
                </div>

                <h3 className="mb-4 fw-bold text-secondary d-flex justify-content-between align-items-center">
                    {texts.sections?.modules}
                    <CustomButton variant="primary" icon={faPlusCircle} onClick={handleAddModule} isLoading={loadingModuleApi}>
                        Add Module
                    </CustomButton>
                </h3>
                {course?.modules && course.modules?.length > 0 ? (
                    <Accordion defaultActiveKey="0" className="g-4"> {/* Use Accordion */}
                        {course.modules
                            ?.sort((a, b) => (a?.orderIndex || 0) - (b?.orderIndex || 0))
                            ?.map((module, index) => (
                                <ModuleCard
                                    key={module?.id}
                                    module={module}
                                    isTeacherView={true}
                                    onAddContent={handleAddContent}
                                    onEditContent={handleEditContent}
                                    onDeleteContent={handleDeleteContent}
                                    onPublishContent={handlePublishContent} // Pass the handler
                                    onViewContentVersions={handleViewContentVersions} // Pass new handler
                                    onManageQuiz={handleManageQuiz} // Pass new handler
                                    onEditModule={handleEditModule}
                                    onDeleteModule={handleDeleteModule}
                                    eventKey={String(index)} // Unique eventKey for each accordion item
                                />
                            ))}
                    </Accordion>
                ) : (
                    <Alert variant="info">{texts.alerts?.noModulesFound}</Alert>
                )}
            </Container>

            {/* Module Add/Edit Modal */}
            <Modal show={showModuleModal} onHide={() => setShowModuleModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editingModule ? texts.forms?.updateModule : texts.forms?.addModule}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModuleForm
                        initialData={editingModule || {}}
                        onSubmit={handleModuleFormSubmit}
                        isEditMode={!!editingModule}
                        isLoading={loadingModuleApi}
                    />
                </Modal.Body>
            </Modal>

            {/* Content Add/Edit Modal */}
            <Modal show={showContentModal} onHide={() => setShowContentModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isCreatingNewContent ? texts.forms?.addContent :
                            isCreatingNewContentRelease ? `Add New Release to "${editingContentData?.title || 'Content'}"` :
                                texts.forms?.updateContent}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ContentForm
                        initialData={editingContentData || {}}
                        onSubmit={handleContentFormSubmit}
                        isEditMode={!isCreatingNewContent && !isCreatingNewContentRelease}
                        isLoading={loadingContentApi}
                        moduleId={isCreatingNewContent ? activeModuleIdForContent : editingContentData?.moduleId || activeModuleIdForContent}
                    />
                </Modal.Body>
            </Modal>

        </section>
    );
};

export default TeacherCourseDetailsPage;