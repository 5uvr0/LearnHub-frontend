import React, { useState } from 'react';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpenText, faExclamationCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import useAuthApi from '../auth-hooks/useAuthApi';

const VERIFICATION_PATH = import.meta.env.VITE_AUTH_VERIFICATION_PATH;

const EmailVerificationPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { fetchData } = useAuthApi();

	const [status, setStatus] = useState('pending');
	const [message, setMessage] = useState('');

	const token = location.state?.token;

	const handleVerifyClick = async () => {
		if (!token) {
			setStatus('error');
			setMessage('No verification token provided.');
			return;
		}

		setStatus('verifying');

		try {
			const response = await fetchData(VERIFICATION_PATH, {
				method: 'GET',
				params: { token }
			});

			setStatus('success');
			setMessage('Email verified successfully!');
			setTimeout(() => navigate('/login'), 2000);


		} catch (error) {
			setStatus('error');
			setMessage('Verification failed. Please try again.');
		}
	};

	return (
		<section className="py-5">
			<Container className="text-center">
				<Card className="shadow-lg border-0 rounded-4" style={{ maxWidth: 600, margin: '0 auto' }}>
					<Card.Body className="p-5">
						{status === 'pending' && (
							<>
								<FontAwesomeIcon icon={faEnvelope} size="3x" className="text-primary mb-3" />
								<h4>Verify Your Email</h4>
								<p className="mb-4">Click the button below to verify your email address and activate your account.</p>
								<Button
									variant="primary"
									size="lg"
									onClick={handleVerifyClick}
									disabled={!token}
								>
									{!token ? 'No Token Available' : 'Verify Email'}
								</Button>
							</>
						)}

						{status === 'verifying' && (
							<>
								<Spinner animation="border" className="text-primary mb-3" />
								<h4>Verifying...</h4>
								<p>Please wait while we verify your email address.</p>
							</>
						)}

						{status === 'success' && (
							<>
								<FontAwesomeIcon icon={faEnvelopeOpenText} size="3x" className="text-success mb-3" />
								<h4>Verification Successful!</h4>
								<p className="text-success">{message}</p>
								<p>Redirecting to login page...</p>
							</>
						)}

						{status === 'error' && (
							<>
								<FontAwesomeIcon icon={faExclamationCircle} size="3x" className="text-danger mb-3" />
								<h4>Verification Failed</h4>
								<p className="text-danger">{message}</p>
								{token && (
									<Button
										variant="outline-primary"
										onClick={handleVerifyClick}
										className="mt-3"
									>
										Try Again
									</Button>
								)}
							</>
						)}
					</Card.Body>
				</Card>
			</Container>
		</section>
	);
};

export default EmailVerificationPage;