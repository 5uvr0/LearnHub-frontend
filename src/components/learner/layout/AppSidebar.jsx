// src/components/layout/AppSidebar.jsx

import React from 'react';
import { Offcanvas, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import texts from '../../../i18n/texts.js';
import { useTheme } from '../../../course-hooks/useTheme.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';


const AppSidebar = ({ show, handleClose }) => {
    const { theme } = useTheme();

    return (
        <Offcanvas show={show} onHide={handleClose} placement="start"
            className={`bg-${theme} text-${theme === 'light' ? 'dark' : 'white'} sidebar-offcanvas`}>
            <Offcanvas.Header closeButton closeVariant={theme === 'dark' ? 'white' : undefined}>
                <Offcanvas.Title className="fw-bold">{texts.sidebar?.title}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Nav className="flex-column">
                    <Nav.Link as={Link} to="/" onClick={handleClose}>
                        {texts.nav?.home}
                    </Nav.Link>
                    <Nav.Link as={Link} to="/courses" onClick={handleClose}>
                        {texts.nav?.courses}
                    </Nav.Link>
                    <Nav.Link as={Link} to="/instructors" onClick={handleClose}>
                        {texts.nav?.instructors}
                    </Nav.Link>
                    {/* Teacher Dashboard Link in Sidebar */}
                    <Nav.Link as={Link} to="/teacher/dashboard" onClick={handleClose}>
                        <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" /> {texts.nav?.teacherDashboard}
                    </Nav.Link>
                    {/* Placeholder links for About and Contact */}
                    <Nav.Link as={Link} to="/about" onClick={handleClose}>
                        {texts.nav?.aboutUs}
                    </Nav.Link>
                    <Nav.Link as={Link} to="/contact" onClick={handleClose}>
                        {texts.nav?.contact}
                    </Nav.Link>
                </Nav>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default AppSidebar;