import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import CustomButton from '../common/CustomButton';
import texts from '../../../i18n/texts.js';

const LoginForm = ({ onSubmit, isLoading = false, apiErrors = {} }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: '',
    });
    
    const [formErrors, setformErrors] = useState({});

    useEffect(() => {
        setformErrors(apiErrors);
    }, [apiErrors]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // When a field changes, clear its corresponding API error if it exists
        setformErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // If there are no API errors, proceed with submission
        if (Object.keys(apiErrors).length === 0) {
            onSubmit(formData);

        } else {
            // If there are API errors, ensure they are visible (though they should already be)
            setformErrors(apiErrors);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-4 border rounded-4 shadow-sm bg-light">
            <h4 className="mb-4 text-primary">{texts.auth?.loginFormTitle || 'Login'}</h4>

            <Form.Group className="mb-3" controlId="userEmail">
                <Form.Label>{texts.forms?.email || 'Email Address'}</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!formErrors.email}
                    placeholder="e.g., your.email@example.com"
                />
                <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="userPassword">
                <Form.Label>{texts.forms?.password || 'Password'}</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!formErrors.password}
                    placeholder="Enter your password"
                />
                <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center">
                <small>
                    {texts.auth?.notRegisteredYet || "Don't have an account?"}{' '}
                    <Link to="/register">
                        {texts.auth?.registerLink || 'Register'}
                    </Link>
                </small>

                <CustomButton
                    variant="success"
                    type="submit"
                    isLoading={isLoading}
                    size="sm"
                >
                    {texts.auth?.loginButton || 'Login'}
                </CustomButton>
            </div>
        </Form>
    );
};

export default LoginForm;
