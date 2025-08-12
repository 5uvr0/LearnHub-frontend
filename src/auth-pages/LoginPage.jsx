import React, { useState } from 'react';
import { Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import LoginForm from '../components/forms/LoginForm';
import useAuthApi from '../hooks/useAuthApi'; 
import texts from '../i18n/texts';

const LoginPage = () => {
    const { data: LoginData, loading: LoginLoading, error: LoginApiError, fetchData: registerUser } = useAuthApi();

    const [message, setMessage] = useState('');
    const [messageVariant, setMessageVariant] = useState(''); 
    const [backendFormErrors, setBackendFormErrors] = useState({});

    const handleLoginSubmit = async (formData) => {
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
            // Login successful. `result` here corresponds to JwtResponse.
            setMessage(result.message || texts.alerts?.LoginSuccess || 'Login successful! Please check your email to verify your account and then log in.');
            setMessageVariant('success');
            // Optionally, clear the form here if Login was successful
            // e.g., if you had form data state here and passed it down to LoginForm.
            // For now, the form's internal state will persist unless reset by the user.
        } else if (LoginApiError) {
            // Login failed. LoginApiError is a string (possibly stringified JSON).
            setMessageVariant('danger');
            try {
                // Attempt to parse the error string from useApi as ErrorResponse JSON
                const parsedError = JSON.parse(LoginApiError);
                if (parsedError.message) {
                    setMessage(parsedError.message);
                } else {
                    setMessage(texts.alerts?.LoginFailed || 'Login failed. Please try again.');
                }
                if (parsedError.errors) {
                    setBackendFormErrors(parsedError.errors); // Set backend field errors
                }
            } catch (e) {
                // If parsing fails, it's a simple string error message
                setMessage(LoginApiError || texts.alerts?.LoginFailed || 'Login failed. An unexpected error occurred.');
            }
        } else {
            // Fallback for unexpected scenarios (e.g., no result and no specific API error message)
            setMessage(texts.alerts?.LoginFailed || 'Login failed. Please check your network and try again.');
            setMessageVariant('danger');
        }
    };

    return (
        <section className="Login-page py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>

                        {LoginLoading && (
                            <div className="text-center mb-3">
                                <Spinner animation="border" role="status" className="mb-2">
                                    <span className="visually-hidden">loggingin...</span>
                                </Spinner>
                                <p className="text-muted">{texts.alerts?.loggingin || 'loggingin...'}</p>
                            </div>
                        )}

                        {message && (
                            <Alert variant={messageVariant} className="text-center mb-3">
                                {message}
                            </Alert>
                        )}

                        <LoginForm
                            onSubmit={handleLoginSubmit}
                            isLoading={LoginLoading}
                            apiErrors={backendFormErrors} // Pass backend field errors to the form
                        />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default LoginPage;
