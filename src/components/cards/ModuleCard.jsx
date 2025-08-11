// src/components/cards/ModuleCard.jsx

import React from 'react';
import { Card, ListGroup, Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ContentListItem from '../content/ContentListItem';
import CustomButton from '../common/CustomButton';
import texts from '../../i18n/texts';

const ModuleCard = ({
  module,
  isTeacherView = false,
  onAddContent,
  onEditContent,
  onDeleteContent,
  onPublishContent,
  onViewContentVersions,
  onManageQuiz,
  onEditModule,
  onDeleteModule,
  eventKey,
}) => {
  if (!module) {
    return (
      <Card className="text-center p-3">
        <Card.Body>
          <p className="text-muted">Module data missing.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>
        <div className="d-flex justify-content-between align-items-center w-100 pe-3">
          <span className="fw-bold text-primary">
            {module?.orderIndex}. {module?.title}
            <span className="ms-3 badge bg-secondary">
              {module?.contents?.length || 0} {module?.contents?.length === 1 ? 'Content' : 'Contents'}
            </span>
          </span>
          {isTeacherView && (
            <div className="d-flex align-items-center"> {/* Wrap buttons in a div */}
              <CustomButton
                as="span" // Render as a span to avoid nested button error
                variant="outline-primary"
                size="sm"
                icon={faEdit}
                className="me-2"
                onClick={(e) => { e.stopPropagation(); onEditModule?.(module); }} // Stop propagation
              >
                Edit Module
              </CustomButton>
              <CustomButton
                as="span" // Render as a span
                variant="outline-danger"
                size="sm"
                icon={faTrash}
                onClick={(e) => { e.stopPropagation(); onDeleteModule?.(module?.id, module?.title); }} // Stop propagation
              >
                Delete Module
              </CustomButton>
            </div>
          )}
        </div>
      </Accordion.Header>
      <Accordion.Body className="p-0">
        <Card className="border-0 rounded-0">
          <Card.Body className="p-0">
            {module?.contents && module.contents?.length > 0 ? (
              <ListGroup variant="flush">
                {module.contents
                  ?.sort((a, b) => (a?.orderIndex || 0) - (b?.orderIndex || 0))
                  ?.map((content) => (
                    <ContentListItem
                      key={content?.id}
                      content={content}
                      isTeacherView={isTeacherView}
                      onAddContent={onAddContent} // Pass through
                      onEditContent={onEditContent}
                      onDeleteContent={onDeleteContent}
                      onPublishContent={onPublishContent}
                      onViewContentVersions={onViewContentVersions}
                      onManageQuiz={onManageQuiz}
                    />
                  ))}
              </ListGroup>
            ) : (
              <p className="text-muted p-3 mb-0 text-center">No contents available for this module.</p>
            )}
          </Card.Body>
          {isTeacherView && (
            <Card.Footer className="text-end bg-light">
              <CustomButton variant="success" size="sm" icon={faPlusCircle} onClick={() => onAddContent?.(module?.id)}>
                Add Content
              </CustomButton>
            </Card.Footer>
          )}
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default ModuleCard;