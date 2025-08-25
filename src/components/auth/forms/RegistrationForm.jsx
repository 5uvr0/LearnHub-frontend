import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, InputGroup } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';
import CustomButton from '../../common/CustomButton.jsx';
import texts from '../../../i18n/texts.js';

const RegistrationForm = ({ onSubmit, isLoading = false, apiErrors = {} }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        setFormErrors(apiErrors);
    }, [apiErrors]);

    useEffect(() => {
        if (formData.password && formData.confirmPassword) {
            setFormErrors(prev => ({
                ...prev,
                confirmPassword:
                    formData.password !== formData.confirmPassword
                        ? 'Passwords do not match'
                        : ''
            }));
        }
    }, [formData.password, formData.confirmPassword]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setFormErrors(prev => ({
                ...prev,
                confirmPassword: 'Passwords do not match'
            }));
            return;
        }

        const { confirmPassword, ...submitData } = formData;
        onSubmit(submitData);
    };

    return (
        <Form onSubmit={handleSubmit} className="p-4 border rounded-4 shadow-sm bg-light">
            <h4 className="mb-4 text-primary">
                {texts.auth?.registrationFormTitle || 'Register'}
            </h4>

            {/* Email */}
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
                <Form.Control.Feedback type="invalid">
                    {formErrors.email}
                </Form.Control.Feedback>
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3" controlId="userPassword">
                <Form.Label>{texts.forms?.password || 'Password'}</Form.Label>
                <InputGroup>
                    <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!formErrors.password}
                        placeholder="Enter your password"
                    />
                    <InputGroup.Text
                        style={{ cursor: 'pointer', backgroundColor: 'transparent' }}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff size={16} className="text-muted" />
                        ) : (
                            <Eye size={16} className="text-muted" />
                        )}
                    </InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback
                    type="invalid"
                    className={formErrors.password ? 'd-block' : ''}
                >
                    {formErrors.password}
                </Form.Control.Feedback>
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group className="mb-3" controlId="userConfirmPassword">
                <Form.Label>{texts.forms?.confirmPassword || 'Confirm Password'}</Form.Label>
                <InputGroup>
                    <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!formErrors.confirmPassword}
                        placeholder="Confirm your password"
                    />
                    <InputGroup.Text
                        style={{ cursor: 'pointer', backgroundColor: 'transparent' }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? (
                            <EyeOff size={16} className="text-muted" />
                        ) : (
                            <Eye size={16} className="text-muted" />
                        )}
                    </InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback
                    type="invalid"
                    className={formErrors.confirmPassword ? 'd-block' : ''}
                >
                    {formErrors.confirmPassword}
                </Form.Control.Feedback>
            </Form.Group>

            {/* Role */}
            <Form.Group className="mb-4" controlId="userRole">
                <Form.Label>{texts.forms?.selectRole || 'Select Your Role'}</Form.Label>
                <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    isInvalid={!!formErrors.role}
                    disabled={isLoading}
                >
                    <option value="">
                        {texts.forms?.chooseRole || 'Choose your role...'}
                    </option>
                    <option value="STUDENT">
                        {texts.forms?.roleStudent || 'As a Student'}
                    </option>
                    <option value="INSTRUCTOR">
                        {texts.forms?.roleInstructor || 'As an Instructor'}
                    </option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {formErrors.role}
                </Form.Control.Feedback>
            </Form.Group>

            {/* Submit */}
            <div className="d-flex justify-content-between align-items-center">
                <small>
                    {texts.auth?.alreadyRegistered || 'Already registered?'}{' '}
                    <Link to="/login">{texts.auth?.loginLink || 'Login'}</Link>
                </small>
                <CustomButton
                    variant="success"
                    type="submit"
                    isLoading={isLoading}
                    size="sm"
                >
                    {texts.auth?.registrationButton || 'Register'}
                </CustomButton>
            </div>
        </Form>
    );
};

export default RegistrationForm;
