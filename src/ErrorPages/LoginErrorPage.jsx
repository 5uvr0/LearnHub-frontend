import React, { useState } from "react";
import { Container, Alert, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CustomButton from "../components/common/CustomButton";
import useAuthApi from "../auth-hooks/useAuthApi";
import texts from "../i18n/texts";

const LoginErrorPage = () => {
    const navigate = useNavigate();

    const { data: refreshData, loading: refreshLoading, error: refreshApiError, fetchData: refreshSession } = useAuthApi();

    const [message, setMessage] = useState("");
    const [messageVariant, setMessageVariant] = useState("");

    const handleRefreshSession = async () => {
        setMessage("");
        setMessageVariant("");

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            setMessage(texts.alerts?.noRefreshToken || "No refresh token found. Please log in again.");
            setMessageVariant("danger");
            return;
        }

        const result = await refreshSession("/api/refresh", {
            method: "POST",
            data: {
                refreshToken: refreshToken
            },
        });

        if (result) {
            const newAccessToken = result.accessToken || result.access_token;
            
            if (newAccessToken) {
                Cookies.set("accessToken", newAccessToken, { 
                    expires: 1,
                    secure: true, 
                    sameSite: 'strict' 
                });
                
                setMessage(
                    texts.alerts?.refreshSuccess ||
                        "Session refreshed successfully! Redirecting to homepage..."
                );
                setMessageVariant("success");
                
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                setMessage("Invalid response from server. Please log in again.");
                setMessageVariant("danger");
            }
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
        localStorage.removeItem("refreshToken");
        Cookies.remove("accessToken");
        navigate("/login");
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