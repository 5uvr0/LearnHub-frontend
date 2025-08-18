// src/components/learner/cards/ModuleCard.jsx
import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import ContentListItem from '../content/ContentListItem.jsx';

const ModuleCard = ({ module, onViewContent }) => {
  if (!module) {
    return (
        <Card className="text-center p-3 mb-3">
          <Card.Body>
            <p className="text-muted mb-0">Module data missing.</p>
          </Card.Body>
        </Card>
    );
  }

  return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 text-primary">
              {module.title}
            </h5>
            <span className="badge bg-secondary">
            {module.completedContentCount || 0} / {module.numberOfContents || 0} completed
          </span>
          </div>

          {module.contents && module.contents.length > 0 ? (
              <ListGroup variant="flush">
                {module.contents.map((content) => (
                    <ContentListItem
                        key={content.id}
                        content={content}
                        isTeacherView={false}
                        onClick={() => onViewContent?.(content)}
                    />
                ))}
              </ListGroup>
          ) : (
              <p className="text-muted mb-0 text-center">No contents in this module.</p>
          )}
        </Card.Body>
      </Card>
  );
};

export default ModuleCard;
