// src/pages/CourseVersionComparisonPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, Card, ListGroup, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import CustomButton from '../components/common/CustomButton';
import MarkdownRenderer from '../components/common/MarkdownRender';
import texts from '../i18n/texts';
import useCourseApi from '../course-hooks/useCourseApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faExchangeAlt, faBookOpen, faFileCode, faQuestionCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash'; // For deep comparison and array manipulation

// Helper to get content type icon and variant
const getContentTypeInfo = (content) => {
    let icon = faFileCode; // Default generic icon
    let variant = "secondary";
    switch (content?.type) {
        case "LECTURE":
            icon = faBookOpen;
            variant = "info";
            break;
        case "QUIZ":
            icon = faQuestionCircle;
            variant = "warning";
            break;
        case "SUBMISSION":
            icon = faClipboardList;
            variant = "success";
            break;
    }
    return { icon, variant };
};

// --- Diffing Logic (Corrected) ---
const getCourseDiff = (courseA, courseB) => {
    const diff = {
        modules: {
            added: [],
            removed: [],
            modified: [],
            unchanged: [],
        },
        metadata: [],
    };

    if (!courseA || !courseB) return diff;

    // Compare Course Metadata
    if (courseA.description !== courseB.description) {
        diff.metadata.push({
            field: 'description',
            oldValue: courseA.description,
            newValue: courseB.description,
        });
    }
    if (courseA.name !== courseB.name) {
        diff.metadata.push({
            field: 'name',
            oldValue: courseA.name,
            newValue: courseB.name,
        });
    }

    const modulesA = courseA.modules || [];
    const modulesB = courseB.modules || [];

    const mapA = new Map(modulesA.map(m => [m?.id, m]));
    const mapB = new Map(modulesB.map(m => [m?.id, m]));

    const allModuleIds = new Set([...mapA.keys(), ...mapB.keys()]);

    for (const id of allModuleIds) {
        const moduleA = mapA.get(id);
        const moduleB = mapB.get(id);

        if (moduleA && !moduleB) {
            diff.modules.removed.push(moduleA);
        } else if (!moduleA && moduleB) {
            diff.modules.added.push(moduleB);
        } else if (moduleA && moduleB) {
            if (!_.isEqual(moduleA.orderIndex, moduleB.orderIndex) ||
                !_.isEqual(moduleA.title, moduleB.title) ||
                !_.isEqual(moduleA.contents, moduleB.contents)) {

                const contentDiff = getContentDiff(moduleA, moduleB);
                diff.modules.modified.push({
                    moduleA,
                    moduleB,
                    contentDiff,
                });
            } else {
                diff.modules.unchanged.push(moduleA);
            }
        }
    }

    return diff;
};

// Corrected content diffing within a module
const getContentDiff = (moduleA, moduleB) => {
    const contentsA = moduleA.contents || [];
    const contentsB = moduleB.contents || [];

    const diff = {
        added: [],
        removed: [],
        modified: [],
        unchanged: [],
    };

    const mapA = new Map(contentsA.map(c => [c?.id, c]));
    const mapB = new Map(contentsB.map(c => [c?.id, c]));

    const allContentIds = new Set([...mapA.keys(), ...mapB.keys()]);

    for (const id of allContentIds) {
        const contentA = mapA.get(id);
        const contentB = mapB.get(id);

        if (contentA && !contentB) {
            diff.removed.push(contentA);
        } else if (!contentA && contentB) {
            diff.added.push(contentB);
        } else if (contentA && contentB) {
            if (!_.isEqual(contentA, contentB)) {
                diff.modified.push({ contentA, contentB });
            } else {
                diff.unchanged.push(contentA);
            }
        }
    }

    return diff;
};


