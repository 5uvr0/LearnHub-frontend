// src/components/layout/AppNavbar.jsx

import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faBars, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import CustomButton from '../common/CustomButton';
import { useTheme } from '../../hooks/useTheme';
import texts from '../../i18n/texts';

const AppNavbar = ({ handleShowSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const handleThemeToggle = () => {
    toggleTheme();
    alert(texts.alerts?.themeChangedTo?.(theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Navbar expand="lg" className={`shadow-sm py-3 learnhub-navbar navbar-${theme} bg-${theme}`}>
      <Container>
        {/* Sidebar Toggle Button */}
        <Button
          variant="link"
          onClick={handleShowSidebar}
          className="me-3 d-lg-none p-0"
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
            {/* Nav links using Link component and active state from useLocation */}
            <Nav.Link
              as={Link}
              to="/"
              className={`d-none d-lg-block mx-2 ${location.pathname === '/' ? 'fw-bold active' : ''}`}
            >
              {texts.nav?.home}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/courses"
              className={`d-none d-lg-block mx-2 ${location.pathname.startsWith('/courses') ? 'fw-bold active' : ''}`}
            >
              {texts.nav?.courses}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/instructors"
              className={`d-none d-lg-block mx-2 ${location.pathname === '/instructors' ? 'fw-bold active' : ''}`}
            >
              {texts.nav?.instructors}
            </Nav.Link>
            {/* Teacher Dashboard Link */}
            <Nav.Link
              as={Link}
              to="/teacher/dashboard"
              className={`d-none d-lg-block mx-2 ${location.pathname.startsWith('/teacher/dashboard') ? 'fw-bold active' : ''}`}
            >
              <FontAwesomeIcon icon={faChalkboardTeacher} className="me-1" /> {texts.nav?.teacherDashboard}
            </Nav.Link>

            {/* Placeholder links for About and Contact - adjust as needed for actual pages */}
            <Nav.Link as={Link} to="/about" className="d-none d-lg-block mx-2">{texts.nav?.aboutUs}</Nav.Link>
            <Nav.Link as={Link} to="/contact" className="d-none d-lg-block mx-2">{texts.nav?.contact}</Nav.Link>

            <CustomButton variant="primary" className="ms-3">{texts.nav?.signUp}</CustomButton>
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
  );
};

export default AppNavbar;