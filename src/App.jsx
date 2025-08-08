// src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import routing components
import AppNavbar from './components/layout/AppNavbar';
import AppFooter from './components/layout/AppFooter';
import AppSidebar from './components/layout/AppSidebar';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import InstructorsPage from './pages/InstructorsPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css'; // Global CSS

function App() {
  const [showSidebar, setShowSidebar] = useState(false); // State for sidebar visibility

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  return (
    <ThemeProvider> {/* Wrap your entire app with ThemeProvider */}
      <Router> {/* Wrap your entire app with Router */}
        <div className="App d-flex flex-column min-vh-100">
          {/* AppNavbar now receives handleShowSidebar prop and currentPage via location.pathname */}
          <AppNavbar handleShowSidebar={handleShowSidebar} />

          {/* The Sidebar Component */}
          <AppSidebar
            show={showSidebar}
            handleClose={handleCloseSidebar}
          />

          <main className="flex-grow-1">
            <Routes> {/* Define your routes here */}
              <Route path="/" element={<HomePage />} /> {/* Home Page */}
              <Route path="/courses" element={<CoursesPage />} /> {/* All Courses Page */}
              <Route path="/courses/:id" element={<CourseDetailsPage />} /> {/* Course Details Page */}
              <Route path="/instructors" element={<InstructorsPage />} /> {/* All Instructors Page */}
              {/* Add more routes for other pages like /about, /contact, /instructors/:id etc. */}
              <Route path="*" element={<HomePage />} /> {/* Fallback to Home for unknown routes */}
            </Routes>
          </main>
          <AppFooter />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;