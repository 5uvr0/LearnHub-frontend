import React from 'react';
import texts from '../i18n/texts';
import Form from 'react-bootstrap/Form';
import { Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import CustomButton from '../components/common/CustomButton';
import useAuthApi from '../auth-hooks/useAuthApi';
import { useNavigate } from 'react-router-dom';

const RESET_PASS_PATH = import.meta.env.VITE_AUTH_RESET_PASS_PATH;

const EmailEntryPassResetPage = () => {
    const { loading, error: apiError, fetchData: verifyEmail } = useAuthApi();

    const [message, setMessage] = React.useState('');
    const [messageVariant, setMessageVariant] = React.useState('');
    const [formData, setFormData] = React.useState({ email: '' });
    const [formErrors, setFormErrors] = React.useState({ email: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email) {
            setFormErrors(prev => ({ ...prev, email: 'Email is required' }));
            return;
        }

        const result = await verifyEmail(RESET_PASS_PATH, {
            method: 'POST',
            body: formData
        });

        if (result != null) {
            setMessage(texts.auth?.emailVerified);
            setMessageVariant('success');

            setTimeout(() => navigate(`/reset-password/${result.message}`), 2000);

        } else {
            setMessage(apiError.error);
            setMessageVariant('danger');
        }
    };

    return (
        <section className="email-entry-page py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Form onSubmit={handleSubmit} className="p-4 border rounded-4 shadow-sm bg-light">
                            <h4 className="mb-4 text-primary">{texts.forms?.passwordRecovery}</h4>

                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label className="text-muted">{texts.forms?.emailEntry}</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    isInvalid={!!formErrors.email}
                                    placeholder="e.g., your.email@example.com"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div className="d-flex justify-content-end">
                                <CustomButton variant="outline-success" type="submit" isLoading={loading} size="sm">
                                    {texts.auth?.submitButton}
                                </CustomButton>
                            </div>
                        </Form>

                        {(message || apiError) && (
                            <Alert variant={messageVariant || "danger"} className="text-center mt-5 mb-3">
                                {message || apiError.error}
                            </Alert>
                        )}
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default EmailEntryPassResetPage;
