import React, { useEffect, useState } from 'react';
import { Container, Alert, Spinner, Button } from 'react-bootstrap';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import useAuthApi from '../auth-hooks/useAuthApi';
import texts from '../i18n/texts';
import { Link } from 'react-router-dom';

const EmailVerificationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); 

    const { data: verificationResult, loading: verifying, error: verificationError, fetchData: sendVerificationRequest } = useAuthApi();

    const [displayMessage, setDisplayMessage] = useState('');
    const [messageVariant, setMessageVariant] = useState('info');

    const initialRegistrationMessage = location.state?.message;

    useEffect(() => {
        if (initialRegistrationMessage) {
            setDisplayMessage(initialRegistrationMessage);
            setMessageVariant('info');
        }
    }, [initialRegistrationMessage]);

    useEffect(() => {
        if (token) {
            setDisplayMessage(texts.auth?.verifyingEmail || 'Verifying your email...');
            setMessageVariant('info');
            sendVerificationRequest(`/api/verify-email?token=${token}`);
        }
    }, [token, sendVerificationRequest]);

    useEffect(() => {
        if (verificationResult) {
            setDisplayMessage(verificationResult.message || texts.auth?.verificationSuccess);
            setMessageVariant('success');

        } else if (verificationError) {
            try {
                const parsedError = JSON.parse(verificationError);
                setDisplayMessage(parsedError.message || texts.auth?.verificationFailed);
            } catch (e) {
                setDisplayMessage(texts.auth?.verificationFailed);
            }
            setMessageVariant('danger');
        }
    }, [verificationResult, verificationError, navigate]);

    return (
        <section className="email-verification-page py-5">
            <Container>
                <div className="text-center">
                    {verifying && (
                        <div className="mb-3">
                            <Spinner animation="border" role="status" className="mb-2">
                                <span className="visually-hidden">{texts.auth?.verifyingEmail}</span>
                            </Spinner>
                            <p className="text-muted">{texts.auth?.verifyingEmail}</p>
                        </div>
                    )}

                    {displayMessage && (
                        <Alert variant={messageVariant} className="text-center">
                            <h4 className="alert-heading">{messageVariant === 'success' ? 'Success!' : 'Information'}</h4>
                            <p dangerouslySetInnerHTML={{ __html: displayMessage }}></p>

                            {/* If an initial message with a link was displayed, but no token was processed yet */}
                            {initialRegistrationMessage && !token && messageVariant === 'info' && (
                                <p className="mt-3 text-muted">
                                    Please click the verification link sent to your email to complete registration.
                                </p>
                            )}

                            {!verifying && messageVariant === 'success' && (
                                <Button as={Link} to="/login" variant="primary" className="mt-3">
                                    Go to Login
                                </Button>
                            )}
                        </Alert>
                    )}

                    {!verifying && !displayMessage && !token && (
                         <Alert variant="info" className="text-center">
                            <h4 className="alert-heading">Email Verification</h4>
                            <p>If you've just registered, a verification link has been sent to your email address.</p>
                            <p className="mb-0">Please check your inbox (and spam folder) to complete your registration.</p>
                        </Alert>
                    )}
                </div>
            </Container>
        </section>
    );
};

export default EmailVerificationPage;