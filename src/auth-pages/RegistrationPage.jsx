import React, { useState } from 'react';
import { Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import RegistrationForm from '../components/auth/forms/RegistrationForm';
import useAuthApi from '../auth-hooks/useAuthApi';
import texts from '../i18n/texts';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
    const { data, loading, error, fetchData: registerUser } = useAuthApi();
    const [message, setMessage] = useState('');
    const [messageVariant, setMessageVariant] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleRegistrationSubmit = async (formData) => {
        setMessage('');
        setMessageVariant('');
        setFormErrors({});

        const result = await registerUser('/api/register', {
            method: 'POST',
            data: formData
        });

        if (result) {
            setMessage(result.message || texts.auth?.registrationSuccess || 'Registration successful!');
            setMessageVariant('success');

            alert("Registration Succesful! Check your email. You need to activate your account first before you try to login.");
            navigate("/login");
            
        } else if (error) {
            setMessageVariant('danger');
            
            try {
                const parsedError = JSON.parse(error);
                
                if (parsedError.errors?.error) {
                    setMessage(`${parsedError.message || 'Error'}: ${parsedError.errors.error}`);

                } else {
                    setMessage(parsedError.message || texts.auth?.registrationFailed || 'Registration failed.');
                }
                
                if (parsedError.errors && !parsedError.errors.error) {
                    setFormErrors(parsedError.errors);
                }
                
            } catch (e) {
                setMessage(error || texts.auth?.registrationFailed || 'Registration failed.');
            }

        } else {
            setMessage(texts.auth?.registrationFailed || 'Registration failed. Please try again.');
            setMessageVariant('danger');
        }
    };

    return (
        <section className="registration-page py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        {loading && (
                            <div className="text-center mb-3">
                                <Spinner animation="border" role="status" className="mb-2">
                                    <span className="visually-hidden">Registering...</span>
                                </Spinner>
                                <p className="text-muted">{texts.auth?.registering || 'Registering...'}</p>
                            </div>
                        )}

                        {message && (
                            <Alert variant={messageVariant} className="text-center mb-3">
                                {message}
                            </Alert>
                        )}

                        <RegistrationForm
                            onSubmit={handleRegistrationSubmit}
                            isLoading={loading}
                            apiErrors={formErrors}
                        />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default RegistrationPage;