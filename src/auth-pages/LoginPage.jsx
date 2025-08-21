import React, { useState } from 'react';
import { Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/forms/LoginForm.jsx';
import useAuthApi from '../auth-hooks/useAuthApi';
import texts from '../i18n/texts';
import Cookie from 'js-cookie';

const ADMIN_DASHBOARD_URL = import.meta.env.VITE_ADMIN_DASHBOARD_PATH;

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

        try {
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

                if (result.role === "ADMIN") {
                    navigate(ADMIN_DASHBOARD_URL);

                } else {
                    navigate("/");
                }
            }

        } catch (err) {
            setMessageVariant('danger');
            console.log('Caught error:', err);
            
            setMessage(texts.auth?.loginFailed);
        }
    };

    React.useEffect(() => {
        if (error && !loading) {
            console.log('Error state updated:', error);
            
            try {
                const parsedError = JSON.parse(error);
                console.log('Parsed error in useEffect:', parsedError);
                
                if (parsedError.formErrors && Object.keys(parsedError.formErrors).length > 0) {
                    setFormErrors(parsedError.formErrors);
                    setMessage(parsedError.message || texts.auth?.validationFailed);

                } else {
                    setMessage(parsedError.message || texts.auth?.loginFailed);
                }
                
                setMessageVariant('danger');
                
            } catch (e) {
                console.error('Error parsing API error:', e);
                setMessage(texts.auth?.loginFailed);
                setMessageVariant('danger');
            }
        }
    }, [error, loading]);

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