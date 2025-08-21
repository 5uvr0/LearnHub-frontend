import React from "react";
import { Card, Badge } from 'react-bootstrap';
import CustomButton from '../../common/CustomButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faIdCard, faCheckCircle, faTimesCircle, faClock, faCalendarAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const getUserTypeInfo = (user) => {
    let icon = faUser;
    let typeLabel = "User";
    let variant = "primary";

    if (user?.role) {
        switch (user.role.toLowerCase()) {
            case "admin":
                icon = faIdCard;
                typeLabel = "Admin";
                variant = "danger";
                break;
            case "instructor":
                icon = faUser;
                typeLabel = "Instructor";
                variant = "success";
                break;
            case "student":
                icon = faUser;
                typeLabel = "Student";
                variant = "info";
                break;
            default:
                icon = faUser;
                typeLabel = "User";
                variant = "secondary";
        }
    }
    return { icon, typeLabel, variant };
};

const UserCard = ({ user, onUserUpdate }) => {
    if (!user) {
        return (
            <Card className="shadow-sm border-0 rounded-4 overflow-hidden text-center p-3 mt-2" style={{ minHeight: "180px" }}>
                <Card.Body>
                    <p className="text-muted">User data missing.</p>
                </Card.Body>
            </Card>
        );
    }

    const { icon, typeLabel, variant } = getUserTypeInfo(user);

    const handleUpdateClick = () => {
        onUserUpdate(user.id);
    };

    return (
        <Card className="shadow-sm border-0 rounded-4 mt-2" style={{ minHeight: "220px" }}>
            <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={icon} className={`me-2 text-${variant}`} />
                    <Card.Title className="fw-bold mb-0 text-truncate">{user?.email}</Card.Title>
                    <Badge bg={variant} className="ms-2 text-uppercase">{typeLabel}</Badge>
                </div>
                <Card.Subtitle className="mb-2 text-muted text-xs">
                    User ID: {user?.id || 'N/A'}
                </Card.Subtitle>
                
                <hr className="my-1" />

                <Card.Text className="text-secondary flex-grow-1 text-xs">
                    <div className="d-flex align-items-center mb-1">
                        <FontAwesomeIcon icon={user.enabled ? faCheckCircle : faTimesCircle} className={`me-2 text-${user.enabled ? 'success' : 'danger'}`} />
                        <strong>Status:</strong> <span className={`ms-1 text-${user.enabled ? 'success' : 'danger'}`}>{user.enabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="d-flex align-items-center mb-1">
                        <FontAwesomeIcon icon={faTrashAlt} className="me-2 text-dark" />
                        <strong>Deleted:</strong> <span className="ms-1">{user?.deleted ? "Yes" : "No"}</span>
                    </div>
                    <div className="d-flex align-items-center mb-1">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-muted" />
                        <strong>Joined:</strong> <span className="ms-1">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="d-flex align-items-center mb-1">
                        <FontAwesomeIcon icon={faClock} className="me-2 text-muted" />
                        <strong>Last Updated:</strong> <span className="ms-1">{new Date(user.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faEdit} className="me-2 text-muted" />
                        <strong>Version:</strong> <span className="ms-1">{user?.version}</span>
                    </div>
                </Card.Text>

                <div className="d-flex justify-content-end align-items-center mt-auto">
                    <CustomButton
                        variant="outline-primary"
                        size="sm"
                        icon={faEdit}
                        onClick={handleUpdateClick}
                    >
                        Update Info
                    </CustomButton>
                </div>
            </Card.Body>
        </Card>
    );
};

export default UserCard;