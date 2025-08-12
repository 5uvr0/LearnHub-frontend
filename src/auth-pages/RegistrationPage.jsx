// src/pages/RegistrationPage.jsx

import React, { useState } from 'react';
import { Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import RegistrationForm from '../components/forms/RegistrationForm';
import useAuthApi from '../hooks/useAuthApi';
import texts from '../i18n/texts'; 

const RegistrationPage = () => {
    const { data: registrationData, loading: registrationLoading, error: registrationApiError, fetchData: registerUser } = useAuthApi();

    const [message, setMessage] = useState('');
    const [messageVariant, setMessageVariant] = useState(''); // 'success' or 'danger'
    const [backendFormErrors, setBackendFormErrors] = useState({});

    const handleRegistrationSubmit = async (formData) => {
        setMessage('');
        setMessageVariant('');
        setBackendFormErrors({});

        const result = await registerUser('/api/register', {
            method: 'POST',
            data: {
                email: formData.email,
                password: formData.password,
                role: formData.role,
            },
        });

        if (result) {
            setMessage(result.message || texts.alerts?.registrationSuccess || 'Registration successful! Please check your email to verify your account and then log in.');
            setMessageVariant('success');

        } else if (registrationApiError) {
            setMessageVariant('danger');

            try {
                const parsedError = JSON.parse(registrationApiError);
                if (parsedError.message) {
                    setMessage(parsedError.message);

                } else {
                    setMessage(texts.alerts?.registrationFailed || 'Registration failed. Please try again.');
                }

                if (parsedError.errors) {
                    setBackendFormErrors(parsedError.errors);
                }

            } catch (e) {
                setMessage(registrationApiError || texts.alerts?.registrationFailed || 'Registration failed. An unexpected error occurred.');
            }

        } else {
            setMessage(texts.alerts?.registrationFailed || 'Registration failed. Please check your network and try again.');
            setMessageVariant('danger');
        }
    };

    return (
        <section className="registration-page py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>

                        {registrationLoading && (
                            <div className="text-center mb-3">
                                <Spinner animation="border" role="status" className="mb-2">
                                    <span className="visually-hidden">Registering...</span>
                                </Spinner>
                                <p className="text-muted">{texts.alerts?.registering || 'Registering...'}</p>
                            </div>
                        )}

                        {message && (
                            <Alert variant={messageVariant} className="text-center mb-3">
                                {message}
                            </Alert>
                        )}

                        <RegistrationForm
                            onSubmit={handleRegistrationSubmit}
                            isLoading={registrationLoading}
                            apiErrors={backendFormErrors}
                        />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default RegistrationPage;
