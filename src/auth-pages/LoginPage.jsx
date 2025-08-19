import React, { useState } from 'react';
import { Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/forms/LoginForm.jsx';
import useAuthApi from '../auth-hooks/useAuthApi';
import texts from '../i18n/texts';

const LoginPage = () => {
    const { data, loading, error, fetchData: loginUser } = useAuthApi();
    const [message, setMessage] = useState('');
    const [messageVariant, setMessageVariant] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleLoginSubmit = async (formData) => {
        setMessage('');
        setMessageVariant('');
        setFormErrors({});

        const result = await loginUser('/api/login', {
            method: 'POST',
            data: formData
        });

        if (result) {
            setMessage(result.message || texts.auth?.loginSuccess || 'Login successful!');
            setMessageVariant('success');

            navigate("/home");
            
        } else if (error) {
            setMessageVariant('danger');
            
            try {
                const parsedError = JSON.parse(error);
                
                if (parsedError.errors?.error) {
                    setMessage(`${parsedError.message || 'Error'}: ${parsedError.errors.error}`);

                } else {
                    setMessage(parsedError.message || texts.auth?.loginFailed || 'Login failed.');
                }
                
                if (parsedError.errors && !parsedError.errors.error) {
                    setFormErrors(parsedError.errors);
                }
                
            } catch (e) {
                setMessage(error || texts.auth?.loginFailed || 'Login failed.');
            }

        } else {
            setMessage(texts.auth?.loginFailed || 'Login failed. Please try again.');
            setMessageVariant('danger');
        }
    };

    return (
        <section className="login-page py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        {loading && (
                            <div className="text-center mb-3">
                                <Spinner animation="border" role="status" className="mb-2">
                                    <span className="visually-hidden">Logging in...</span>
                                </Spinner>
                                <p className="text-muted">{texts.auth?.loggingIn || 'Logging in...'}</p>
                            </div>
                        )}

                        {message && (
                            <Alert variant={messageVariant} className="text-center mb-3">
                                {message}
                            </Alert>
                        )}

                        <LoginForm
                            onSubmit={handleLoginSubmit}
                            isLoading={loading}
                            apiErrors={formErrors}
                        />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default LoginPage;