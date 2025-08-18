// Lecture.jsx
const Lecture = ({ content }) => (
    <div>
        <p>{content.text}</p>
        {content.videoUrl && <video src={content.videoUrl} controls className="mt-4" />}
    </div>
);

export default Lecture;
