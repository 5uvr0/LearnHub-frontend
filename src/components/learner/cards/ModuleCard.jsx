import React, { useState } from "react";
import { Card, Accordion, ListGroup, Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faAngleRight, faAngleDown, faChevronRight, faChevronDown} from "@fortawesome/free-solid-svg-icons";
import ContentListItem from "../content/ContentListItem.jsx";

const ModuleCard = ({ module, eventKey }) => {
    const [showContents, setShowContents] = useState(false);

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
            <Accordion.Header onClick={(e) => e.preventDefault()}>
                <div className="d-flex justify-content-between align-items-center w-100">
                    {/* Module title + badge */}
                    <span className="fw-bold text-primary">
            {module.orderIndex}. {module.title}
                        <span className="ms-3 badge bg-secondary">
              {module.completedContentCount}/{module.numberOfContents} Completed
            </span>
          </span>

                    {/* Toggle icon on the right */}
                    <FontAwesomeIcon
                        icon={showContents ? faChevronDown : faChevronRight}
                        className="text-primary"
                        style={{ fontSize: "1.3rem", cursor: "pointer" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowContents(!showContents);
                        }}
                    />
                </div>
            </Accordion.Header>

            <Accordion.Body className="p-0">
                <Card className="border-0 rounded-0">
                    <Card.Body className="p-0">
                        <Collapse in={showContents}>
                            <div>
                                {module.contents && module.contents.length > 0 ? (
                                    <ListGroup variant="flush">
                                        {module.contents.map((content) => (
                                            <ContentListItem key={content.id} content={content} />
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p className="text-muted p-3 mb-0 text-center">
                                        No contents available for this module.
                                    </p>
                                )}
                            </div>
                        </Collapse>
                    </Card.Body>
                </Card>
            </Accordion.Body>
        </Accordion.Item>
    );
};

export default ModuleCard;
