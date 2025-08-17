// src/components/cards/ModuleCard.jsx

import React from 'react';
import { Card, ListGroup, Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faEdit, faTrash, faArrowsAltV } from '@fortawesome/free-solid-svg-icons'; // Import reorder icon
import ContentListItem from '../content/ContentListItem.jsx';
import CustomButton from '../common/CustomButton.jsx';
import texts from '../../../i18n/texts.js';

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
  onViewContentDetails,
  onReorderContents // NEW: Add a prop for the reorder function
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
            <div className="d-flex align-items-center">
              <CustomButton
                as="span"
                variant="outline-primary"
                size="sm"
                icon={faEdit}
                className="me-2"
                onClick={(e) => { e.stopPropagation(); onEditModule?.(module); }}
              >
                Edit Module
              </CustomButton>
              {/* NEW: Reorder Contents button */}
              {module?.contents?.length > 1 && (
                <CustomButton
                  as="span"
                  variant="outline-info"
                  size="sm"
                  icon={faArrowsAltV}
                  className="me-2"
                  onClick={(e) => { e.stopPropagation(); onReorderContents?.(module); }}
                >
                  Reorder Contents
                </CustomButton>
              )}
              <CustomButton
                as="span"
                variant="outline-danger"
                size="sm"
                icon={faTrash}
                onClick={(e) => { e.stopPropagation(); onDeleteModule?.(module?.id, module?.title); }}
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
                  ?.sort((a, b) => (a?.currentContentRelease?.orderIndex || 0) - (b?.currentContentRelease?.orderIndex || 0))
                  ?.map((content) => (
                    <ContentListItem
                      key={content?.id}
                      content={content}
                      isTeacherView={isTeacherView}
                      onAddContent={onAddContent}
                      onEditContent={onEditContent}
                      onDeleteContent={onDeleteContent}
                      onPublishContent={onPublishContent}
                      onViewContentVersions={onViewContentVersions}
                      onManageQuiz={onManageQuiz}
                      onViewContentDetails={onViewContentDetails}
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