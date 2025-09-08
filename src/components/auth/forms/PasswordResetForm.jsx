import React, { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';
import CustomButton from '../../common/CustomButton.jsx';
import texts from '../../../i18n/texts.js';

const PasswordResetForm = ({ onSubmit, isLoading = false, apiErrors = {} }) => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
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
                        ? texts.auth?.passwordMismatch || 'Passwords do not match'
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
        const { confirmPassword, ...submitData } = formData;
        onSubmit(submitData);
    };

    return (
        <Form onSubmit={handleSubmit} className="p-4 border rounded-4 shadow-sm bg-light">
            <h4 className="mb-4 text-primary">{texts.forms?.resetPassword || 'Reset Password'}</h4>

            {/* Password */}
            <Form.Group className="mb-3" controlId="resetPassword">
                <Form.Label>{texts.forms?.newPassword || 'New Password'}</Form.Label>
                <InputGroup>
                    <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!formErrors.password}
                        placeholder="Enter your new password"
                    />
                    <InputGroup.Text
                        style={{ cursor: 'pointer', backgroundColor: 'transparent' }}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={16} className="text-muted" /> : <Eye size={16} className="text-muted" />}
                    </InputGroup.Text>
                    <Form.Control.Feedback
                        type="invalid"
                        className={formErrors.password ? 'd-block' : ''}
                    >
                        {formErrors.password}
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group className="mb-3" controlId="confirmResetPassword">
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
                        {showConfirmPassword ? <EyeOff size={16} className="text-muted" /> : <Eye size={16} className="text-muted" />}
                    </InputGroup.Text>
                    <Form.Control.Feedback
                        type="invalid"
                        className={formErrors.confirmPassword ? 'd-block' : ''}
                    >
                        {formErrors.confirmPassword}
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            {/* Submit Button */}
            <div className="d-flex justify-content-end">
                <CustomButton
                    variant="outline-success"
                    type="submit"
                    isLoading={isLoading}
                    size="sm"
                >
                    {texts.auth?.submitButton || 'Submit'}
                </CustomButton>
            </div>
        </Form>
    );
};

export default PasswordResetForm;
