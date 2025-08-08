// src/components/layout/AppSidebar.jsx

import React from 'react';
import { Offcanvas, Nav } from 'react-bootstrap';
import texts from '../../i18n/texts';
import { useTheme } from '../../hooks/UseTheme';

const AppSidebar = ({ show, handleClose, setCurrentPage }) => {
    const { theme } = useTheme();

    const handleNavLinkClick = (page) => {
        setCurrentPage(page);
        handleClose(); // Close sidebar after navigation
    };

    return (
        <Offcanvas show={show} onHide={handleClose} placement="start"
            className={`bg-${theme} text-${theme === 'light' ? 'dark' : 'white'} sidebar-offcanvas`}>
            <Offcanvas.Header closeButton closeVariant={theme === 'dark' ? 'white' : undefined}>
                <Offcanvas.Title className="fw-bold">{texts.sidebar.title}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Nav className="flex-column">
                    <Nav.Link onClick={() => handleNavLinkClick('home')}>
                        {texts.nav.home}
                    </Nav.Link>
                    <Nav.Link onClick={() => handleNavLinkClick('courses')}>
                        {texts.nav.courses}
                    </Nav.Link>
                    <Nav.Link onClick={() => handleNavLinkClick('instructors')}>
                        {texts.nav.instructors}
                    </Nav.Link>
                    <Nav.Link onClick={() => handleNavLinkClick('about')}>
                        {texts.nav.aboutUs}
                    </Nav.Link>
                    <Nav.Link onClick={() => handleNavLinkClick('contact')}>
                        {texts.nav.contact}
                    </Nav.Link>
                </Nav>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default AppSidebar;