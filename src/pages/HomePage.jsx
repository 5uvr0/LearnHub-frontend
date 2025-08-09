// src/pages/HomePage.jsx

import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import CustomButton from '../components/common/CustomButton';
import CourseCard from '../components/cards/CourseCard';
import texts from '../i18n/texts';

const HomePage = () => { // Removed setCurrentPage, setCourseDetailId props
    const navigate = useNavigate(); // Hook to get navigation function

    const handleExploreCoursesClick = () => {
        alert(texts.alerts.exploreCoursesClicked);
        navigate('/courses'); // Navigate to the /courses path
    };

    const handleCourseDetailsClick = (courseId) => {
        navigate(`/courses/${courseId}`); // Navigate to /courses/:id path
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section bg-primary text-white py-5 py-lg-0 d-flex align-items-center flex-grow-1">
                <Container>
                    <div className="row align-items-center">
                        <div className="col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
                            <h1 className="display-4 fw-bold mb-3">{texts.hero.headline}</h1>
                            <p className="lead mb-4 opacity-75">
                                {texts.hero.description}
                            </p>
                            <CustomButton variant="light" onClick={handleExploreCoursesClick}>
                                {texts.hero.exploreButton}
                            </CustomButton>
                        </div>
                        <div className="col-lg-6 text-center">
                            {/* Placeholder image for hero section */}
                            <img
                                src="https://placehold.co/600x400/87CEEB/FFFFFF?text=LearnHub+Hero"
                                alt="LearnHub Hero Image"
                                className="img-fluid rounded-4 shadow-lg"
                            />
                        </div>
                    </div>
                </Container>
            </section>

            {/* Popular Courses Section */}
            <section id="popular-courses" className="courses-section py-5 bg-light">
                <Container>
                    <h2 className="text-center mb-5 fw-bold text-primary">{texts.sections.popularCourses}</h2>
                    <div className="row g-4">
                        {texts.sampleCourses?.slice(0, 3).map((course) => ( // Show first 3 as popular
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
        </>
    );
};

export default HomePage;