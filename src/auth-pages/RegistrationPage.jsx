// src/pages/RegistrationPage.jsx

import React, { useState } from 'react';
import { Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import RegistrationForm from '../components/forms/RegistrationForm';
import useApi from '../hooks/useApi'; // Import the useApi hook
import texts from '../i18n/texts'; // Ensure you have relevant texts defined here

const RegistrationPage = () => {
    // We'll use the useApi hook for handling the registration API call
    const { data: registrationData, loading: registrationLoading, error: registrationApiError, fetchData: registerUser } = useApi();

    // State to manage the general message displayed to the user (success/failure)
    const [message, setMessage] = useState('');
    const [messageVariant, setMessageVariant] = useState(''); // 'success' or 'danger'
    // State to store field-specific errors returned from the backend API
    const [backendFormErrors, setBackendFormErrors] = useState({});

    const handleRegistrationSubmit = async (formData) => {
        setMessage(''); // Clear previous general messages
        setMessageVariant('');
        setBackendFormErrors({}); // Clear previous backend field errors

        // Call the registerUser function from the useApi hook
        const result = await registerUser('/api/register', {
            method: 'POST',
            data: {
                email: formData.email,
                password: formData.password,
                role: formData.role,
            },
        });

        if (result) {
            // Registration successful. `result` here corresponds to JwtResponse.
            setMessage(result.message || texts.alerts?.registrationSuccess || 'Registration successful! Please check your email to verify your account and then log in.');
            setMessageVariant('success');
            // Optionally, clear the form here if registration was successful
            // e.g., if you had form data state here and passed it down to RegistrationForm.
            // For now, the form's internal state will persist unless reset by the user.
        } else if (registrationApiError) {
            // Registration failed. registrationApiError is a string (possibly stringified JSON).
            setMessageVariant('danger');
            try {
                // Attempt to parse the error string from useApi as ErrorResponse JSON
                const parsedError = JSON.parse(registrationApiError);
                if (parsedError.message) {
                    setMessage(parsedError.message);
                } else {
                    setMessage(texts.alerts?.registrationFailed || 'Registration failed. Please try again.');
                }
                if (parsedError.errors) {
                    setBackendFormErrors(parsedError.errors); // Set backend field errors
                }
            } catch (e) {
                // If parsing fails, it's a simple string error message
                setMessage(registrationApiError || texts.alerts?.registrationFailed || 'Registration failed. An unexpected error occurred.');
            }
        } else {
            // Fallback for unexpected scenarios (e.g., no result and no specific API error message)
            setMessage(texts.alerts?.registrationFailed || 'Registration failed. Please check your network and try again.');
            setMessageVariant('danger');
        }
    };

    return (
        <section className="registration-page py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <h2 className="text-center mb-4 fw-bold text-primary">
                            {texts.sections?.registerAccount || 'Create Your Account'}
                        </h2>

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
                            apiErrors={backendFormErrors} // Pass backend field errors to the form
                        />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default RegistrationPage;
