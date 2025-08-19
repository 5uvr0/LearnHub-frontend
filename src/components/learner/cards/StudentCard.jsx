import React from 'react';
import { Card } from 'react-bootstrap';
import CustomButton from '../common/CustomButton.jsx';
import { getRandomModerateColor } from '../../../utils/colorUtils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // student icon

// Helper function to get initials from a full name
const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '';
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

const StudentCard = ({ student, onDashboard, onCourses, onEdit }) => {
    if (!student) {
        return (
            <Card className="h-100 shadow-sm border-0 text-center p-3">
                <Card.Body>
                    <p className="text-muted">Student data missing.</p>
                </Card.Body>
            </Card>
        );
    }

    const initials = getInitials(student.firstName, student.lastName);
    const backgroundColor = getRandomModerateColor();
    const borderColor = getRandomModerateColor();

    return (
        <Card className="shadow-sm border-0 rounded-lg h-100 w-100 d-flex flex-column">
            <Card.Body className="d-flex flex-column align-items-center text-center p-4">

                {/* Profile Avatar */}
                <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white font-bold text-2xl mb-3"
                    style={{
                        width: '200px',
                        height: '200px',
                        backgroundColor: backgroundColor,
                        border: `3px solid ${borderColor}`,
                    }}
                >
                    {student.imageUrl ? (
                        <img
                            src={student.imageUrl}
                            alt="Student Avatar"
                            className="rounded-circle"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <FontAwesomeIcon icon={faUser} size="5x" />
                    )}
                </div>

                {/* Student Info */}
                <Card.Title className="fw-bold mb-2 text-xl">
                    {student.firstName} {student.lastName}
                </Card.Title>
                <Card.Text className="text-muted mb-1">{student.email}</Card.Text>
                <Card.Text className="text-muted mb-1">{student.phone}</Card.Text>
                <Card.Text className="text-muted mb-1">{student.gender}</Card.Text>
                <Card.Text className="text-muted mb-1">{student.dateOfBirth}</Card.Text>
                <Card.Text className="text-muted mb-3">{student.address}</Card.Text>

                {/* Buttons */}
                <div className="d-flex flex-column w-100 gap-2 mt-auto">
                    <CustomButton variant="primary" onClick={onDashboard}>
                        Go to Dashboard
                    </CustomButton>
                    <CustomButton variant="success" onClick={onCourses}>
                        Enrolled Courses
                    </CustomButton>
                    <CustomButton variant="warning" onClick={onEdit}>
                        Edit Profile
                    </CustomButton>
                </div>
            </Card.Body>
        </Card>
    );
};

export default StudentCard;
