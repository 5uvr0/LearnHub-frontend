// src/pages/InstructorsPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import InstructorCard from '../components/course/cards/InstructorCard';
import texts from '../i18n/texts';
import useInstructorApi from '../course-hooks/useInstructorApi';

const InstructorsPage = () => {
  const navigate = useNavigate();
  const { data: instructors, loading, error, getAllInstructorsPublic } = useInstructorApi();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllInstructorsPublic?.();
  }, [getAllInstructorsPublic]);

  const filteredInstructors = instructors?.filter(instructor => {
    const matchesSearchTerm = searchTerm === '' ||
      instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearchTerm;
  });

  const handleViewProfileClick = (instructorId) => {
    // Navigate to the new public instructor profile page
    navigate(`/public-instructors/${instructorId}`);
  };

  return (
    <section className="instructors-page py-5">
      <Container>
        <h2 className="text-center mb-5 fw-bold text-primary">{texts.sections?.ourInstructors}</h2>

        <Form className="mb-5 p-4 rounded-lg shadow-sm bg-white">
          <Row className="g-3 align-items-end">
            <Col md={12}>
              <Form.Group controlId="instructorSearch">
                <Form.Label className="fw-bold">Search:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={texts.alerts?.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-md"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">{texts.alerts?.loadingInstructors}</span>
            </Spinner>
            <p className="mt-2 text-muted">{texts.alerts?.loadingInstructors}</p>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="text-center my-5">
            {texts.alerts?.apiError?.(error?.message || texts.alerts?.failedToLoadInstructors)}
          </Alert>
        )}

        {!loading && !error && (!filteredInstructors || filteredInstructors?.length === 0) && (
          <Alert variant="info" className="text-center my-5">
            {texts.alerts?.noInstructorsFound}
          </Alert>
        )}

        {!loading && !error && filteredInstructors && filteredInstructors?.length > 0 && (
          <div className="row g-4 justify-content-center">
            {filteredInstructors?.map((instructor) => (
              <div className="col-md-6 col-lg-4 d-flex" key={instructor?.id}>
                <InstructorCard
                  instructor={instructor}
                  onViewProfile={handleViewProfileClick}
                  viewProfileText={texts.instructorCard?.viewProfile}
                />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default InstructorsPage;