// src/components/cards/ModuleCard.jsx

import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileVideo, faQuestionCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import texts from '../../i18n/texts'; // Assuming texts are needed for content types

// Helper to render content based on type
const renderContentItem = (content) => {
  let icon = faClipboardList; // Default icon
  let typeLabel = "Content";

  switch (content.type) {
    case "LectureCatalogDTO":
      icon = faFileVideo;
      typeLabel = "Lecture";
      break;
    case "QuizCatalogDTO":
      icon = faQuestionCircle;
      typeLabel = "Quiz";
      break;
    case "SubmissionCatalogueDTO":
      icon = faClipboardList;
      typeLabel = "Submission";
      break;
    default:
      // For generic ContentCatalogueDTO or unrecognized types
      icon = faClipboardList;
      typeLabel = "Content";
  }

  return (
    <ListGroup.Item key={content.id} className="d-flex align-items-center">
      <FontAwesomeIcon icon={icon} className="me-2 text-muted" />
      <div>
        <h6 className="mb-0">{content.title} <span className="badge bg-secondary ms-2">{typeLabel}</span></h6>
        {content.description && <small className="text-muted">{content.description}</small>}
        {/* You could add more details here, e.g., links to video/resources */}
      </div>
    </ListGroup.Item>
  );
};

const ModuleCard = ({ module }) => {
  return (
    <Card className="h-100 shadow-sm border-0 rounded-4">
      <Card.Header className="fw-bold text-primary bg-light d-flex justify-content-between align-items-center">
        {module.orderIndex + 1}. {module.title}
        <span className="badge bg-info text-dark">ID: {module.id}</span>
      </Card.Header>
      <Card.Body className="p-0">
        {module.contents && module.contents.length > 0 ? (
          <ListGroup variant="flush">
            {module.contents.map((content) => renderContentItem(content))}
          </ListGroup>
        ) : (
          <p className="text-muted p-3 mb-0">No contents available for this module.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default ModuleCard;