// Quiz.jsx
const Quiz = ({ content }) => (

    <div>
        {content.questions?.map((q, idx) => (
            <div key={idx} className="mb-4">
                <p className="font-medium">{q.question}</p>
                <ul>
                    {q.options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                    ))}
                </ul>
            </div>
        ))}
    </div>
);

export default Quiz;
