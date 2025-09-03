import React, { useState } from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faEnvelope, faBirthdayCake } from '@fortawesome/free-solid-svg-icons';

const InstructorCard = ({ instructor }) => {
    const [imageError, setImageError] = useState(false);
    
    const handleImageError = () => {
        setImageError(true);
    };

    const dateOfBirth = instructor.dateOfBirth ? new Date(instructor.dateOfBirth).toLocaleDateString() : 'N/A';
    
    return (
        <Card className="h-100 shadow-sm border-0 rounded-2 instructor-card">
            {imageError || !instructor.imageUrl ? (
                <div 
                    className="d-flex justify-content-center align-items-center bg-light text-muted text-center"
                    style={{ height: '150px', borderTopLeftRadius: '0.25rem', borderTopRightRadius: '0.25rem' }}
                >
                    Profile Picture Not Given
                </div>
            ) : (
                <Card.Img 
                    variant="top" 
                    src={instructor.imageUrl}
                    alt={`${instructor.name || instructor.email}'s profile`} 
                    className="card-img-top-custom"
                    onError={handleImageError}
                />
            )}
            <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                    <FontAwesomeIcon icon={faUserTie} size="2x" className="text-info me-3" />
                    <div>
                        <Card.Title className="h5 mb-0">{instructor.name || 'N/A'}</Card.Title>
                        <Card.Subtitle className="text-muted small mt-1">
                            <FontAwesomeIcon icon={faEnvelope} className="me-1" />{instructor.email}
                        </Card.Subtitle>
                    </div>
                </div>
                <hr />
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <FontAwesomeIcon icon={faBirthdayCake} className="me-2 text-muted" />
                        <span className="fw-bold">Birth Date:</span> {dateOfBirth}
                    </ListGroup.Item>
                </ListGroup>

            </Card.Body>
        </Card>
    );
};

export default InstructorCard;