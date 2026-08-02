import { useTranslation } from 'react-i18next';

interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {steps.map((step, index) => {
        const isCurrent = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isCurrent
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : isCompleted
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {step.id}
              </span>
              <span
                className={`hidden text-xs font-medium sm:inline-block ${
                  isCurrent
                    ? 'font-semibold text-slate-900 dark:text-white'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {t(step.label)}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 transition-colors sm:w-12 ${
                  step.id < currentStep
                    ? 'bg-slate-900 dark:bg-slate-100'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
