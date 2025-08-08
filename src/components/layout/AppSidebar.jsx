// src/components/layout/AppSidebar.jsx

import React from 'react';
import { Offcanvas, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link
import texts from '../../i18n/texts';
import { useTheme } from '../../hooks/UseTheme';

const AppSidebar = ({ show, handleClose }) => { // Removed setCurrentPage prop
    const { theme } = useTheme();

    return (
        <Offcanvas show={show} onHide={handleClose} placement="start"
            className={`bg-${theme} text-${theme === 'light' ? 'dark' : 'white'} sidebar-offcanvas`}>
            <Offcanvas.Header closeButton closeVariant={theme === 'dark' ? 'white' : undefined}>
                <Offcanvas.Title className="fw-bold">{texts.sidebar.title}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Nav className="flex-column">
                    <Nav.Link as={Link} to="/" onClick={handleClose}> {/* Link to home, close sidebar */}
                        {texts.nav.home}
                    </Nav.Link>
                    <Nav.Link as={Link} to="/courses" onClick={handleClose}> {/* Link to courses, close sidebar */}
                        {texts.nav.courses}
                    </Nav.Link>
                    <Nav.Link as={Link} to="/instructors" onClick={handleClose}> {/* Link to instructors, close sidebar */}
                        {texts.nav.instructors}
                    </Nav.Link>
                    {/* Placeholder links for About and Contact */}
                    <Nav.Link as={Link} to="/about" onClick={handleClose}>
                        {texts.nav.aboutUs}
                    </Nav.Link>
                    <Nav.Link as={Link} to="/contact" onClick={handleClose}>
                        {texts.nav.contact}
                    </Nav.Link>
                </Nav>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default AppSidebar;