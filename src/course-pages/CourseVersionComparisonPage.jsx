// src/pages/CourseVersionComparisonPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, Card, ListGroup, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import CustomButton from '../components/common/CustomButton';
import MarkdownRenderer from '../components/common/MarkdownRender';
import texts from '../i18n/texts';
import useCourseApi from '../hooks/useCourseApi';
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

// --- Diffing Logic (Simplified) ---
// This function compares two course objects (or parts of them)
const getCourseDiff = (courseA, courseB) => {
  const diff = {
    modules: {
      added: [],
      removed: [],
      modified: [],
      unchanged: [],
    },
    metadata: [], // For course-level changes like description, instructor
  };

  if (!courseA || !courseB) return diff; // Handle cases where one version is missing

  // Compare Course Metadata (simplified: just description for now)
  if (courseA.description !== courseB.description) {
    diff.metadata.push({
      field: 'description',
      oldValue: courseA.description,
      newValue: courseB.description,
    });
  }
  // Add other metadata comparisons as needed (e.g., name, instructorId)

  const modulesA = courseA.modules || [];
  const modulesB = courseB.modules || [];

  // Create maps for quick lookup
  const mapA = new Map(modulesA.map(m => [m?.id, m]));
  const mapB = new Map(modulesB.map(m => [m?.id, m]));

  // Check for removed and modified modules from A's perspective
  for (const moduleA of modulesA) {
    if (!mapB.has(moduleA?.id)) {
      diff.modules.removed.push(moduleA);
    } else {
      const moduleB = mapB.get(moduleA?.id);
      // Deep compare module properties (title, orderIndex) and contents
      if (!_.isEqual(moduleA?.title, moduleB?.title) ||
        !_.isEqual(moduleA?.orderIndex, moduleB?.orderIndex) ||
        !_.isEqual(moduleA?.contents?.map(c => ({ id: c?.id, title: c?.title, type: c?.type, orderIndex: c?.orderIndex })),
          moduleB?.contents?.map(c => ({ id: c?.id, title: c?.title, type: c?.type, orderIndex: c?.orderIndex }))) // Simplified content comparison
      ) {
        // If module itself changed, or its content list changed (add/remove/reorder)
        const contentDiff = getContentDiff(moduleA, moduleB);
        diff.modules.modified.push({
          moduleA,
          moduleB,
          contentDiff, // Attach content-level diff
        });
      } else {
        diff.modules.unchanged.push(moduleA);
      }
    }
  }

  // Check for added modules from B's perspective
  for (const moduleB of modulesB) {
    if (!mapA.has(moduleB?.id)) {
      diff.modules.added.push(moduleB);
    }
  }

  return diff;
};

// Simplified content diffing within a module
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

  for (const contentA of contentsA) {
    if (!mapB.has(contentA?.id)) {
      diff.removed.push(contentA);
    } else {
      const contentB = mapB.get(contentA?.id);
      // Compare content properties (title, description, videoUrl, etc.)
      if (!_.isEqual(contentA, contentB)) { // Deep comparison of content objects
        diff.modified.push({ contentA, contentB });
      } else {
        diff.unchanged.push(contentA);
      }
    }
  }

  for (const contentB of contentsB) {
    if (!mapA.has(contentB?.id)) {
      diff.added.push(contentB);
    }
  }
  return diff;
};


