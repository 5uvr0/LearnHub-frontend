// src/components/layout/AppNavbar.jsx

import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap'; // Added Offcanvas
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faBars, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import CustomButton from '../../common/CustomButton.jsx';
import { useTheme } from '../../../course-hooks/useTheme.js';
import texts from '../../../i18n/texts.js';

// Import Lucide icons for the Offcanvas menu
import { Home, BookOpen, Users, Settings, LogOut, LayoutDashboard, UserCircle2, GraduationCap, FileText, Info, Mail } from 'lucide-react';

const AppNavbar = () => { // handleShowSidebar prop is no longer needed here
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // State for Offcanvas visibility
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  // Handlers for Offcanvas
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const handleThemeToggle = () => {
    toggleTheme();
    // Removed alert() as per instructions
  };

  // Define menu items for the Offcanvas
  const offcanvasMenuItems = [
    { name: texts.nav?.home || 'Home', icon: <Home size={20} />, path: '/' },
    { name: texts.nav?.courses || 'Courses', icon: <GraduationCap size={20} />, path: '/courses' },
    { name: texts.nav?.instructors || 'Instructors', icon: <Users size={20} />, path: '/instructors' },
    { name: texts.nav?.teacherDashboard || 'Teacher Dashboard', icon: <FontAwesomeIcon icon={faChalkboardTeacher} />, path: '/teacher/dashboard' },
    { name: 'Profile', icon: <UserCircle2 size={20} />, path: '/profile' },
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/teacher/dashboard' },
    { name: 'Quizzes', icon: <FileText size={20} />, path: '/quizzes' },
    { name: 'Submissions', icon: <FileText size={20} />, path: '/submissions' },

  ];

  return (
    <>
      <Navbar expand="lg" className={`shadow-sm py-3 learnhub-navbar navbar-${theme} bg-${theme}`}>
        <Container>
          {/* Sidebar Toggle Button - now directly controls Offcanvas */}
          <Button
            variant="link"
            onClick={handleShowOffcanvas} // Calls handleShowOffcanvas
            className="me-3 p-0" // Hidden on large screens
            aria-label="Toggle sidebar"
          >
            <FontAwesomeIcon icon={faBars} size="lg" className="theme-icon" />
          </Button>

          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold fs-4"
          >
            {texts.appTitle}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {/* Desktop Nav links */}
              <Nav.Link
                as={Link}
                to="/"
                className={`mx-2 ${location.pathname === '/' ? 'fw-bold active' : ''}`}
              >
                {texts.nav?.home}
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/courses"
                className={`mx-2 ${location.pathname.startsWith('/courses') ? 'fw-bold active' : ''}`}
              >
                {texts.nav?.courses}
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/instructors"
                className={`mx-2 ${location.pathname === '/instructors' ? 'fw-bold active' : ''}`}
              >
                {texts.nav?.instructors}
              </Nav.Link>
              {/* Teacher Dashboard Link */}
              <Nav.Link
                as={Link}
                to="/teacher/dashboard"
                className={`mx-2 ${location.pathname.startsWith('/teacher/dashboard') ? 'fw-bold active' : ''}`}
              >
                <FontAwesomeIcon icon={faChalkboardTeacher} className="me-1" /> 
                {texts.nav?.teacherDashboard}
              </Nav.Link>

              <Nav.Link as={Link} to="/about" className="mx-2">{texts.nav?.aboutUs}</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="mx-2">{texts.nav?.contact}</Nav.Link>

              <Nav.Link as={Link} to="/login" className="mx-2">{texts.nav?.logIn}</Nav.Link>
              <Nav.Link as={Link} to="/register" className="mx-2 border rounded px-3">{texts.nav?.signUp}</Nav.Link>
              
              <Button
                variant="link"
                onClick={handleThemeToggle}
                className="ms-3 theme-toggle-btn p-0"
                aria-label="Toggle theme"
              >
                <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} size="lg" className="theme-icon" />
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Offcanvas Component */}
      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Nav className="flex-column">
            {offcanvasMenuItems.map((item, idx) => (
              <Nav.Link
                key={idx}
                as={Link}
                to={item.path}
                className={`d-flex align-items-center px-3 py-2 my-1 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 rounded-md ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'fw-bold active-offcanvas-link' : ''}`}
                onClick={handleCloseOffcanvas}
              >
                <span className="me-3">{item.icon}</span> {/* Icon with margin */}
                {item.name}
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AppNavbar;