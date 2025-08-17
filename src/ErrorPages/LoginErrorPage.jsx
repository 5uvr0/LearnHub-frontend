// src/pages/LoginErrorPage.jsx

import React, { useState } from "react";
import { Container, Alert, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link
import CustomButton from "../components/common/CustomButton";
import useApi from "../hooks/useApi";
import texts from "../i18n/texts";

const LoginErrorPage = () => {
    const navigate = useNavigate(); // Initialize navigate hook

    const { data: refreshData, loading: refreshLoading, error: refreshApiError, fetchData: refreshSession } = useApi();

    const [message, setMessage] = useState("");
    const [messageVariant, setMessageVariant] = useState("");

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    const handleRefreshSession = async () => {
        setMessage("");
        setMessageVariant("");

        const refreshToken = getCookie("refreshToken");

        if (!refreshToken) {
            setMessage(texts.alerts?.noRefreshToken || "No refresh token found. Please log in again.");
            setMessageVariant("danger");
            return;
        }

        const result = await refreshSession("/auth/refresh", {
            method: "POST",
            data: { refreshToken: refreshToken },
        });

        if (result) {
            setMessage(
                texts.alerts?.refreshSuccess ||
                    "Session refreshed successfully! You can now try accessing the previous page."
            );
            setMessageVariant("success");
            // Assuming successful refresh means the user can go to their dashboard or home
            navigate("/dashboard"); // Or navigate to '/' or a specific protected route
        } else if (refreshApiError) {
            setMessage(
                refreshApiError || texts.alerts?.refreshFailed || "Failed to refresh session. Please log in again."
            );
            setMessageVariant("danger");
        } else {
            setMessage(
                texts.alerts?.refreshFailed || "Failed to refresh session. Please check your network and try again."
            );
            setMessageVariant("danger");
        }
    };

    const handleLoginAgain = () => {
        navigate("/login"); // Navigate to the login page
    };

    return (
        <section className="login-error-page py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <h2 className="text-center mb-4 fw-bold text-danger">
                            {texts.sections?.sessionExpired || "Session Expired"}
                        </h2>

                        <Alert variant="warning" className="text-center mb-4">
                            {texts.alerts?.loginValidityEnded ||
                                "Your Login validity has ended. Click on Refresh to continue from your previous session or login again."}
                        </Alert>

                        {refreshLoading && (
                            <div className="text-center mb-3">
                                <Spinner animation="border" role="status" className="mb-2">
                                    <span className="visually-hidden">
                                        {texts.alerts?.refreshingSession || "Refreshing session..."}
                                    </span>
                                </Spinner>
                                <p className="text-muted">
                                    {texts.alerts?.refreshingSession || "Refreshing session..."}
                                </p>
                            </div>
                        )}

                        {message && (
                            <Alert variant={messageVariant} className="text-center mb-3">
                                {message}
                            </Alert>
                        )}

                        <div className="d-flex justify-content-between gap-3" style={{ width: "max-content" }}>
                            <CustomButton
                                size="sm"
                                variant="outline-success"
                                onClick={handleRefreshSession}
                                isLoading={refreshLoading}
                            >
                                {texts.buttons?.refreshLoginSession || "Refresh Login Session"}
                            </CustomButton>
                            <CustomButton
                                size="sm"
                                variant="outline-warning"
                                onClick={handleLoginAgain}
                                disabled={refreshLoading}
                            >
                                {texts.buttons?.loginAgain || "Login Again"}
                            </CustomButton>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default LoginErrorPage;