const CourseVersionComparisonPage = () => {
  const { id: courseIdParam } = useParams();
  const courseId = parseInt(courseIdParam);

  // Removed getAllCourseVersions and its data/loading/error states
  const { data: courseVersionA, loading: loadingVersionA, error: versionAError, getCourseVersionById } = useCourseApi();
  const { data: courseVersionB, loading: loadingVersionB, error: versionBError } = useCourseApi();

  const [versionAInput, setVersionAInput] = useState(''); // NEW: Input state for Version A
  const [versionBInput, setVersionBInput] = useState(''); // NEW: Input state for Version B

  const [comparisonResult, setComparisonResult] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState(null);

  // No useEffect to fetch all versions on mount anymore

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
      // Directly fetch both versions using the input values
      const versionAData = await getCourseVersionById?.(courseId, verA);
      const versionBData = await getCourseVersionById?.(courseId, verB);

      if (versionAData && versionBData) {
        const diff = getCourseDiff(versionAData, versionBData);
        setComparisonResult(diff);
      } else {
        setComparisonError(texts.alerts?.comparisonError);
      }
    } catch (err) {
      setComparisonError(texts.alerts?.apiError?.(err?.message || texts.alerts?.comparisonError));
    } finally {
      setComparisonLoading(false);
    }
  }, [courseId, versionAInput, versionBInput, getCourseVersionById, texts.alerts]);


  const renderModuleContent = (module, isAdded = false, isRemoved = false, isModified = false, contentDiff = null) => (
    <Card className={`mb-3 shadow-sm rounded-4 ${isAdded ? 'bg-success-subtle border-success' : ''} ${isRemoved ? 'bg-danger-subtle border-danger' : ''} ${isModified ? 'bg-warning-subtle border-warning' : ''}`}>
      <Card.Header className="fw-bold d-flex justify-content-between align-items-center">
        <span>
          {isAdded && <FontAwesomeIcon icon={faPlus} className="me-2 text-success" />}
          {isRemoved && <FontAwesomeIcon icon={faMinus} className="me-2 text-danger" />}
          {isModified && <FontAwesomeIcon icon={faExchangeAlt} className="me-2 text-warning" />}
          Module {module?.orderIndex}: {module?.title}
        </span>
        {isModified && <Badge bg="warning">{texts.sections?.modified}</Badge>}
        {isAdded && <Badge bg="success">{texts.sections?.added}</Badge>}
        {isRemoved && <Badge bg="danger">{texts.sections?.removed}</Badge>}
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          {module?.contents?.length > 0 ? (
            module.contents?.map(content => {
              const { icon, variant } = getContentTypeInfo(content);
              let contentStatus = '';
              if (contentDiff) {
                if (contentDiff.added.some(c => c?.id === content?.id)) contentStatus = 'added';
                else if (contentDiff.removed.some(c => c?.id === content?.id)) contentStatus = 'removed';
                else if (contentDiff.modified.some(c => c?.id === content?.id)) contentStatus = 'modified';
                else if (contentDiff.unchanged.some(c => c?.id === content?.id)) contentStatus = 'unchanged';
              }

              return (
                <ListGroup.Item key={content?.id} className={`d-flex align-items-center ${contentStatus === 'added' ? 'bg-success-subtle' : ''} ${contentStatus === 'removed' ? 'bg-danger-subtle' : ''} ${contentStatus === 'modified' ? 'bg-warning-subtle' : ''}`}>
                  <FontAwesomeIcon icon={icon} className="me-2" />
                  {content?.title}
                  <Badge bg={variant} className="ms-2">{content?.type}</Badge>
                  {contentStatus === 'added' && <Badge bg="success" className="ms-2">{texts.sections?.added}</Badge>}
                  {contentStatus === 'removed' && <Badge bg="danger" className="ms-2">{texts.sections?.removed}</Badge>}
                  {contentStatus === 'modified' && <Badge bg="warning" className="ms-2">{texts.sections?.modified}</Badge>}
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

  // Removed allVersionsNumbers and allVersionsOptions derivation


  return (
    <section className="course-version-comparison-page py-5">
      <Container>
        <h2 className="mb-4 fw-bold text-primary text-center">
          {texts.sections?.versionComparison}: {courseId ? `Course ID: ${courseId}` : 'N/A'}
        </h2>

        {/* Removed loadingAllVersions and allVersionsError checks here */}
        {/* The form is always visible to allow input */}

        <Form className="mb-5 p-4 rounded-4 shadow-sm bg-light">
          <Row className="g-3 align-items-end">
            <Col md={5}>
              <Form.Group controlId="versionAInput"> {/* NEW: Input field for Version A */}
                <Form.Label>{texts.sections?.versionA}</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={texts.sections?.enterVersionNumber}
                  value={versionAInput}
                  onChange={(e) => setVersionAInput(e.target.value)}
                  min="1"
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group controlId="versionBInput"> {/* NEW: Input field for Version B */}
                <Form.Label>{texts.sections?.versionB}</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={texts.sections?.enterVersionNumber}
                  value={versionBInput}
                  onChange={(e) => setVersionBInput(e.target.value)}
                  min="1"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <CustomButton variant="primary" onClick={handleCompare} isLoading={comparisonLoading || loadingVersionA || loadingVersionB} className="w-100"> {/* Combined loading states */}
                {texts.sections?.compare}
              </CustomButton>
            </Col>
          </Row>
        </Form>

        {comparisonLoading && (loadingVersionA || loadingVersionB) && ( // Combined loading states
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Comparing versions...</span>
            </Spinner>
            <p className="mt-3">Comparing versions...</p>
          </div>
        )}

        {(comparisonError || versionAError || versionBError) && ( // Combined error states
          <Alert variant="danger">{texts.alerts?.apiError?.(comparisonError?.message || versionAError?.message || versionBError?.message || texts.alerts?.comparisonError)}</Alert>
        )}

        {comparisonResult && (
          <Row className="mt-5 g-4">
            <Col md={6}>
              <Card className="h-100 shadow-sm border-0 rounded-4 p-3">
                <Card.Title className="fw-bold text-primary">
                  {texts.sections?.versionA}: {versionAInput}
                  <small className="d-block text-muted">({courseVersionA?.name})</small>
                </Card.Title>
                <hr />
                {comparisonResult.metadata.length > 0 && comparisonResult.metadata.some(m => m.field === 'description') && (
                  <div className="mb-3">
                    <h5 className="text-secondary">Description</h5>
                    <MarkdownRenderer markdownText={comparisonResult.metadata.find(m => m.field === 'description')?.oldValue || ''} />
                  </div>
                )}
                <h5 className="text-secondary">{texts.sections?.modules}</h5>
                {comparisonResult.modules.removed.length > 0 && (
                  <div className="mb-3">
                    <h6><Badge bg="danger">{texts.sections?.removed}</Badge> Modules</h6>
                    {comparisonResult.modules.removed.map(module => renderModuleContent(module, false, true, false))}
                  </div>
                )}
                {comparisonResult.modules.modified.length > 0 && (
                  <div className="mb-3">
                    <h6><Badge bg="warning">{texts.sections?.modified}</Badge> Modules</h6>
                    {comparisonResult.modules.modified.map(diff => renderModuleContent(diff.moduleA, false, false, true, diff.contentDiff))}
                  </div>
                )}
                {comparisonResult.modules.unchanged.length > 0 && (
                  <div className="mb-3">
                    <h6><Badge bg="secondary">{texts.sections?.noChanges}</Badge> Modules</h6>
                    {comparisonResult.modules.unchanged.map(module => renderModuleContent(module))}
                  </div>
                )}
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 shadow-sm border-0 rounded-4 p-3">
                <Card.Title className="fw-bold text-primary">
                  {texts.sections?.versionB}: {courseVersionB?.currentPublishedVersion || versionBInput}
                  <small className="d-block text-muted">({courseVersionA?.name})</small>
                </Card.Title>
                <hr />
                {comparisonResult.metadata.length > 0 && comparisonResult.metadata.some(m => m.field === 'description') && (
                  <div className="mb-3">
                    <h5 className="text-secondary">Description</h5>
                    <MarkdownRenderer markdownText={comparisonResult.metadata.find(m => m.field === 'description')?.newValue || ''} />
                  </div>
                )}
                <h5 className="text-secondary">{texts.sections?.modules}</h5>
                {comparisonResult.modules.added.length > 0 && (
                  <div className="mb-3">
                    <h6><Badge bg="success">{texts.sections?.added}</Badge> Modules</h6>
                    {comparisonResult.modules.added.map(module => renderModuleContent(module, true, false, false))}
                  </div>
                )}
                {comparisonResult.modules.modified.length > 0 && (
                  <div className="mb-3">
                    <h6><Badge bg="warning">{texts.sections?.modified}</Badge> Modules</h6>
                    {comparisonResult.modules.modified.map(diff => renderModuleContent(diff.moduleB, false, false, true, diff.contentDiff))}
                  </div>
                )}
                {comparisonResult.modules.unchanged.length > 0 && (
                  <div className="mb-3">
                    <h6><Badge bg="secondary">{texts.sections?.noChanges}</Badge> Modules</h6>
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