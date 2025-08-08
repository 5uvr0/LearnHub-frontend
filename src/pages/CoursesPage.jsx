// src/pages/CoursesPage.jsx

import React from 'react';
import { Container } from 'react-bootstrap';
import CourseCard from '../components/cards/CourseCard';
import texts from '../i18n/texts';

const CoursesPage = ({ setCurrentPage, setCourseDetailId }) => {
  const handleCourseDetailsClick = (courseId) => {
    setCourseDetailId(courseId);
    setCurrentPage('courseDetails');
  };

  return (
    <section className="courses-page py-5">
      <Container>
        <h2 className="text-center mb-5 fw-bold text-primary">{texts.sections.allCourses}</h2>
        <div className="row g-4">
          {texts.sampleCourses.map((course) => (
            <div className="col-md-6 col-lg-4" key={course.id}>
              <CourseCard
                course={course}
                onDetailsClick={handleCourseDetailsClick}
                learnMoreText={texts.courseCard.learnMore}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CoursesPage;