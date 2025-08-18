import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileVideo,
    faQuestionCircle,
    faClipboardList,
    faInfoCircle,
    faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const getContentInfo = (content) => {
    let icon = faInfoCircle;
    let typeLabel = "Content";
    let variant = "secondary";

    switch (content?.type) {
        case "LECTURE":
            icon = faFileVideo;
            typeLabel = "Lecture";
            variant = "info";
            break;
        case "QUIZ":
            icon = faQuestionCircle;
            typeLabel = "Quiz";
            variant = "warning";
            break;
        case "SUBMISSION":
            icon = faClipboardList;
            typeLabel = "Submission";
            variant = "success";
            break;
        default:
            icon = faInfoCircle;
            typeLabel = "Unknown";
            variant = "secondary";
    }

    return { icon, typeLabel, variant };
};

const ContentListItem = ({ content }) => {
    const navigate = useNavigate();
    if (!content) return null;

    const { icon, typeLabel, variant } = getContentInfo(content);

    const handleClick = () => {
        let route = "/student/content/" + content.id;
        switch (content.type) {
            case "LECTURE":
                route += "/lecture";
                break;
            case "QUIZ":
                route += "/quiz";
                break;
            case "SUBMISSION":
                route += "/submission";
                break;
            default:
                route += "/unknown";
        }
        navigate(route);
    };

    return (
        <ListGroup.Item
            className="shadow-sm rounded-3 mb-2 p-3"
            style={{ cursor: "pointer" }}
            onClick={handleClick}
        >
            <div className="d-flex align-items-start">
                <FontAwesomeIcon icon={icon} className="me-3 text-muted" size="lg" />
                <div>
                    <h5 className="mb-1">
                        {content.title} <Badge bg={variant}>{typeLabel}</Badge>
                    </h5>

                    {content.description && (
                        <p
                            className="mb-1"
                            dangerouslySetInnerHTML={{ __html: content.description }}
                        ></p>
                    )}

                    {content.videoUrl && (
                        <p className="mb-1">
                            Video:{" "}
                            <a
                                href={content.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()} // prevent navigate
                            >
                                Watch <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                            </a>
                        </p>
                    )}

                    {content.resourceLink && (
                        <p className="mb-1">
                            Resource:{" "}
                            <a
                                href={content.resourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Download <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                            </a>
                        </p>
                    )}
                </div>
            </div>
        </ListGroup.Item>
    );
};

export default ContentListItem;
