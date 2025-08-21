// src/components/layout/AppNavbar.jsx

import React, { useState, useMemo } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faBars, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../../course-hooks/useTheme.js';
import texts from '../../../i18n/texts.js';
import { Home, BookOpen, Users, Settings, LogOut, LayoutDashboard, UserCircle2, GraduationCap, FileText, Info, Mail } from 'lucide-react';
import Cookies from 'js-cookie';

const AppNavbar = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const handleCloseOffcanvas = () => setShowOffcanvas(false);
    const handleShowOffcanvas = () => setShowOffcanvas(true);

    const handleThemeToggle = () => toggleTheme();

    const isLoggedIn = Cookies.get('accessToken') !== undefined;
    const userRole = localStorage.getItem('role');

    // Define menu items for each role
    const commonMenuItems = useMemo(() => ([
        { name: texts.nav?.home || 'Home', icon: <Home size={20} />, path: '/' },
        { name: texts.nav?.courses || 'Courses', icon: <GraduationCap size={20} />, path: '/courses' },
        { name: texts.nav?.instructors || 'Instructors', icon: <Users size={20} />, path: '/instructors' },
        { name: texts.nav?.aboutUs || 'About Us', icon: <Info size={20} />, path: '/about' },
        { name: texts.nav?.contact || 'Contact', icon: <Mail size={20} />, path: '/contact' },
    ]), []);

    const studentSpecificMenuItems = useMemo(() => ([
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/student/dashboard' },
        { name: 'Profile', icon: <UserCircle2 size={20} />, path: '/student/profile' },
        // Add more student-specific routes here
    ]), []);

    const instructorSpecificMenuItems = useMemo(() => ([
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/teacher/dashboard' },
        { name: 'Profile', icon: <UserCircle2 size={20} />, path: '/instructor/profile' },
        // Add more instructor-specific routes here
    ]), []);

    // Combine menu items based on the user's role
    const menuItems = useMemo(() => {
        let items = [...commonMenuItems];
        if (isLoggedIn) {
            if (userRole === 'INSTRUCTOR') {
                items = [...items, ...instructorSpecificMenuItems];
            } else if (userRole === 'STUDENT') {
                items = [...items, ...studentSpecificMenuItems];
            } else if (userRole === 'ADMIN') {
                // Admins can see everything for now
                items = [...items, ...instructorSpecificMenuItems, ...studentSpecificMenuItems];
            }
        }
        return items;
    }, [isLoggedIn, userRole, commonMenuItems, studentSpecificMenuItems, instructorSpecificMenuItems]);


    return (
        <>
            <Navbar expand="lg" className={`shadow-sm py-3 learnhub-navbar navbar-${theme} bg-${theme}`}>
                <Container>
                    <Button
                        variant="link"
                        onClick={handleShowOffcanvas}
                        className="me-3 p-0"
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
                            {/* Desktop Nav links based on role */}
                            {menuItems.map((item, idx) => (
                                <Nav.Link
                                    key={idx}
                                    as={Link}
                                    to={item.path}
                                    className={`mx-2 ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'fw-bold active' : ''}`}
                                >
                                    {item.name}
                                </Nav.Link>
                            ))}
                            {/* Conditional Login/Logout/Register buttons */}
                            {
                                isLoggedIn ? (
                                    <Nav.Link as={Link} to="/logout" className="mx-2 border rounded px-3">
                                        {texts.nav?.logout || 'Logout'}
                                    </Nav.Link>
                                ) : (
                                    <>
                                        <Nav.Link as={Link} to="/login" className="mx-2">
                                            {texts.nav?.logIn}
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/register" className="mx-2 border rounded px-3">
                                            {texts.nav?.signUp}
                                        </Nav.Link>
                                    </>
                                )
                            }
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
                        {menuItems.map((item, idx) => (
                            <Nav.Link
                                key={idx}
                                as={Link}
                                to={item.path}
                                className={`d-flex align-items-center px-3 py-2 my-1 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 rounded-md ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'fw-bold active-offcanvas-link' : ''}`}
                                onClick={handleCloseOffcanvas}
                            >
                                <span className="me-3">{item.icon}</span>
                                {item.name}
                            </Nav.Link>
                        ))}
                        {isLoggedIn && (
                            <Nav.Link as={Link} to="/logout" className="d-flex align-items-center px-3 py-2 my-1 text-gray-700" onClick={handleCloseOffcanvas}>
                                <span className="me-3"><LogOut size={20} /></span>
                                {texts.nav?.logout || 'Logout'}
                            </Nav.Link>
                        )}
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default AppNavbar;