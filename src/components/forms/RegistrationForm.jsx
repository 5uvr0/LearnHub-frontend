import React, { useState, useEffect } from 'react';
import { Form, Alert } from 'react-bootstrap';
import CustomButton from '../common/CustomButton';
// Assuming 'texts' contains i18n strings for registration,
// e.g., texts.sections.register, texts.forms.email, etc.
import texts from '../../i18n/texts';

const RegistrationForm = ({ onSubmit, isLoading = false, apiErrors = {} }) => { // Added apiErrors prop
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: '', // 'student' or 'instructor'
    });
    // This state will now solely reflect errors passed down from the API
    const [combinedFormErrors, setCombinedFormErrors] = useState({});

    // Effect to update combined errors whenever apiErrors prop changes
    // No longer dependent on formData as client-side validation is removed
    useEffect(() => {
        setCombinedFormErrors(apiErrors);
    }, [apiErrors]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // When a field changes, clear its corresponding API error if it exists
        setCombinedFormErrors((prevErrors) => ({
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
            setCombinedFormErrors(apiErrors);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-4 border rounded-4 shadow-sm bg-light">
            <h4 className="mb-4 text-primary">{texts.sections?.register || 'Register'}</h4>

            <Form.Group className="mb-3" controlId="userEmail">
                <Form.Label>{texts.forms?.email || 'Email Address'}</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!combinedFormErrors.email} // Use combinedFormErrors
                    placeholder="e.g., your.email@example.com"
                />
                <Form.Control.Feedback type="invalid">{combinedFormErrors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="userPassword">
                <Form.Label>{texts.forms?.password || 'Password'}</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!combinedFormErrors.password} // Use combinedFormErrors
                    placeholder="Enter your password"
                />
                <Form.Control.Feedback type="invalid">{combinedFormErrors.password}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="userRole">
                <Form.Label>{texts.forms?.selectRole || 'Select Your Role'}</Form.Label>
                <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    isInvalid={!!combinedFormErrors.role} // Use combinedFormErrors
                    disabled={isLoading}
                >
                    <option value="">{texts.forms?.chooseRole || 'Choose your role...'} </option>
                    <option value="student">{texts.forms?.roleStudent || 'As a Student'}</option>
                    <option value="instructor">{texts.forms?.roleInstructor || 'As an Instructor'}</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{combinedFormErrors.role}</Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid">
                <CustomButton
                    variant="primary"
                    type="submit"
                    isLoading={isLoading}
                >
                    {texts.forms?.registerButton || 'Register'}
                </CustomButton>
            </div>
        </Form>
    );
};

export default RegistrationForm;
