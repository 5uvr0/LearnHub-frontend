// src/pages/InstructorsPage.jsx

import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import InstructorCard from '../components/cards/InstructorCard';
import texts from '../i18n/texts';

const InstructorsPage = () => { // Removed setCurrentPage, setInstructorDetailId props
  const navigate = useNavigate();

  const handleViewProfileClick = (instructorId) => {
    // Implement navigation to instructor profile page if needed
    alert(`Viewing profile for instructor ID: ${instructorId}`);
    // navigate(`/instructors/${instructorId}`); // If you create an instructor details page
  };

  return (
    <section className="instructors-page py-5">
      <Container>
        <h2 className="text-center mb-5 fw-bold text-primary">{texts.sections.ourInstructors}</h2>
        <div className="row g-4 justify-content-center">
          {texts.sampleInstructors.map((instructor) => (
            <div className="col-md-6 col-lg-4 d-flex" key={instructor.id}>
              <InstructorCard
                instructor={instructor}
                onViewProfile={handleViewProfileClick}
                viewProfileText={texts.instructorCard.viewProfile}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default InstructorsPage;