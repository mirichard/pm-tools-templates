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
    const fileName = filePath.split('/').pop() || 'template';
    const fileSize = '~2.5KB'; // This could be dynamic if we track file sizes

    switch (extension) {
      case 'md':
        return (
          <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ 
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📄</span>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{fileName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Markdown • {fileSize}</div>
                </div>
              </div>
              <a 
                href={`/pm-tools-templates/${filePath}`} 
                download
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
              >
                💾 Download
              </a>
            </div>
            <iframe 
              src={`/pm-tools-templates/preview/markdown?file=${encodeURIComponent(filePath)}`}
              style={{ 
                width: '100%', 
                height: '600px', 
                border: 'none',
                borderRadius: '0 0 var(--radius-lg) var(--radius-lg)'
              }}
              title={`Preview of ${title}`}
            />
          </div>
        );
      case 'docx':
        return renderOfficeDoc('docx', '📄', 'Word Document');
      case 'xlsx':
        return renderOfficeDoc('xlsx', '📊', 'Excel Spreadsheet');
      case 'pptx':
        return renderOfficeDoc('pptx', '📎', 'PowerPoint Presentation');
      default:
        return renderOfficeDoc('file', '📁', 'File');
    }
  };

  const renderOfficeDoc = (type: string, icon: string, typeName: string) => {
    const fileName = filePath.split('/').pop() || 'template';
    const fileSize = '~156KB'; // This could be dynamic
    
    return (
      <div style={{ 
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{icon}</div>
          <h3 style={{ 
            color: 'var(--text-primary)', 
            marginBottom: '0.5rem',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            {fileName}
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: '2rem',
            fontSize: '0.875rem'
          }}>
            {typeName} • {fileSize}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href={`/pm-tools-templates/${filePath}`} 
              download
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              💾 Download {type.toUpperCase()}
            </a>
            <button 
              className="btn btn-secondary"
              onClick={() => navigator.clipboard.writeText(window.location.origin + `/pm-tools-templates/${filePath}`)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              🔗 Copy Link
            </button>
          </div>
        </div>
        
        <div style={{ 
          padding: '1.5rem',
          borderTop: '1px solid var(--border-light)',
          background: 'var(--bg-secondary)'
        }}>
          <h4 style={{ 
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            📝 Quick Start Tips
          </h4>
          <ul style={{ 
            color: 'var(--text-secondary)',
            fontSize: '0.8125rem',
            paddingLeft: '1.25rem',
            lineHeight: '1.6'
          }}>
            <li>Download the template to get started immediately</li>
            <li>Customize the content for your specific project needs</li>
            <li>Check the changelog tab to see recent updates</li>
            <li>Save to favorites for quick access later</li>
          </ul>
        </div>
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
