'use client';

import React, { useState } from 'react';
import { Download, FileText, Table, Code, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '@/lib/api';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    metrics: true,
    progressChart: true,
    riskAnalysis: true,
    teamPerformance: true,
    qualityMetrics: true,
    timeline: true,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('idle');

    try {
      const blob = await apiService.exportDashboard(selectedFormat);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.${selectedFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportStatus('success');
      setTimeout(() => {
        setExportStatus('idle');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const formatIcons = {
    pdf: FileText,
    csv: Table,
    json: Code,
  };

  const formatDescriptions = {
    pdf: 'Complete visual report with charts and formatting',
    csv: 'Raw data in spreadsheet-compatible format',
    json: 'Structured data for API integration',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Download className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Export Dashboard Report</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Format Selection */}
          <div>
            <h3 className="text-lg font-medium mb-4">Choose Export Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['pdf', 'csv', 'json'] as const).map((format) => {
                const Icon = formatIcons[format];
                const isSelected = selectedFormat === format;
                return (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    aria-label={`Select ${format.toUpperCase()} format`}
                    className={`relative p-6 border-2 rounded-xl text-left transition-all duration-200 transform hover:scale-105 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <Icon className={`w-10 h-10 mb-3 ${
                      isSelected ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <div className={`font-bold text-lg uppercase mb-2 ${
                      isSelected ? 'text-blue-800' : 'text-gray-800'
                    }`}>{format}</div>
                    <div className={`text-sm leading-relaxed ${
                      isSelected ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {formatDescriptions[format]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Selection */}
          <div>
            <h3 className="text-lg font-medium mb-4">Include Sections</h3>
            <div className="space-y-3">
              {Object.entries(selectedSections).map(([key, enabled]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setSelectedSections(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Options */}
          {selectedFormat === 'pdf' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">PDF Export Options</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• High-resolution charts and visualizations</div>
                <div>• Executive summary and key insights</div>
                <div>• Professional formatting and branding</div>
                <div>• Print-ready layout with headers and footers</div>
              </div>
            </div>
          )}

          {selectedFormat === 'csv' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">CSV Export Options</h4>
              <div className="text-sm text-green-700 space-y-1">
                <div>• Raw metric data in tabular format</div>
                <div>• Compatible with Excel and Google Sheets</div>
                <div>• Historical data points for trend analysis</div>
                <div>• Separate sheets for different data types</div>
              </div>
            </div>
          )}

          {selectedFormat === 'json' && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">JSON Export Options</h4>
              <div className="text-sm text-purple-700 space-y-1">
                <div>• Structured data for API integration</div>
                <div>• Machine-readable format</div>
                <div>• Complete dataset with metadata</div>
                <div>• Ideal for automated processing</div>
              </div>
            </div>
          )}

          {/* Export Status */}
          {exportStatus === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-green-100 text-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span>Export completed successfully!</span>
            </div>
          )}

          {exportStatus === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-red-100 text-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>Export failed. Please try again.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            Report generated on {new Date().toLocaleDateString()}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isExporting}
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || Object.values(selectedSections).every(v => !v)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export {selectedFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
