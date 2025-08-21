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
            setMessage(result.message || texts.auth?.registrationSuccess);
            setMessageVariant('success');

            alert(texts.auth?.registrationSuccessAlert);
            navigate("/login");
            
        } else {
            setMessageVariant('danger');
            
            try {
                const parsedError = JSON.parse(error);
                
                if (parsedError.formErrors?.error) {
                    setMessage(parsedError.formErrors.error);

                } else if (parsedError.formErrors) {
                    setFormErrors(parsedError.formErrors);
                    setMessage(parsedError.message || texts.auth?.validationFailed);
                    
                } else {
                    setMessage(parsedError.message || texts.auth?.registrationFailed);
                }
                
            } catch (e) {
                setMessage(texts.auth?.registrationFailed);
            }
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
                                    <span className="visually-hidden">{texts.auth?.registering}</span>
                                </Spinner>
                                <p className="text-muted">{texts.auth?.registering}</p>
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