// src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/layout/AppNavbar';
import AppFooter from './components/layout/AppFooter';
import AppSidebar from './components/layout/AppSidebar';
import RegistrationPage from './auth-pages/RegistrationPage';
import LoginPage from './auth-pages/LoginPage';
import HomePage from './course-pages/HomePage';
import CoursesPage from './course-pages/CoursesPage';
import InstructorsPage from './course-pages/InstructorsPage';
import StudentCourseDetailsPage from './course-pages/StudentCourseDetailsPage';
import TeacherDashboardPage from './course-pages/TeacherDashboardPage';
import CourseConfiguratorPage from './course-pages/CourseConfiguratorPage';
import TeacherCourseDetailsPage from './course-pages/TeacherCourseDetailsPage';
import CoursePublicView from './course-pages/CoursePublicView';
import ContentVersionsPage from './course-pages/ContentVersionsPage';
import QuizConfiguratorPage from './course-pages/QuizConfiguratorPage';
// import InstructorDetailsPage from './course-pages/InstructorDetailsPage';
import InstructorPublicViewPage from './course-pages/InstructorPublicViewPage'; // NEW: Import InstructorPublicViewPage
import LoginErrorPage from './ErrorPages/LoginErrorPage';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

function App() {
    const [showSidebar, setShowSidebar] = useState(false);

    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);

    return (
        <ThemeProvider>
            <Router>
                <div className="App d-flex flex-column min-vh-100">
                    <AppNavbar handleShowSidebar={handleShowSidebar} />

                    <AppSidebar
                        show={showSidebar}
                        handleClose={handleCloseSidebar}
                    />

                    <main className="flex-grow-1">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/courses" element={<CoursesPage />} />
                            <Route path="/courses/:id" element={<StudentCourseDetailsPage />} />
                            <Route path="/public-course-view/:id" element={<CoursePublicView />} />
                            <Route path="/instructors" element={<InstructorsPage />} />
                            {/* <Route path="/instructors/:id" element={<InstructorDetailsPage />} /> */}
                            <Route path="/public-instructors/:id" element={<InstructorPublicViewPage />} /> {/* NEW: Public Instructor View */}

                            {/* Teacher Dashboard & Course Management Routes */}
                            <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
                            <Route path="/teacher/courses/new" element={<CourseConfiguratorPage />} />
                            <Route path="/teacher/courses/:id/edit" element={<CourseConfiguratorPage />} />
                            <Route path="/teacher/courses/:id" element={<TeacherCourseDetailsPage />} />

                            {/* Content Management Routes */}
                            <Route path="/teacher/contents/:contentId/versions" element={<ContentVersionsPage />} />
                            <Route path="/teacher/quizzes/:contentId" element={<QuizConfiguratorPage />} />

                            {/* User Registration & Login Routes */}
                            <Route path="/register" element={<RegistrationPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/login/error" element={<LoginErrorPage />}/>

                            {/* Add more routes for About, Contact, etc. */}
                            <Route path="/about" element={
                                <div className="py-5 text-center">
                                    <h2>About Us</h2>
                                    <p>LearnHub is dedicated to providing quality online education.</p>
                                </div>
                            } />
                            <Route path="/contact" element={
                                <div className="py-5 text-center">
                                    <h2>Contact Us</h2>
                                    <p>Reach out to us at support@learnhub.com</p>
                                </div>
                            } />

                            {/* Fallback for unknown routes */}
                            <Route path="*" element={
                                <div className="py-5 text-center">
                                    <h2>404 - Page Not Found</h2>
                                    <p>Oops! The page you're looking for does not exist.</p>
                                </div>
                            } />
                        </Routes>
                    </main>
                    <AppFooter />
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;