// src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/layout/AppNavbar';
import AppFooter from './components/layout/AppFooter';
import AppSidebar from './components/layout/AppSidebar';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import InstructorsPage from './pages/InstructorsPage';
import StudentCourseDetailsPage from './pages/StudentCourseDetailsPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import CourseConfiguratorPage from './pages/CourseConfiguratorPage';
import TeacherCourseDetailsPage from './pages/TeacherCourseDetailsPage';
import CoursePublicView from './pages/CoursePublicView';
import ContentVersionsPage from './pages/ContentVersionsPage';
import QuizConfiguratorPage from './pages/QuizConfiguratorPage';
// import InstructorDetailsPage from './pages/InstructorDetailsPage';
import InstructorPublicViewPage from './pages/InstructorPublicViewPage'; // NEW: Import InstructorPublicViewPage
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css'; // Global CSS

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