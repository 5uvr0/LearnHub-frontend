import React, { useEffect, useState } from 'react';
import { Spinner, Alert, Row, Col, Pagination, Form, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSort, faUserTie } from '@fortawesome/free-solid-svg-icons';
import useCourseApi from '../auth-hooks/useCourseApi';
import InstructorCard from '../components/auth/cards/InstructorCard';

const InstructorDetailsPage = () => {
    const { data: instructors, loading, error, fetchData } = useCourseApi();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const instructorsPerPage = 9;

    useEffect(() => {
        fetchData('/instructors');
    }, [fetchData]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sortedAndFilteredInstructors = instructors?.filter(instructor => {
        const nameMatch = (instructor.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = (instructor.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || emailMatch;
    }).sort((a, b) => {
        // Only sort by name
        if (sortOrder === 'name-asc') {
            return (a.name || '').localeCompare(b.name || '');
        } else if (sortOrder === 'name-desc') {
            return (b.name || '').localeCompare(a.name || '');
        }
        // If no specific name sort is selected, default to ascending
        return (a.name || '').localeCompare(b.name || '');
    }) || [];

    const indexOfLastInstructor = currentPage * instructorsPerPage;
    const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
    const currentInstructors = sortedAndFilteredInstructors.slice(indexOfFirstInstructor, indexOfLastInstructor);
    const totalPages = Math.ceil(sortedAndFilteredInstructors.length / instructorsPerPage);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /><div className="mt-2">Loading instructors...</div></div>;

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
            <h1 className="text-2xl font-bold mb-4">Enlisted Instructors</h1>
            <p className="text-muted mb-4">View and manage a detailed list of all instructors in the system.</p>

            {/* Filter and Sort Controls */}
            <div className="d-flex flex-column flex-md-row align-items-center mb-4 gap-2">
                <Form.Group className="w-100">
                    <div className="input-group">
                        <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
                        <FormControl
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </Form.Group>

                <Form.Group className="w-100">
                    <div className="input-group">
                        <span className="input-group-text"><FontAwesomeIcon icon={faSort} /></span>
                        <Form.Select onChange={handleSortChange} value={sortOrder}>
                            <option value="name-asc">Sort by Name (A-Z)</option>
                            <option value="name-desc">Sort by Name (Z-A)</option>
                        </Form.Select>
                    </div>
                </Form.Group>
            </div>

            {/* Instructor Cards Grid */}
            <Row xs={1} md={2} lg={3} className="g-4">
                {currentInstructors.length > 0 ? (
                    currentInstructors.map(instructor => (
                        <Col key={instructor.id}>
                            <InstructorCard instructor={instructor} />
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Alert variant="info" className="text-center">No instructors found matching your criteria.</Alert>
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

export default InstructorDetailsPage;