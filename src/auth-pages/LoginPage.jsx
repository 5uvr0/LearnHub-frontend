import React, { useState } from 'react';
import { Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import LoginForm from '../components/forms/LoginForm';
import useAuthApi from '../hooks/useAuthApi';
import texts from '../i18n/texts';
import Cookies from 'js-cookie';

const LoginPage = () => {
    const { data: LoginData, loading: LoginLoading, error: LoginApiError, fetchData: registerUser } = useAuthApi();

    const [message, setMessage] = useState('');
    const [messageVariant, setMessageVariant] = useState('');
    const [backendFormErrors, setBackendFormErrors] = useState({});

    const handleLoginSubmit = async (formData) => {
        setMessage('');
        setMessageVariant('');
        setBackendFormErrors({});

        // Note: The original code was calling '/api/register' which is for user registration.
        // For a login page, you should be calling a login API endpoint.
        // I've changed it to '/api/login' for a more logical example.
        const result = await registerUser('/api/login', {
            method: 'POST',
            data: {
                email: formData.email,
                password: formData.password,
            },
        });

        if (result) {
            // Login successful. `result` here corresponds to the JwtResponse.
            setMessage(result.message || texts.alerts?.LoginSuccess || 'Login successful!');
            setMessageVariant('success');

            // For example, `expires: 7` will set the cookie to expire in 7 days.
            Cookies.set('accessToken', result.accessToken, { expires: 7 });
            Cookies.set('refreshToken', result.refreshToken, { expires: 7 });

        } else if (LoginApiError) {
            setMessageVariant('danger');

            try {

                const parsedError = JSON.parse(LoginApiError);

                if (parsedError.message) {
                    setMessage(parsedError.message);

                } else {
                    setMessage(texts.alerts?.LoginFailed || 'Login failed. Please try again.');
                }

                if (parsedError.errors) {
                    setBackendFormErrors(parsedError.errors);
                }

            } catch (e) {
                setMessage(LoginApiError || texts.alerts?.LoginFailed || 'Login failed. An unexpected error occurred.');
            }

        } else {
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
                                    <span className="visually-hidden">logging in...</span>
                                </Spinner>
                                <p className="text-muted">{texts.alerts?.loggingin || 'Logging in...'}</p>
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
                            apiErrors={backendFormErrors}
                        />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default LoginPage;