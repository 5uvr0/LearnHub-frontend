import React, { useState } from 'react';
import { Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/forms/LoginForm.jsx';
import useAuthApi from '../auth-hooks/useAuthApi';
import texts from '../i18n/texts';
import Cookie from 'js-cookie';
import { parse } from '@fortawesome/fontawesome-svg-core';

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

        if (result && result.accessToken) {
            setMessage(result.message || texts.auth?.loginSuccess);
            setMessageVariant('success');

            Cookie.set("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);

            localStorage.setItem("email", result.email);
            localStorage.setItem("role", result.role);

            // Conditional redirection based on user role
            if (result.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
            
        } else {
            setMessageVariant('danger');
            
            try {
                const parsedError = JSON.parse(error);
                console.log(parsedError);
                
                if (parsedError.errors) {
                    if (Object.keys(parsedError.errors).length > 0) {
                        setFormErrors(parsedError.errors);
                        setMessage(parsedError.message || texts.auth?.validationFailed);
                        
                    } else {
                        setMessage(parsedError.message || texts.auth?.loginFailed);
                    }

                } else {
                    setMessage(parsedError.message || texts.auth?.loginFailed);
                }
                
            } catch (e) {
                setMessage(texts.auth?.loginFailed);
            }
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
                                    <span className="visually-hidden">{texts.auth?.loggingIn}</span>
                                </Spinner>
                                <p className="text-muted">{texts.auth?.loggingIn}</p>
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