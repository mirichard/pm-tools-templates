import React, { useState, useEffect } from 'react';

interface ChangelogEntry {
  hash: string;
  date: string;
  message: string;
}

interface Props {
  templateId: string;
  filePath: string;
  title: string;
}

const TemplateViewer: React.FC<Props> = ({ templateId, filePath, title }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'changelog'>('preview');
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'changelog') {
      loadChangelog();
    }
  }, [activeTab, templateId]);

  const loadChangelog = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/pm-tools-templates/changelog/${templateId}.json`);
      if (response.ok) {
        const data = await response.json();
        setChangelog(data.changes || []);
      }
    } catch (error) {
      console.error('Failed to load changelog:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileExtension = (path: string) => {
    return path.split('.').pop()?.toLowerCase() || '';
  };

  const renderPreview = () => {
    const extension = getFileExtension(filePath);

    switch (extension) {
      case 'md':
        return (
          <iframe 
            src={`/pm-tools-templates/preview/markdown?file=${encodeURIComponent(filePath)}`}
            style={{ width: '100%', height: '600px', border: '1px solid var(--border-color)' }}
            title={`Preview of ${title}`}
          />
        );
      case 'docx':
        return renderOfficeDoc('docx');
      case 'xlsx':
        return renderOfficeDoc('xlsx');
      case 'pptx':
        return renderOfficeDoc('pptx');
      default:
        return (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            background: 'var(--code-bg)', 
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <p>Preview not available for this file type.</p>
            <a 
              href={`/pm-tools-templates/${filePath}`} 
              download
              style={{ 
                background: 'var(--accent-color)', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '4px',
                textDecoration: 'none',
                display: 'inline-block',
                marginTop: '1rem'
              }}
            >
              Download Original
            </a>
          </div>
        );
    }
  };

  const renderOfficeDoc = (type: string) => {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        background: 'var(--code-bg)', 
        borderRadius: '8px',
        border: '1px solid var(--border-color)'
      }}>
        <p>Office document preview will be available soon.</p>
        <p>For now, please download the file to view it locally.</p>
        <a 
          href={`/pm-tools-templates/${filePath}`} 
          download
          style={{ 
            background: 'var(--accent-color)', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: '1rem'
          }}
        >
          Download {type.toUpperCase()} File
        </a>
      </div>
    );
  };

  const renderChangelog = () => {
    if (loading) {
      return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading changelog...</div>;
    }

    if (changelog.length === 0) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No changelog available for this template.</p>
        </div>
      );
    }

    return (
      <div style={{ padding: '1rem' }}>
        <h3>Version History</h3>
        <div style={{ position: 'relative' }}>
          {/* Vertical timeline line */}
          <div style={{
            position: 'absolute',
            left: '1rem',
            top: '0',
            bottom: '0',
            width: '2px',
            background: 'var(--border-color)',
            zIndex: 1
          }} />
          
          {changelog.map((entry, index) => (
            <div key={entry.hash} style={{ 
              position: 'relative', 
              paddingLeft: '3rem', 
              paddingBottom: '1.5rem',
              paddingTop: index === 0 ? '0' : '1.5rem'
            }}>
              {/* Timeline dot */}
              <div style={{
                position: 'absolute',
                left: '0.5rem',
                top: index === 0 ? '0.5rem' : '2rem',
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                background: 'var(--accent-color)',
                zIndex: 2,
                border: '2px solid var(--bg-color)'
              }} />
              
              <div style={{ 
                background: 'var(--code-bg)', 
                padding: '1rem', 
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <code style={{ fontSize: '0.8rem', background: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    {entry.hash.substring(0, 7)}
                  </code>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    {entry.date}
                  </span>
                </div>
                <p style={{ margin: '0', fontSize: '0.95rem' }}>
                  {entry.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>{title}</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <button
          style={{
            background: activeTab === 'preview' ? 'var(--accent-color)' : 'var(--code-bg)',
            color: activeTab === 'preview' ? 'white' : 'var(--text-color)',
            border: '1px solid var(--border-color)',
            padding: '0.5rem 1rem',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            marginRight: '1px'
          }}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
        <button
          style={{
            background: activeTab === 'changelog' ? 'var(--accent-color)' : 'var(--code-bg)',
            color: activeTab === 'changelog' ? 'white' : 'var(--text-color)',
            border: '1px solid var(--border-color)',
            padding: '0.5rem 1rem',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('changelog')}
        >
          Version History
        </button>
      </div>

      <div style={{ 
        border: '1px solid var(--border-color)', 
        borderRadius: '0 8px 8px 8px',
        minHeight: '400px'
      }}>
        {activeTab === 'preview' ? renderPreview() : renderChangelog()}
      </div>
    </div>
  );
};

export default TemplateViewer;
