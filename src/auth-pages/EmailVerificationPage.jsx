import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpenText, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import useAuthApi from '../auth-hooks/useAuthApi';
const VERIFICATION_PATH = import.meta.env.VITE_AUTH_VERIFICATION_PATH;

const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchData } = useAuthApi(true);

  const token = location.state?.token;
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage('No token provided.');
      setIsVerified(false);
      return;
    }

    console.log("Found Token ", token);

    const verifyEmail = async () => {
      try {
        const response = await fetchData(`${VERIFICATION_PATH}?token=${token}`, { method: 'GET' });
        if (response) {
          setMessage(response.message || 'Verification successful!');
          setIsVerified(response.message?.toLowerCase().includes('success'));
          if (response.message?.toLowerCase().includes('success')) {
            setTimeout(() => navigate('/login'), 3000);
          }
        } else {
          setMessage('Verification failed. Please try again.');
          setIsVerified(false);
        }
      } catch (e) {
        setMessage('Verification failed. Please try again.');
        setIsVerified(false);
      }
    };

    verifyEmail();
  }, [token, fetchData, navigate]);

  return (
    <section className="py-5">
      <Container className="text-center">
        <Card className="shadow-lg border-0 rounded-4" style={{ maxWidth: 600, margin: '0 auto' }}>
          <Card.Body className="p-5">
            {!message ? (
              <>
                <Spinner animation="border" />
                <p className="mt-3">Verifying your email...</p>
              </>
            ) : isVerified ? (
              <>
                <FontAwesomeIcon icon={faEnvelopeOpenText} size="3x" className="text-success mb-3" />
                <h4>Verification Successful!</h4>
                <p>{message}</p>
                <p>Redirecting to login...</p>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faExclamationCircle} size="3x" className="text-danger mb-3" />
                <h4>Verification Failed</h4>
                <p>{message}</p>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
};

export default EmailVerificationPage;
