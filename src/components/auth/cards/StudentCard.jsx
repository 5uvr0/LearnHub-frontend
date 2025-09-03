import React, { useState } from 'react';
import { Card, Badge, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faEnvelope, faPhone, faMapMarkerAlt, faBirthdayCake, faVenusMars } from '@fortawesome/free-solid-svg-icons';

const StudentCard = ({ student }) => {
    const [imageError, setImageError] = useState(false);

    const fullName = (student.firstName && student.lastName) 
        ? `${student.firstName} ${student.lastName}` 
        : student.email;
    
    const dateOfBirth = student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A';
    const gender = student.gender || 'N/A';
    const phone = student.phone || 'N/A';
    const address = student.address || 'N/A';

    const handleImageError = () => {
        setImageError(true);
    };
    
    return (
        <Card className="h-100 shadow-sm border-0 rounded-2 student-card">
            {imageError || !student.imageUrl ? (
                <div 
                    className="d-flex justify-content-center align-items-center bg-light text-muted text-center"
                    style={{ height: '150px', borderTopLeftRadius: '0.25rem', borderTopRightRadius: '0.25rem' }}
                >
                    Profile Picture Not Given
                </div>
            ) : (
                <Card.Img 
                    variant="top" 
                    src={student.imageUrl}
                    alt={`${fullName}'s profile`} 
                    className="card-img-top-custom"
                    onError={handleImageError}
                />
            )}

            <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                    <FontAwesomeIcon icon={faGraduationCap} size="2x" className="text-primary me-3" />
                    <div>
                        <Card.Title className="h5 mb-0">{fullName}</Card.Title>
                        <Card.Subtitle className="text-muted small mt-1">
                            <FontAwesomeIcon icon={faEnvelope} className="me-1" />{student.email}
                        </Card.Subtitle>
                    </div>
                </div>
                <hr />
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <FontAwesomeIcon icon={faPhone} className="me-2 text-muted" />
                        <span className="fw-bold">Phone:</span> {phone}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-muted" />
                        <span className="fw-bold">Address:</span> {address}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FontAwesomeIcon icon={faBirthdayCake} className="me-2 text-muted" />
                        <span className="fw-bold">Birth Date:</span> {dateOfBirth}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FontAwesomeIcon icon={faVenusMars} className="me-2 text-muted" />
                        <span className="fw-bold">Gender:</span> {gender}
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    );
};

export default StudentCard;