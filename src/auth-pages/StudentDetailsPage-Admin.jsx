import React, { useEffect, useState } from 'react';
import { Spinner, Alert, Row, Col, Pagination, Form, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSort } from '@fortawesome/free-solid-svg-icons'; // Removed faFilter, faUserCheck, faUserTimes
import useLearningApi from '../auth-hooks/useLearningApi';
import StudentCard from '../components/auth/cards/StudentCard';

const StudentDetailsPage = () => {
    const { data: students, loading, error, fetchData } = useLearningApi();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest' for createdAt
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 9;

    useEffect(() => {
        fetchData('/students');
    }, [fetchData]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };
    
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // Updated filtering and sorting logic
    const sortedAndFilteredStudents = students?.filter(student => {
        // Only filter by search term, removed status filter
        return student.email.toLowerCase().includes(searchTerm.toLowerCase());
    }).sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        if (sortOrder === 'newest') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    }) || [];

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = sortedAndFilteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(sortedAndFilteredStudents.length / studentsPerPage);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /><div className="mt-2">Loading students...</div></div>;

    if (error) {
        let apiError;
        try {
            apiError = JSON.parse(error);
        } catch (e) {
            apiError = { message: 'An unknown error occurred.', error: error };
        }
        return (
            <div className="container p-4">
                <Alert variant="danger" className="text-center">
                    <h4>Error!</h4>
                    <p>{apiError.message}</p>
                    <hr />
                    <p className="mb-0">{apiError.error}</p>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Enrolled Students</h1>
            <p className="text-muted mb-4">A detailed list of all enrolled students in the system.</p>

            {/* Filter and Sort Controls */}
            <div className="d-flex flex-column flex-md-row align-items-center mb-4 gap-2">
                <Form.Group className="w-100">
                    <div className="input-group">
                        <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
                        <FormControl
                            type="text"
                            placeholder="Search by email..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </Form.Group>
                {/* The filter buttons are completely removed */}
            </div>

            {/* Student Cards Grid */}
            <Row xs={1} md={2} lg={3} className="g-4">
                {currentStudents.length > 0 ? (
                    currentStudents.map(student => (
                        <Col key={student.id}>
                            <StudentCard student={student} />
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Alert variant="info" className="text-center">No students found matching your criteria.</Alert>
                    </Col>
                )}
            </Row>

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

export default StudentDetailsPage;