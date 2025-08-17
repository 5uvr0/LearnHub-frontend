// src/components/cards/InstructorCard.jsx

import React from 'react';
import { Card } from 'react-bootstrap';
import CustomButton from '../common/CustomButton.jsx';
import texts from '../../../i18n/texts.js';
import { getRandomModerateColor } from '../../../utils/colorUtils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate } from '@fortawesome/free-solid-svg-icons'; // Import a suitable icon

// Helper function to get initials from a full name
const getInitials = (fullName) => {
  if (!fullName) return '';
  const parts = fullName.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

const InstructorCard = ({ instructor, onViewProfile, viewProfileText }) => {
  // Defensive check for 'instructor' object
  if (!instructor) {
    return (
      <Card className="h-100 shadow-sm border-0 rounded-circle-top text-center p-3">
        <Card.Body>
          <p className="text-muted">Instructor data missing.</p>
        </Card.Body>
      </Card>
    );
  }

  const initials = getInitials(instructor?.name);
  const backgroundColor = getRandomModerateColor(); // Random background color
  const borderColor = getRandomModerateColor(); // Another random color for border

  return (
    <Card className="shadow-sm border-0 rounded-lg h-100 w-100 rounded-lg d-flex flex-column">
      <Card.Body className="d-flex flex-column align-items-center text-center p-4">

        <div
          className="rounded-circle d-flex align-items-center justify-content-center text-white font-bold text-2xl mb-3"
          style={{
            width: '250px',
            height: '250px',
            backgroundColor: backgroundColor,
            border: `3px solid ${borderColor}`,
          }}
        >
          {/* Use FontAwesomeIcon for the placeholder */}
          <FontAwesomeIcon icon={faUserGraduate} size="6x" />
        </div>


        <Card.Title className="fw-bold mb-2 text-xl">{instructor?.name}</Card.Title>
        <Card.Text className="text-muted mb-3 flex-grow-1">{instructor?.email}</Card.Text>
        <CustomButton
          variant="primary"
          onClick={() => onViewProfile?.(instructor?.id)}
          className="mt-auto w-100"
        >
          {viewProfileText}
        </CustomButton>
      </Card.Body>
    </Card>
  );
};

export default InstructorCard;