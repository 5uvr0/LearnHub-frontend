// src/pages/HomePage.jsx

import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import CustomButton from "../components/common/CustomButton.jsx";
import texts from "../i18n/texts.js";

const HomePage = () => { 
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams(); // Hook to read URL parameters

    // Check for logout success parameter
    useEffect(() => {
        if (searchParams.get('logout') === 'success') {
            // Show the alert
            alert('Logged out successfully!');
            
            // Clean up the URL by removing the parameter
            searchParams.delete('logout');
            setSearchParams(searchParams);
        }
    }, [searchParams, setSearchParams]);

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
        </>
    );
};

export default HomePage;