import React, { useState } from 'react';
import { 
  Compass, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  Sparkles,
  ExternalLink,
  Target
} from 'lucide-react';
import { useBlockshield } from '../context/BlockshieldContext';
import { DEMO_SCRIPT_STEPS } from '../data/initialData';

export const GuidedTourBanner: React.FC = () => {
  const { activeDemoStep, setDemoStep } = useBlockshield();
  const [isMinimized, setIsMinimized] = useState(false);

  const currentStep = DEMO_SCRIPT_STEPS.find(s => s.step === activeDemoStep) || DEMO_SCRIPT_STEPS[0];

  const handleNext = () => {
    if (activeDemoStep < DEMO_SCRIPT_STEPS.length) {
      setDemoStep(activeDemoStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeDemoStep > 1) {
      setDemoStep(activeDemoStep - 1);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 pointer-events-none px-4 pb-3">
      <div className="max-w-5xl mx-auto pointer-events-auto">
        <div className="glass-panel-elevated rounded-2xl border border-emerald-500/30 shadow-2xl overflow-hidden backdrop-blur-2xl">
          {/* Header Bar */}
          <div className="bg-slate-900/90 px-4 py-2 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold tracking-wide text-slate-200 uppercase font-mono">
                SIH 2026 Evaluation Tour Script
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-emerald-400 font-semibold font-mono">
                Stage {activeDemoStep} of {DEMO_SCRIPT_STEPS.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Progress Dots */}
              <div className="hidden sm:flex items-center gap-1">
                {DEMO_SCRIPT_STEPS.map(s => (
                  <button
                    key={s.step}
                    onClick={() => setDemoStep(s.step)}
                    title={`Jump to Step ${s.step}: ${s.title}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      s.step === activeDemoStep
                        ? 'bg-emerald-400 ring-2 ring-emerald-400/40 scale-125'
                        : s.step < activeDemoStep
                        ? 'bg-emerald-800 hover:bg-emerald-600'
                        : 'bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setIsMinimized(prev => !prev)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
                title={isMinimized ? 'Expand Guide' : 'Minimize Guide'}
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Body Content */}
          {!isMinimized && (
            <div className="p-3.5 bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-slate-950/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white tracking-tight">
                    {currentStep.step}. {currentStep.title}
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded">
                    Active View: {currentStep.targetTab}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentStep.description}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 font-mono">
                  <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Judge Focus: {currentStep.judgeHighlight}</span>
                </div>
              </div>

              {/* Step Navigation Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={handlePrev}
                  disabled={activeDemoStep === 1}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                    activeDemoStep === 1
                      ? 'text-slate-600 bg-slate-900 border border-slate-800 cursor-not-allowed'
                      : 'text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={activeDemoStep === DEMO_SCRIPT_STEPS.length}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                    activeDemoStep === DEMO_SCRIPT_STEPS.length
                      ? 'text-slate-600 bg-slate-900 border border-slate-800 cursor-not-allowed'
                      : 'text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20'
                  }`}
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
