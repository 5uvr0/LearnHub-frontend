// src/components/common/MarkdownRenderer.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'rehype-raw'; // Import GitHub Flavored Markdown plugin

const MarkdownRenderer = ({ markdownText, className = '' }) => {

    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown rehypePlugins={[remarkGfm]}> 
                {markdownText} 
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;