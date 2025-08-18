import { useParams } from "react-router-dom";
import useStudentCourseApi from "../../../../learner-hooks/useStudentCourseApi.js";
import Lecture from "./Lecture";
import Quiz from "./Quiz";
import Submission from "./Submission";

const ContentDetailPage = () => {
    const { courseId, contentId } = useParams();
    const { getContentDetail } = useStudentCourseApi();

    const { data: content, isLoading, error } = getContentDetail(courseId, contentId);

    if (isLoading) return <p>Loading content...</p>;
    if (error) return <p>Error loading content</p>;
    if (!content) return <p>No content found.</p>;

    // Map content.type → component
    const renderContent = () => {
        switch (content.type) {
            case "LECTURE":
                return <Lecture content={content} />;
            case "QUIZ":
                return <Quiz content={content} />;
            case "SUBMISSION":
                return <Submission content={content} />;
            default:
                return <p>Unsupported content type: {content.type}</p>;
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
            {renderContent()}
        </div>
    );
};

export default ContentDetailPage;
