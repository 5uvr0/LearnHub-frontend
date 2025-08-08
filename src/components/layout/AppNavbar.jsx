// src/components/layout/AppNavbar.jsx

import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faBars } from '@fortawesome/free-solid-svg-icons'; // Import faBars
import CustomButton from '../common/CustomButton';
import { useTheme } from '../../hooks/UseTheme';
import texts from '../../i18n/texts';

const AppNavbar = ({ currentPage, setCurrentPage, handleShowSidebar }) => { // Add handleShowSidebar prop
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = () => {
    toggleTheme();
    alert(texts.alerts.themeChangedTo(theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Navbar expand="lg" className={`shadow-sm py-3 learnhub-navbar navbar-${theme} bg-${theme}`}>
      <Container>
        {/* Sidebar Toggle Button */}
        <Button
          variant="link"
          onClick={handleShowSidebar} // Use the prop here
          className="me-3 d-lg-none p-0" // Show only on small screens, hide on large
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon icon={faBars} size="lg" className="theme-icon" />
        </Button>

        <Navbar.Brand
          href="#home"
          className="fw-bold fs-4"
          onClick={() => setCurrentPage('home')}
        >
          {texts.appTitle}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* These links will be visible on larger screens, duplicated in sidebar for small screens */}
            <Nav.Link
              href="#home"
              onClick={() => setCurrentPage('home')}
              className={`d-none d-lg-block mx-2 ${currentPage === 'home' ? 'fw-bold active' : ''}`}
            >
              {texts.nav.home}
            </Nav.Link>
            <Nav.Link
              href="#courses"
              onClick={() => setCurrentPage('courses')}
              className={`d-none d-lg-block mx-2 ${currentPage === 'courses' ? 'fw-bold active' : ''}`}
            >
              {texts.nav.courses}
            </Nav.Link>
            <Nav.Link
              href="#instructors"
              onClick={() => setCurrentPage('instructors')}
              className={`d-none d-lg-block mx-2 ${currentPage === 'instructors' ? 'fw-bold active' : ''}`}
            >
              {texts.nav.instructors}
            </Nav.Link>
            <Nav.Link href="#about" className="d-none d-lg-block mx-2">{texts.nav.aboutUs}</Nav.Link>
            <Nav.Link href="#contact" className="d-none d-lg-block mx-2">{texts.nav.contact}</Nav.Link>

            <CustomButton variant="primary" className="ms-3">{texts.nav.signUp}</CustomButton>
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