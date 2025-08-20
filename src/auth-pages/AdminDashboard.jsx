import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthApi from "../auth-hooks/useAuthApi";
import UserCard from "../components/auth/cards/UserCard";
import CustomButton from '../components/common/CustomButton';
import { Card, Badge, Form, FormControl, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faUsers, faUserTie } from '@fortawesome/free-solid-svg-icons';

const AdminDashboardPage = () => {
    const { data: users, loading, error, fetchData } = useAuthApi();
    const [showStats, setShowStats] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 9;

    useEffect(() => {
        fetchData("/admin/users");
    }, [fetchData]);

    const handleUserUpdate = (userId) => {
        navigate(`/admin/user-management/${userId}`);
    };

    const handleToggleStats = () => {
        setShowStats(!showStats);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        setCurrentPage(1);
    };
    
    // Updated function to handle page changes and scroll to top
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredUsers = users?.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        if (sortOrder === 'newest') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    }) || [];
    
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const adminInfo = users?.find(user => user.role === "ADMIN");
    const registeredUsers = users ? users.length : 0;
    const enabledAccounts = users ? users.filter(user => user.enabled).length : 0;
    const disabledAccounts = users ? users.filter(user => !user.enabled).length : 0;
    const deletedAccounts = users ? users.filter(user => user.deleted).length : 0;

    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div>Error loading data: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            {/* Admin Information Card */}
            {adminInfo && (
                <div className="bg-light shadow-sm rounded-lg p-4 mb-4">
                    <h2 className="text-xl font-bold mb-2">My Profile</h2>
                    <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faUserTie} size="2x" className="text-primary me-3" />
                        <div>
                            <p className="mb-0"><strong>Email:</strong> {adminInfo.email}</p>
                            <p className="mb-0"><strong>Role:</strong> <Badge bg="danger">{adminInfo.role}</Badge></p>
                            <p className="mb-0"><strong>Status:</strong> {adminInfo.enabled ? 'Enabled' : 'Disabled'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Dashboard Actions */}
            <div className="d-flex flex-column flex-md-row justify-content-start align-items-center g-3 mb-4">
                <CustomButton 
                    variant="info" 
                    icon={faChartBar}
                    onClick={handleToggleStats}
                    className="me-md-3 mb-2 mb-md-0"
                >
                    {showStats ? "Hide Site Statistics" : "Show Site Statistics"}
                </CustomButton>
            </div>

            {/* Site Statistics Section */}
            {showStats && (
                <div className="bg-light shadow-sm rounded-lg p-4 mt-4">
                    <h2 className="text-xl font-bold mb-3">Site Statistics</h2>
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <Card className="text-center p-3">
                                <h5>Registered Users</h5>
                                <p className="fs-3 fw-bold">{registeredUsers}</p>
                            </Card>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Card className="text-center p-3">
                                <h5>Active Accounts</h5>
                                <p className="fs-3 fw-bold">{enabledAccounts}</p>
                            </Card>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Card className="text-center p-3">
                                <h5>Disabled Accounts</h5>
                                <p className="fs-3 fw-bold">{disabledAccounts}</p>
                            </Card>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Card className="text-center p-3">
                                <h5>Deleted Accounts</h5>
                                <p className="fs-3 fw-bold">{deletedAccounts}</p>
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            <hr className="my-4" />

            {/* User Management Section */}
            <h2 className="text-xl font-bold mb-3">Manage Users</h2>
            
            {/* Filter and Sort Controls */}
            <div className="d-flex flex-column flex-md-row align-items-center mb-4">
                <Form.Group className="me-md-3 mb-2 mb-md-0 w-100">
                    <FormControl
                        type="text"
                        placeholder="Filter by email..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Form.Group>
                
                <Form.Group className="w-100">
                    <Form.Select onChange={handleSortChange} value={sortOrder}>
                        <option value="newest">Sort by: Newest First</option>
                        <option value="oldest">Sort by: Oldest First</option>
                    </Form.Select>
                </Form.Group>
            </div>

            {/* User Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                        <UserCard 
                            key={user.id} 
                            user={user} 
                            onUserUpdate={handleUserUpdate} 
                        />
                    ))
                ) : (
                    <div>No users found matching your criteria.</div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Pagination.Item 
                                key={page} 
                                active={page === currentPage} 
                                onClick={() => paginate(page)}
                            >
                                {page}
                            </Pagination.Item>
                        ))}
                        
                        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;