const CourseVersionComparisonPage = () => {
    const { id: courseIdParam } = useParams();
    const courseId = parseInt(courseIdParam);

    const { data: allCourseVersions, loading: loadingAllVersions, error: allVersionsError, getAllCourseVersions } = useCourseApi();
    const { data: courseVersionA, loading: loadingVersionA, error: versionAError, getCourseVersionById } = useCourseApi();
    const { data: courseVersionB, loading: loadingVersionB, error: versionBError } = useCourseApi();

    const [versionAInput, setVersionAInput] = useState('');
    const [versionBInput, setVersionBInput] = useState('');

    const [comparisonResult, setComparisonResult] = useState(null);
    const [comparisonLoading, setComparisonLoading] = useState(false);
    const [comparisonError, setComparisonError] = useState(null);

    useEffect(() => {
        getAllCourseVersions?.(courseId);
    }, [courseId, getAllCourseVersions]);


    const handleCompare = useCallback(async () => {
        const verA = parseInt(versionAInput);
        const verB = parseInt(versionBInput);

        if (isNaN(verA) || isNaN(verB) || verA <= 0 || verB <= 0) {
            alert(texts.alerts?.invalidVersionNumber);
            return;
        }
        if (verA === verB) {
            alert(texts.alerts?.selectTwoVersions);
            return;
        }

        setComparisonLoading(true);
        setComparisonError(null);
        setComparisonResult(null);

        try {
            const [versionAData, versionBData] = await Promise.all([
                getCourseVersionById?.(courseId, verA),
                getCourseVersionById?.(courseId, verB)
            ]);

            if (versionAData && versionBData) {
                const diff = getCourseDiff(versionAData, versionBData);
                setComparisonResult(diff);
            } else {
                setComparisonError('Could not retrieve one or both versions.');
            }
        } catch (err) {
            setComparisonError(texts.alerts?.apiError?.(err?.message || 'An error occurred during comparison.'));
        } finally {
            setComparisonLoading(false);
        }
    }, [courseId, versionAInput, versionBInput, getCourseVersionById, texts.alerts]);


    const renderModuleContent = (module, isAdded = false, isRemoved = false, isModified = false, contentDiff = null) => {
        const moduleStatus = isAdded ? 'Added' : (isRemoved ? 'Removed' : (isModified ? 'Modified' : 'Unchanged'));

        return (
            <Card className={`mb-3 shadow-sm rounded-4 ${moduleStatus === 'Added' ? 'bg-success-subtle border-success' : ''} ${moduleStatus === 'Removed' ? 'bg-danger-subtle border-danger' : ''} ${moduleStatus === 'Modified' ? 'bg-warning-subtle border-warning' : ''}`}>
                <Card.Header className="fw-bold d-flex justify-content-between align-items-center">
                    <span>
                        {moduleStatus === 'Added' && <FontAwesomeIcon icon={faPlus} className="me-2 text-success" />}
                        {moduleStatus === 'Removed' && <FontAwesomeIcon icon={faMinus} className="me-2 text-danger" />}
                        {moduleStatus === 'Modified' && <FontAwesomeIcon icon={faExchangeAlt} className="me-2 text-warning" />}
                        Module {module?.orderIndex}: {module?.title}
                    </span>
                    {moduleStatus !== 'Unchanged' && <Badge bg={moduleStatus === 'Added' ? 'success' : (moduleStatus === 'Removed' ? 'danger' : 'warning')}>{moduleStatus}</Badge>}
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {module?.contents?.length > 0 ? (
                            module.contents?.map(content => {
                                const { icon, variant } = getContentTypeInfo(content);
                                let contentStatus = 'Unchanged';
                                if (contentDiff) {
                                    if (contentDiff.added.some(c => c?.id === content?.id)) contentStatus = 'Added';
                                    else if (contentDiff.removed.some(c => c?.id === content?.id)) contentStatus = 'Removed';
                                    else if (contentDiff.modified.some(c => c?.id === content?.id)) contentStatus = 'Modified';
                                }

                                return (
                                    <ListGroup.Item key={content?.id} className={`d-flex align-items-center ${contentStatus === 'Added' ? 'bg-success-subtle' : ''} ${contentStatus === 'Removed' ? 'bg-danger-subtle' : ''} ${contentStatus === 'Modified' ? 'bg-warning-subtle' : ''}`}>
                                        <FontAwesomeIcon icon={icon} className="me-2" />
                                        {content?.title}
                                        <Badge bg={variant} className="ms-2">{content?.type}</Badge>
                                        {contentStatus === 'Added' && <Badge bg="success" className="ms-2">Added</Badge>}
                                        {contentStatus === 'Removed' && <Badge bg="danger" className="ms-2">Version Changed</Badge>}
                                        {contentStatus === 'Modified' && <Badge bg="warning" className="ms-2">Modified</Badge>}
                                    </ListGroup.Item>
                                );
                            })
                        ) : (
                            <ListGroup.Item className="text-muted">No contents.</ListGroup.Item>
                        )}
                    </ListGroup>
                </Card.Body>
            </Card>
        );
    };


    // const allVersionsOptions = allCourseVersions?.map(num => <option key={num} value={num}>Version {num}</option>);


    return (
        <section className="course-version-comparison-page py-5">
            <Container>
                <h2 className="mb-4 fw-bold text-primary text-center">
                    Version Comparison: {courseId ? `Course ID: ${courseId}` : 'N/A'}
                </h2>

                <Form className="mb-5 p-4 rounded-4 shadow-sm bg-light">
                    <Row className="g-3 align-items-end">
                        <Col md={5}>
                            <Form.Group controlId="versionAInput">
                                <Form.Label>Version A</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Version Number"
                                    value={versionAInput}
                                    onChange={(e) => setVersionAInput(e.target.value)}
                                    min="1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={5}>
                            <Form.Group controlId="versionBInput">
                                <Form.Label>Version B</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Version Number"
                                    value={versionBInput}
                                    onChange={(e) => setVersionBInput(e.target.value)}
                                    min="1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <CustomButton variant="primary" onClick={handleCompare} isLoading={comparisonLoading || loadingVersionA || loadingVersionB} className="w-100">
                                Compare
                            </CustomButton>
                        </Col>
                    </Row>
                </Form>

                {comparisonLoading && (loadingVersionA || loadingVersionB) && (
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Comparing versions...</span>
                        </Spinner>
                        <p className="mt-3">Comparing versions...</p>
                    </div>
                )}

                {(comparisonError || versionAError || versionBError) && (
                    <Alert variant="danger">{texts.alerts?.apiError?.(comparisonError?.message || versionAError?.message || versionBError?.message || 'An error occurred during comparison.')}</Alert>
                )}

                {comparisonResult && (
                    <Row className="mt-5 g-4">
                        <Col md={6}>
                            <Card className="h-100 shadow-sm border-0 rounded-4 p-3">
                                <Card.Title className="fw-bold text-primary">
                                    Version A: {versionAInput}
                                    <small className="d-block text-muted">({courseVersionA?.name})</small>
                                </Card.Title>
                                <hr />
                                {comparisonResult.metadata.length > 0 && comparisonResult.metadata.some(m => m.field === 'description') && (
                                    <div className="mb-3">
                                        <h5 className="text-secondary">Description</h5>
                                        <MarkdownRenderer markdownText={comparisonResult.metadata.find(m => m.field === 'description')?.oldValue || ''} />
                                    </div>
                                )}
                                <h5 className="text-secondary">Modules</h5>
                                {comparisonResult.modules.removed.length > 0 && (
                                    <div className="mb-3">
                                        <h6><Badge bg="danger">Removed</Badge> Modules</h6>
                                        {comparisonResult.modules.removed.map(module => renderModuleContent(module, false, true, false))}
                                    </div>
                                )}
                                {comparisonResult.modules.modified.length > 0 && (
                                    <div className="mb-3">
                                        <h6><Badge bg="warning">Modified</Badge> Modules</h6>
                                        {comparisonResult.modules.modified.map(diff => renderModuleContent(diff.moduleA, false, false, true, diff.contentDiff))}
                                    </div>
                                )}
                                {comparisonResult.modules.unchanged.length > 0 && (
                                    <div className="mb-3">
                                        <h6><Badge bg="secondary">No Changes</Badge> Modules</h6>
                                        {comparisonResult.modules.unchanged.map(module => renderModuleContent(module))}
                                    </div>
                                )}
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="h-100 shadow-sm border-0 rounded-4 p-3">
                                <Card.Title className="fw-bold text-primary">
                                    Version B: {versionBInput}
                                    <small className="d-block text-muted">({courseVersionA?.name})</small>
                                </Card.Title>
                                <hr />
                                {comparisonResult.metadata.length > 0 && comparisonResult.metadata.some(m => m.field === 'description') && (
                                    <div className="mb-3">
                                        <h5 className="text-secondary">Description</h5>
                                        <MarkdownRenderer markdownText={comparisonResult.metadata.find(m => m.field === 'description')?.newValue || ''} />
                                    </div>
                                )}
                                <h5 className="text-secondary">Modules</h5>
                                {comparisonResult.modules.added.length > 0 && (
                                    <div className="mb-3">
                                        <h6><Badge bg="success">Added</Badge> Modules</h6>
                                        {comparisonResult.modules.added.map(module => renderModuleContent(module, true, false, false))}
                                    </div>
                                )}
                                {comparisonResult.modules.modified.length > 0 && (
                                    <div className="mb-3">
                                        <h6><Badge bg="warning">Modified</Badge> Modules</h6>
                                        {comparisonResult.modules.modified.map(diff => renderModuleContent(diff.moduleB, false, false, true, diff.contentDiff))}
                                    </div>
                                )}
                                {comparisonResult.modules.unchanged.length > 0 && (
                                    <div className="mb-3">
                                        <h6><Badge bg="secondary">No Changes</Badge> Modules</h6>
                                        {comparisonResult.modules.unchanged.map(module => renderModuleContent(module))}
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </section>
    );
};

export default CourseVersionComparisonPage;