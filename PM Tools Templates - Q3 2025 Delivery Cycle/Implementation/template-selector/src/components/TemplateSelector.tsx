import React, { useState, useEffect } from 'react';
import { Template } from '../types';

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  methodology?: string;
  category?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelect,
  methodology,
  category,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        // TODO: Implement API call
        const response = await fetch('/api/templates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            methodology,
            category,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }

        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [methodology, category]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    onSelect(template);
  };

  if (loading) {
    return <div className="loading">Loading templates...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="template-selector">
      <div className="template-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${
              selectedTemplate?.id === template.id ? 'selected' : ''
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <h3>{template.name}</h3>
            <p>{template.description}</p>
            <div className="template-metadata">
              <span className="methodology">{template.methodology}</span>
              <span className="category">{template.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
