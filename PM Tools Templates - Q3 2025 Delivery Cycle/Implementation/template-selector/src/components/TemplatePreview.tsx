import React from 'react';
import './TemplatePreview.css';

interface TemplatePreviewProps {
  template: {
    id: string;
    name: string;
    description: string;
  };
  onClose: () => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onClose }) => {
  return (
    <div className="template-preview">
      <div className="preview-header">
        <h2>{template.name}</h2>
        <button onClick={onClose} className="close-button" aria-label="Close preview">
          ×
        </button>
      </div>
      <div className="preview-content">
        <p>{template.description}</p>
        {/* Add more detailed content about the template here */}
      </div>
      <div className="preview-actions">
        <button onClick={() => console.log('Use Template')} className="use-template">
          Use Template
        </button>
        <button onClick={() => console.log('Download Template')} className="download-template">
          Download
        </button>
        <button onClick={() => console.log('Share Template')} className="share-template">
          Share
        </button>
      </div>
    </div>
  );
};

