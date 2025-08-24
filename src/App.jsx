// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import AppNavbar from './components/course/layout/AppNavbar';
import AppFooter from './components/course/layout/AppFooter';
import AppSidebar from './components/course/layout/AppSidebar';
import HomePage from './common-pages/HomePage';
import CoursesPage from './course-pages/CoursesPage';
import InstructorsPage from './course-pages/InstructorsPage';
import StudentCourseDetailsPage from './course-pages/StudentCourseDetailsPage';
import TeacherDashboardPage from './course-pages/TeacherDashboardPage';
import CourseConfiguratorPage from './course-pages/CourseConfiguratorPage';
import TeacherCourseDetailsPage from './course-pages/TeacherCourseDetailsPage';
import CoursePublicView from './course-pages/CoursePublicView';
import ContentVersionsPage from './course-pages/ContentVersionsPage';
import QuizConfiguratorPage from './course-pages/QuizConfiguratorPage';
import InstructorDetailsPage from './course-pages/InstructorPublicViewPage';
import InstructorPublicViewPage from './course-pages/InstructorPublicViewPage';
import CourseVersionComparisonPage from './course-pages/CourseVersionComparisonPage';
import LectureDetailsPage from './course-pages/LectureDetailsPage';
import SubmissionDetailsPage from './course-pages/SubmissionDetailsPage';
import LoginPage from './auth-pages/LoginPage.jsx';
import AdminDashboardPage from './auth-pages/AdminDashboard.jsx';
import UserManagementPage from './auth-pages/UserManagementPage';
import InstructorProfilePage from './course-pages/InstructorProfilePage';
import SubmittedFilesPage from "./course-pages/SubmittedFiles.jsx";
import RegistrationPage from "./auth-pages/RegistrationPage.jsx";
import Logout from "./auth-pages/Logout.jsx";
import LoginErrorPage from './ErrorPages/LoginErrorPage.jsx';
import EmailVerificationPage from './auth-pages/EmailVerificationPage.jsx';

import StudentDashboard from './learner-pages/student/Dashboard.jsx';
import StudentCourseDetailPage from "./learner-pages/student/enrolledCourses/CourseDetail.jsx";

import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';
import StudentProfilePage from "./learner-pages/student/Profile.jsx";
import EditStudentPage from "./learner-pages/student/Edit.jsx";
import ContentDetailPage from "./learner-pages/student/enrolledCourses/content/ContentDetail.jsx";

import LecturePage from "./learner-pages/student/enrolledCourses/content/Lecture.jsx";
import QuizPage from "./learner-pages/student/enrolledCourses/content/Quiz.jsx";
import SubmissionPage from "./learner-pages/student/enrolledCourses/content/Submission.jsx";
import StudentContentPage from "./learner-pages/student/enrolledCourses/content/ContentDetail.jsx";

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/register',
    '/login/error',
    '/about',
    '/contact',
    '/public-course-view',
    '/public-instructors'
];

// Component to handle protected routes
function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const cookie = Cookies.get("accessToken");
    
    React.useEffect(() => {
        if (!cookie) {
            // Check if current path is a public route
            const isPublicRoute = PUBLIC_ROUTES.some(route => {
                if (route === '/') return location.pathname === '/';
                if (route === '/public-course-view') return location.pathname.startsWith('/public-course-view/');
                if (route === '/public-instructors') return location.pathname.startsWith('/public-instructors/');
                return location.pathname === route;
            });
            
            if (!isPublicRoute) {
                navigate('/login/error');
            }
        }
    }, [cookie, location.pathname, navigate]);
    
    return children;
}

