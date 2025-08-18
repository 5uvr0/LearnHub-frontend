// src/App.jsx
import React, {useState} from 'react';

import AppFooter from './components/course/layout/AppFooter.jsx';
import HomePage from './components/common-pages/HomePage.jsx';
import AppNavbar from './components/course/layout/AppNavbar.jsx';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './auth-pages/LoginPage.jsx';
import RegistrationPage from "./auth-pages/RegistrationPage.jsx";
import {ThemeProvider} from './contexts/ThemeContext';
import './index.css';

function App() {
    const [showSidebar, setShowSidebar] = useState(false);

    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);

    return (
        <ThemeProvider>
            <Router>
                <div className="App d-flex flex-column min-vh-100">
                    <AppNavbar handleShowSidebar={handleShowSidebar}/>

                    <main className="flex-grow-1">
                        <Routes>
                            <Route path="/home" element={<HomePage/>}/>

                            {/* User Registration & Login Routes */}
                            <Route path="/register" element={<RegistrationPage/>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            {/*<Route path="/login/error" element={<LoginErrorPage/>}/>*/}

                            {/* Add more routes for About, Contact, etc. */}
                            <Route path="/about" element={
                                <div className="py-5 text-center">
                                    <h2>About Us</h2>
                                    <p>LearnHub is dedicated to providing quality online education.</p>
                                </div>
                            }/>
                            <Route path="/contact" element={
                                <div className="py-5 text-center">
                                    <h2>Contact Us</h2>
                                    <p>Reach out to us at support@learnhub.com</p>
                                </div>
                            }/>

                            {/* Fallback for unknown routes */}
                            <Route path="*" element={
                                <div className="py-5 text-center">
                                    <h2>404 - Page Not Found</h2>
                                    <p>Oops! The page you're looking for does not exist.</p>
                                </div>
                            }/>
                        </Routes>
                    </main>
                    <AppFooter/>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;