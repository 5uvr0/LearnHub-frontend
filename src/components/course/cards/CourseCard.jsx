import React, { useState } from 'react'; // Import useState
import { Card } from 'react-bootstrap';
import CustomButton from '../../common/CustomButton.jsx';
import { getRandomModerateColor } from '../../../utils/colorUtils.js';
import MarkdownRenderer from '../../common/MarkdownRender.jsx';

const CourseCard = ({ course, onDetailsClick, learnMoreText, maxDescriptionLength = 30 }) => { // Add a prop for max length
  const [showFullDescription, setShowFullDescription] = useState(false); // State to toggle description

  if (!course) {
    return (
      <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden text-center p-3">
        <Card.Body>
          <p className="text-muted">Course data missing.</p>
        </Card.Body>
      </Card>
    );
  }

  const cardColor = getRandomModerateColor();

  const generateCourseSvg = (bgColor) => {
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="${bgColor}"/>
        <path d="M50 30 L150 30 L150 120 L100 100 L50 120 Z" fill="#FFFFFF" stroke="#333333" stroke-width="5" stroke-linejoin="round"/>
        <line x1="100" y1="100" x2="100" y2="120" stroke="#333333" stroke-width="3"/>
        <circle cx="100" cy="70" r="15" fill="#333333"/>
        <text x="100" y="75" font-family="Arial" font-size="20" fill="${bgColor}" text-anchor="middle" font-weight="bold">📚</text>
      </svg>
    `;
  };

  const descriptionText = course?.description || '';
  const isDescriptionLong = descriptionText.length > maxDescriptionLength;

  const displayedDescription = showFullDescription || !isDescriptionLong
    ? descriptionText
    : `${descriptionText.substring(0, maxDescriptionLength)}...`;

  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
      <div
        className="card-img-top d-flex align-items-center justify-content-center"
        style={{ height: '200px', backgroundColor: cardColor }}
        dangerouslySetInnerHTML={{ __html: generateCourseSvg(cardColor) }}
      ></div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold text-primary">{course?.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Instructor: {course?.instructorName}</Card.Subtitle>
        <Card.Text className="text-secondary flex-grow-1">
          <MarkdownRenderer markdownText={displayedDescription} className="lead text-secondary" />
          {isDescriptionLong && (
            <span
              className="text-primary fw-bold text-decoration-none"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? ' See Less' : ' See More'}
            </span>
          )}
        </Card.Text>
        <CustomButton variant="outline-primary" onClick={() => onDetailsClick?.(course?.id)}>
          {learnMoreText}
        </CustomButton>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;