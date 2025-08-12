import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CustomButton = ({
    variant,
    children,
    onClick,
    className = "",
    icon, // Font Awesome icon object (e.g., faPlus)
    iconPlacement = "left", // 'left' or 'right'
    isLoading = false, // Boolean for loading state
    disabled = false, // Boolean for disabled state
    type = "button", // 'button', 'submit', 'reset'
    as, // For polymorphic rendering, e.g., to be used as a 'Link' component from react-router-dom
    ...props // Any other props to pass directly to Button
}) => {
    const isDisabled = disabled || isLoading;

    return (
        <Button
            variant={variant}
            onClick={onClick}
            className={`rounded-pill px-4 py-2 shadow-sm d-inline-flex align-items-center justify-content-center ${className}`}
            disabled={isDisabled}
            type={type}
            as={as}
            {...props}
        >
            {isLoading ? (
                <>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                    />
                    Loading...
                </>
            ) : (
                <>
                    {icon && iconPlacement === "left" && (
                        <FontAwesomeIcon icon={icon} className="me-2" />
                    )}

                    {children}

                    {icon && iconPlacement === "right" && (
                        <FontAwesomeIcon icon={icon} className="ms-2" />
                    )}
                </>
            )}
        </Button>
    );
};
