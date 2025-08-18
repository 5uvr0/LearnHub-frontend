// Submission.jsx
const Submission = ({ content }) => (
    <div>
        <p>{content.instructions}</p>
        <input type="file" className="mt-2" />
    </div>
);

export default Submission;
