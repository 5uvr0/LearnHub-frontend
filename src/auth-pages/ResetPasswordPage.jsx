import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import texts from "../i18n/texts.js";
import PasswordResetForm from '../components/auth/forms/PasswordResetForm.jsx';
import useAuthApi from '../auth-hooks/useAuthApi.js';

const ForgotPasswordPage = () => {
    const { loading, error: apiError, fetchData: resetPassword } = useAuthApi();
    const [message, setMessage] = useState('');
    const [messageVariant, setMessageVariant] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate();
    const location = useLocation();
    const token = location.pathname.split("/").pop();

    useEffect(() => {
        if (apiError?.formErrors) {
            setFormErrors(apiError.formErrors);
        }
    }, [apiError]);

    const handleResetPassSubmit = async (formData) => {
        setMessage('');
        setMessageVariant('');
        setFormErrors({});

        const payload = {
            password: formData.password,
            enabled: true,
            updateAccessToken: token,
            loggedInAccessToken: null
        };

        try {
            const result = await resetPassword('/api/update-user', {
                method: 'PUT',
                data: payload
            });

            if (result) {
                setMessage(result.message || texts.auth?.resetSuccess);
                setMessageVariant('success');
                setFormErrors({});
                setTimeout(() => navigate('/login'), 1500);
            } else {
                // Let the useEffect handle setting formErrors from apiError
                setMessage(apiError?.message || texts.auth?.resetFailed);
                setMessageVariant('danger');
            }

        } catch (err) {
            console.error('Password reset error:', err);
            setMessage(texts.auth?.resetFailed);
            setMessageVariant('danger');
        }
    };

    return (
        <section className="forgot-password-page py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>

                        {loading && (
                            <div className="text-center mb-3">
                                <Spinner animation="border" role="status" className="mb-2" />
                                <p className="text-muted">{texts.auth?.resettingPass}</p>
                            </div>
                        )}

                        {message && (
                            <Alert variant={messageVariant} className="text-center mb-3">
                                {message}
                            </Alert>
                        )}

                        <PasswordResetForm
                            onSubmit={handleResetPassSubmit}
                            isLoading={loading}
                            apiErrors={formErrors}
                        />

                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default ForgotPasswordPage;