function AppContent() {
    const [showSidebar, setShowSidebar] = useState(false);
    const cookie = Cookies.get("accessToken");

    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);

    return (
        <div className="App d-flex flex-column min-vh-100">
            <AppNavbar handleShowSidebar={handleShowSidebar} />

            {cookie && (
                <AppSidebar
                    show={showSidebar}
                    handleClose={handleCloseSidebar}
                />
            )}

            <main className="flex-grow-1">
                <Routes>
                    {/* Public Routes - No authentication required */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/login/error" element={<LoginErrorPage />} />
                    <Route path="/public-course-view/:id" element={<CoursePublicView />} />
                    <Route path="/public-instructors/:id" element={<InstructorPublicViewPage />} />
                    <Route path="/email-verification" element={<EmailVerificationPage />} />
                    <Route path="/about" element={
                        <div className="py-5 text-center">
                            <h2>About Us</h2>
                            <p>LearnHub is dedicated to providing quality online education.</p>
                        </div>
                    } />
                    <Route path="/contact" element={
                        <div className="py-5 text-center">
                            <h2>Contact Us</h2>
                            <p>Reach out to us at support@learnhub.com</p>
                        </div>
                    } />

                    {/* Protected Routes - Authentication required */}
                    <Route path="/courses" element={
                        <ProtectedRoute>
                            <CoursesPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/courses/:id" element={
                        <ProtectedRoute>
                            <StudentCourseDetailsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/instructors" element={
                        <ProtectedRoute>
                            <InstructorsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/instructors/:id" element={
                        <ProtectedRoute>
                            <InstructorDetailsPage />
                        </ProtectedRoute>
                    } />

                    {/* Profile, edit, delete etc routes */}
                    <Route path="/instructor/profile" element={
                        <ProtectedRoute>
                            <InstructorProfilePage />
                        </ProtectedRoute>
                    } />

                    {/* Teacher Dashboard & Course Management Routes */}
                    <Route path="/teacher/dashboard" element={
                        <ProtectedRoute>
                            <TeacherDashboardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/teacher/courses/new" element={
                        <ProtectedRoute>
                            <CourseConfiguratorPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/teacher/courses/:id/edit" element={
                        <ProtectedRoute>
                            <CourseConfiguratorPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/teacher/courses/:id" element={
                        <ProtectedRoute>
                            <TeacherCourseDetailsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/teacher/courses/:id/compare-versions" element={
                        <ProtectedRoute>
                            <CourseVersionComparisonPage />
                        </ProtectedRoute>
                    } />

                    {/* Content Management Routes */}
                    <Route path="/teacher/contents/:contentId/versions" element={
                        <ProtectedRoute>
                            <ContentVersionsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/teacher/quizzes/:contentId" element={
                        <ProtectedRoute>
                            <QuizConfiguratorPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/teacher/lectures/:releaseId" element={
                        <ProtectedRoute>
                            <LectureDetailsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/teacher/submissions/:releaseId" element={
                        <ProtectedRoute>
                            <SubmissionDetailsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/teacher/submission/attachments/:contentId" element={
                        <ProtectedRoute>
                            <SubmittedFilesPage />
                        </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute>
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/user-management/:userId" element={
                        <ProtectedRoute>
                            <UserManagementPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/logout" element={
                        <ProtectedRoute>
                            <Logout />
                        </ProtectedRoute>
                    } />

                    {/* Student dashboard and profile */}
                    <Route path="/student/dashboard" element={
                        <ProtectedRoute>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/profile" element={
                        <ProtectedRoute>
                            <StudentProfilePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/profile/edit" element={
                        <ProtectedRoute>
                            <EditStudentPage />
                        </ProtectedRoute>
                    } />

                    {/* Student Course Endpoints */}
                    <Route path="/student/course/:courseId" element={
                        <ProtectedRoute>
                            <StudentCourseDetailPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/courses/:courseId/content/:contentId" element={
                        <ProtectedRoute>
                            <StudentContentPage />
                        </ProtectedRoute>
                    } />

                    {/* Student Content Endpoints */}
                    {/*<Route path="/student/content/:contentId/lecture" element={<LecturePage />} />*/}
                    {/*<Route path="/student/content/:contentId/quiz" element={<QuizPage />} />*/}
                    {/*<Route path="/student/content/:contentId/submission" element={<SubmissionPage />} />*/}

                    {/* Student Submission Related Endpoints */}

                    {/* Fallback for unknown routes */}
                    <Route path="*" element={
                        <div className="py-5 text-center">
                            <h2>404 - Page Not Found</h2>
                            <p>Oops! The page you're looking for does not exist.</p>
                        </div>
                    } />
                </Routes>
            </main>
            <AppFooter />
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <Router basename="/learnhub">
                <AppContent />
            </Router>
        </ThemeProvider>
    );
}

export default App;