import React, { useState, useEffect } from 'react';
import { Template } from '../types';
import './GuidedNavigationWizard.css';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  type: 'selection' | 'input' | 'review';
  options?: string[];
  validation?: (value: string) => boolean;
  required?: boolean;
}

interface WizardState {
  projectType: string;
  methodology: string;
  complexity: string;
  teamSize: string;
  timeline: string;
  industry: string;
  goals: string[];
}

interface GuidedNavigationWizardProps {
  onComplete: (recommendations: Template[]) => void;
  onCancel: () => void;
  templates: Template[];
  isOpen: boolean;
}

export const GuidedNavigationWizard: React.FC<GuidedNavigationWizardProps> = ({
  onComplete,
  onCancel,
  templates,
  isOpen
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardState, setWizardState] = useState<WizardState>({
    projectType: '',
    methodology: '',
    complexity: '',
    teamSize: '',
    timeline: '',
    industry: '',
    goals: []
  });

  const steps: WizardStep[] = [
    {
      id: 'project-type',
      title: 'Project Type',
      description: 'What type of project are you planning?',
      type: 'selection',
      options: ['Software Development', 'Marketing Campaign', 'Product Launch', 'Process Improvement', 'Research Project', 'Event Planning'],
      required: true
    },
    {
      id: 'methodology',
      title: 'Methodology Preference',
      description: 'Which project management methodology do you prefer?',
      type: 'selection',
      options: ['Agile', 'Traditional/Waterfall', 'Hybrid', 'Not Sure'],
      required: true
    },
    {
      id: 'complexity',
      title: 'Project Complexity',
      description: 'How complex is your project?',
      type: 'selection',
      options: ['Beginner - Simple project with few dependencies', 'Intermediate - Moderate complexity with some risks', 'Advanced - Complex project with multiple stakeholders'],
      required: true
    },
    {
      id: 'team-size',
      title: 'Team Size',
      description: 'What is your team size?',
      type: 'selection',
      options: ['Solo (1 person)', 'Small team (2-5 people)', 'Medium team (6-15 people)', 'Large team (16+ people)'],
      required: true
    },
    {
      id: 'timeline',
      title: 'Project Timeline',
      description: 'What is your expected project duration?',
      type: 'selection',
      options: ['Less than 1 month', '1-3 months', '3-6 months', '6-12 months', 'More than 1 year'],
      required: true
    },
    {
      id: 'industry',
      title: 'Industry/Domain',
      description: 'What industry or domain is your project in?',
      type: 'selection',
      options: ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Government', 'Other'],
      required: false
    },
    {
      id: 'goals',
      title: 'Project Goals',
      description: 'What are your main project goals? (Select all that apply)',
      type: 'selection',
      options: ['Cost Control', 'Time Management', 'Quality Assurance', 'Risk Mitigation', 'Team Collaboration', 'Stakeholder Communication', 'Documentation', 'Compliance'],
      required: false
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (isOpen) {
      // Reset wizard state when opened
      setCurrentStep(0);
      setWizardState({
        projectType: '',
        methodology: '',
        complexity: '',
        teamSize: '',
        timeline: '',
        industry: '',
        goals: []
      });
    }
  }, [isOpen]);

  const handleStepValue = (stepId: string, value: string) => {
    setWizardState(prev => ({
      ...prev,
      [stepId.replace('-', '')]: stepId === 'goals' ? 
        prev.goals.includes(value) 
          ? prev.goals.filter(g => g !== value)
          : [...prev.goals, value]
        : value
    }));
  };

  const getCurrentValue = (stepId: string) => {
    const key = stepId.replace('-', '') as keyof WizardState;
    return wizardState[key];
  };

  const isStepValid = (step: WizardStep) => {
    const value = getCurrentValue(step.id);
    if (step.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Generate recommendations based on wizard state
    const recommendations = generateRecommendations(wizardState, templates);
    onComplete(recommendations);
  };

  const generateRecommendations = (state: WizardState, allTemplates: Template[]): Template[] => {
    // Score templates based on wizard responses
    const scoredTemplates = allTemplates.map(template => {
      let score = 0;
      
      // Methodology matching
      if (state.methodology && template.methodology) {
        if (state.methodology === 'Not Sure') {
          score += 1; // Neutral score for unsure users
        } else if (template.methodology.toLowerCase().includes(state.methodology.toLowerCase())) {
          score += 3;
        }
      }
      
      // Complexity matching
      if (state.complexity && template.metadata?.complexity) {
        const userComplexity = state.complexity.split(' - ')[0];
        if (template.metadata.complexity.toLowerCase() === userComplexity.toLowerCase()) {
          score += 2;
        }
      }
      
      // Category matching based on project type
      if (state.projectType && template.category) {
        const categoryMappings: { [key: string]: string[] } = {
          'Software Development': ['planning', 'execution', 'monitoring'],
          'Marketing Campaign': ['planning', 'execution'],
          'Product Launch': ['planning', 'execution', 'monitoring'],
          'Process Improvement': ['planning', 'monitoring'],
          'Research Project': ['planning', 'execution'],
          'Event Planning': ['planning', 'execution', 'monitoring']
        };
        
        const relevantCategories = categoryMappings[state.projectType] || [];
        if (relevantCategories.some(cat => template.category.toLowerCase().includes(cat))) {
          score += 2;
        }
      }
      
      // Goals matching
      if (state.goals.length > 0 && template.metadata?.tags) {
        const goalTags = state.goals.map(goal => goal.toLowerCase().replace(/\s+/g, '-'));
        const templateTags = template.metadata.tags.map(tag => tag.toLowerCase());
        const matchingGoals = goalTags.filter(goal => 
          templateTags.some(tag => tag.includes(goal) || goal.includes(tag))
        );
        score += matchingGoals.length;
      }
      
      return { ...template, score };
    });
    
    // Sort by score and return top recommendations
    return scoredTemplates
      .sort((a, b) => b.score - a.score)
      .slice(0, 6); // Return top 6 recommendations
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const currentValue = getCurrentValue(currentStepData.id);

  return (
    <div className="guided-wizard-overlay" role="dialog" aria-labelledby="wizard-title">
      <div className="guided-wizard">
        <div className="wizard-header">
          <h2 id="wizard-title">Template Selection Wizard</h2>
          <button 
            onClick={onCancel}
            className="wizard-close"
            aria-label="Close wizard"
          >
            ×
          </button>
        </div>
        
        <div className="wizard-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        <div className="wizard-content">
          <div className="step-header">
            <h3>{currentStepData.title}</h3>
            <p>{currentStepData.description}</p>
          </div>

          <div className="step-options">
            {currentStepData.options?.map((option, index) => (
              <div key={index} className="option-item">
                <label className="option-label">
                  <input
                    type={currentStepData.id === 'goals' ? 'checkbox' : 'radio'}
                    name={currentStepData.id}
                    value={option}
                    checked={
                      currentStepData.id === 'goals' 
                        ? Array.isArray(currentValue) && currentValue.includes(option)
                        : currentValue === option
                    }
                    onChange={() => handleStepValue(currentStepData.id, option)}
                  />
                  <span className="option-text">{option}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="wizard-actions">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="wizard-button wizard-button-secondary"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isStepValid(currentStepData)}
            className="wizard-button wizard-button-primary"
          >
            {currentStep === steps.length - 1 ? 'Get Recommendations' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
