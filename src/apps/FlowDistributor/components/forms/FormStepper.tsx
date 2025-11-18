/**
 * FormStepper Component
 * Multi-step form progress indicator
 */
import { Check } from 'lucide-react';
import React from 'react';

interface Step {
  label: string;
  description?: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const FormStepper: React.FC<FormStepperProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-200
                    ${
                      isCompleted
                        ? 'bg-green-600 text-white'
                        : isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4
                    ${isCompleted ? 'bg-green-600' : 'bg-gray-700'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
