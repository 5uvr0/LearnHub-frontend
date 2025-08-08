// src/components/cards/InstructorCard.jsx

import React from 'react';
import { Card } from 'react-bootstrap';
import CustomButton from '../common/CustomButton';

const InstructorCard = ({ instructor, onViewProfile, viewProfileText }) => {
  const defaultImageUrl = "https://placehold.co/150x150/cccccc/333333?text=Instructor";

  return (
    <Card className="h-100 shadow-sm border-0 rounded-circle-top text-center p-3">
      <div className="d-flex justify-content-center mb-3">
        <Card.Img
          variant="top"
          src={instructor.imageUrl || defaultImageUrl}
          alt={instructor.name}
          className="rounded-circle"
          style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid var(--bs-primary)' }}
          onError={(e) => { e.target.onerror = null; e.target.src = defaultImageUrl; }}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold text-primary mb-1">{instructor.name}</Card.Title>
        <Card.Text className="text-muted small mb-3">{instructor.email}</Card.Text>
        <CustomButton variant="outline-info" onClick={() => onViewProfile(instructor.id)}>
          {viewProfileText}
        </CustomButton>
      </Card.Body>
    </Card>
  );
};

export default InstructorCard;