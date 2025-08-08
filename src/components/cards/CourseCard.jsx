// src/components/cards/CourseCard.jsx

import React from 'react';
import { Card } from 'react-bootstrap';
import CustomButton from '../common/CustomButton';

const CourseCard = ({ course, onDetailsClick, learnMoreText }) => {
  const defaultImageUrl = "https://placehold.co/400x250/cccccc/333333?text=Course";

  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
      <Card.Img
        variant="top"
        src={course.imageUrl || defaultImageUrl}
        alt={course.name}
        className="card-img-top"
        onError={(e) => { e.target.onerror = null; e.target.src = defaultImageUrl; }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold text-primary">{course.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Instructor: {course.instructorName}</Card.Subtitle>
        <Card.Text className="text-secondary flex-grow-1">
          {course.description}
        </Card.Text>
        <CustomButton variant="outline-primary" onClick={() => onDetailsClick(course.courseId)}>
          {learnMoreText}
        </CustomButton>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;