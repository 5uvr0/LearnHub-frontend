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

        try {
            const result = await registerUser('/api/register', {
                method: 'POST',
                data: formData
            });

            if (result) {
                setFormErrors({});
                setMessage(result.message || texts.auth?.registrationSuccess);
                setMessageVariant('success');

                alert(result.message || texts.auth?.registrationSuccessAlert);
                navigate("/login");
            }

        } catch (err) {
            setMessageVariant('danger');
            console.log('Caught error:', err);

            setMessage(texts.auth?.registrationFailed);
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
                    setFormErrors({});
                    setMessage(parsedError.message || texts.auth?.registrationFailed);
                }
                
                setMessageVariant('danger');
                
            } catch (e) {
                console.error('Error parsing API error:', e);
                setFormErrors({});
                setMessage(texts.auth?.registrationFailed);
                setMessageVariant('danger');
            }
        }
    }, [error, loading]);

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