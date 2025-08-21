import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthApi from "../auth-hooks/useAuthApi";
import { Card, Badge } from 'react-bootstrap';
import CustomButton from "../components/common/CustomButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faIdCard, faCheckCircle, faTimesCircle, faClock, faCalendarAlt, faTrashAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

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


const UserManagementPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { data: user, loading, error, fetchData } = useAuthApi();
    const { data: deleteResponse, loading: deleting, error: deleteError, fetchData: deleteUser } = useAuthApi();
    const { data: toggleResponse, loading: toggling, error: toggleError, fetchData: toggleUserStatus } = useAuthApi();
    const { data: logoutResponse, loading: loggingOut, error: logoutError, fetchData: forceLogout } = useAuthApi();

    useEffect(() => {
        if (userId) {
            fetchData(`/admin/user/${userId}`);
        }
    }, [userId, fetchData]);

    useEffect(() => {
        if (deleteResponse) {
            alert("User deleted successfully!");
            navigate("/admin/dashboard");
        }
    }, [deleteResponse, navigate]);

    useEffect(() => {
        if (toggleResponse) {
            fetchData(`/admin/user/${userId}`);
            alert("User status updated successfully!");
        }
    }, [toggleResponse, userId, fetchData]);

    useEffect(() => {
        if (logoutResponse) {
            alert("User has been force-logged out.");
        }
    }, [logoutResponse]);

    const handleToggleStatus = async () => {
        if (user) {
            await toggleUserStatus(`/admin/user/${user.id}/toggle-status`, { method: "PUT" });
        }
    };

    const handleForceLogout = async () => {
        if (window.confirm("Are you sure you want to force-logout this user?")) {
            await forceLogout("/admin/logout-force", { 
                method: "POST", 
                data: { userId: user.id } 
            });
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this user? This action is permanent.")) {
            await deleteUser(`/admin/delete-user/${user.id}`, { method: "DELETE" });
        }
    };

    if (loading) return <div className="text-center mt-5">Loading user details...</div>;
    if (error) return <div className="text-center mt-5 text-danger">Error: {error}</div>;
    if (!user) return <div className="text-center mt-5 text-muted">User not found.</div>;

    const { icon, typeLabel, variant } = getUserTypeInfo(user);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Manage User</h1>
            <Card className="shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
                <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-3 border-bottom pb-3">
                        <FontAwesomeIcon icon={icon} className={`me-3 text-${variant}`} size="2x" />
                        <div>
                            <Card.Title className="fw-bold mb-0 text-truncate">{user?.email}</Card.Title>
                            <Card.Subtitle className="text-muted text-sm mt-1">User ID: {user?.id || 'N/A'}</Card.Subtitle>
                        </div>
                        <Badge bg={variant} className="ms-auto text-uppercase">{typeLabel}</Badge>
                    </div>

                    <div className="row g-2 text-secondary text-sm">
                        <div className="col-md-6 d-flex align-items-center">
                            <FontAwesomeIcon icon={user.enabled ? faCheckCircle : faTimesCircle} className={`me-2 text-${user.enabled ? 'success' : 'danger'}`} />
                            <strong>Status:</strong> <span className="ms-1">{user.enabled ? 'Enabled' : 'Disabled'}</span>
                        </div>
                        <div className="col-md-6 d-flex align-items-center">
                            <FontAwesomeIcon icon={faTrashAlt} className="me-2 text-dark" />
                            <strong>Deleted:</strong> <span className="ms-1">{user?.deleted ? "Yes" : "No"}</span>
                        </div>
                        <div className="col-md-6 d-flex align-items-center">
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-muted" />
                            <strong>Joined:</strong> <span className="ms-1">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="col-md-6 d-flex align-items-center">
                            <FontAwesomeIcon icon={faClock} className="me-2 text-muted" />
                            <strong>Last Updated:</strong> <span className="ms-1">{new Date(user.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="col-md-12 d-flex align-items-center">
                            <FontAwesomeIcon icon={faEdit} className="me-2 text-muted" />
                            <strong>Version:</strong> <span className="ms-1">{user?.version}</span>
                        </div>
                    </div>
                </Card.Body>

                <div className="mt-4 pt-3 border-top d-flex flex-column flex-md-row justify-content-between align-items-center g-3">
                    <CustomButton
                        onClick={handleToggleStatus}
                        disabled={toggling}
                        variant={user.enabled ? "outline-warning" : "outline-success"}
                        icon={user.enabled ? faTimesCircle : faCheckCircle}
                        size="sm" 
                    >
                        {toggling ? "Processing..." : (user.enabled ? "Disable" : "Enable")}
                    </CustomButton>
                    <CustomButton
                        onClick={handleForceLogout}
                        disabled={loggingOut}
                        variant="outline-info"
                        icon={faSignOutAlt}
                        size="sm"
                    >
                        {loggingOut ? "Processing..." : "Force Logout"}
                    </CustomButton>
                    <CustomButton
                        onClick={handleDelete}
                        disabled={deleting}
                        variant="outline-danger"
                        icon={faTrashAlt}
                        size="sm"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </CustomButton>
                </div>

                <div className="mt-3 text-center">
                    {toggleError && <div className="text-danger">Error updating user status: {toggleError}</div>}
                    {logoutError && <div className="text-danger">Error force-logging out user: {logoutError}</div>}
                    {deleteError && <div className="text-danger">Error deleting user: {deleteError}</div>}
                </div>
            </Card>
        </div>
    );
};

export default UserManagementPage;