// src/App.jsx

import React, { useState } from 'react';
import AppNavbar from './components/layout/AppNavbar';
import AppFooter from './components/layout/AppFooter';
import AppSidebar from './components/layout/AppSidebar'; // Import the new sidebar
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import InstructorsPage from './pages/InstructorsPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css'; // Global CSS

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [courseDetailId, setCourseDetailId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false); // State for sidebar visibility

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} setCourseDetailId={setCourseDetailId} />;
      case 'courses':
        return <CoursesPage setCurrentPage={setCurrentPage} setCourseDetailId={setCourseDetailId} />;
      case 'instructors':
        return <InstructorsPage setCurrentPage={setCurrentPage} />;
      case 'courseDetails':
        return <CourseDetailsPage courseId={courseDetailId} />;
      // Add more cases for other pages here
      default:
        return <HomePage setCurrentPage={setCurrentPage} setCourseDetailId={setCourseDetailId} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="App d-flex flex-column min-vh-100">
        <AppNavbar currentPage={currentPage} setCurrentPage={setCurrentPage} handleShowSidebar={handleShowSidebar} />

        {/* The Sidebar Component */}
        <AppSidebar
          show={showSidebar}
          handleClose={handleCloseSidebar}
          setCurrentPage={setCurrentPage}
        />

        <main className="flex-grow-1">
          {renderPage()}
        </main>
        <AppFooter />
      </div>
    </ThemeProvider>
  );
}

export default App;