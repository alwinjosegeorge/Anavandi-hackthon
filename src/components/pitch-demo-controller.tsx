import React from "react";
import {
  Play,
  AlertTriangle,
  Clock3,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Columns2,
  Database,
  Users,
  ChevronRight,
  X,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PitchStep {
  id: string;
  stepNum: string;
  title: string;
  badge: string;
  score: string;
  view: string;
  description: string;
  signals: {
    routeDeviation: boolean;
    unexpectedStop: boolean;
    etaDelay: boolean;
    lateNightHours: boolean;
    unresponsiveTimer: boolean;
  };
}

export const HACKATHON_PITCH_STEPS: PitchStep[] = [
  {
    id: "step1",
    stepNum: "01",
    title: "Normal Journey",
    badge: "🟢 Safe (Level 0)",
    score: "Score: 1",
    view: "active",
    description: "Passenger boards at Thampanoor. Route and checkpoints monitored on satellite map.",
    signals: { routeDeviation: false, unexpectedStop: false, etaDelay: false, lateNightHours: true, unresponsiveTimer: false },
  },
  {
    id: "step2",
    stepNum: "02",
    title: "Route Deviation",
    badge: "🟡 Attention (Level 1)",
    score: "Score: 3 (+2)",
    view: "deviation",
    description: "Vehicle detours away from planned highway corridor. System notes deviation signal.",
    signals: { routeDeviation: true, unexpectedStop: false, etaDelay: false, lateNightHours: true, unresponsiveTimer: false },
  },
  {
    id: "step3",
    stepNum: "03",
    title: "Unexpected Stop",
    badge: "🟡 Delayed (Level 1)",
    score: "Score: 3 (+2)",
    view: "stopped",
    description: "Stationary for 12 minutes in non-transit area. Anomaly engine logs stop event.",
    signals: { routeDeviation: false, unexpectedStop: true, etaDelay: false, lateNightHours: true, unresponsiveTimer: false },
  },
  {
    id: "step4",
    stepNum: "04",
    title: "30s Safety Check",
    badge: "🟠 Check-in (Level 2)",
    score: "Score: 5 (+4)",
    view: "check",
    description: "Multiple anomalies accumulated. Proactive prompt: 'Are you safe?' countdown.",
    signals: { routeDeviation: true, unexpectedStop: true, etaDelay: false, lateNightHours: true, unresponsiveTimer: false },
  },
  {
    id: "step5",
    stepNum: "05",
    title: "Missed Check-in / Alert",
    badge: "🔴 Escalated (Level 3)",
    score: "Score: 7 (+6)",
    view: "missed",
    description: "Timer expires without passenger confirmation. Immediate alert sent to Mom with GPS.",
    signals: { routeDeviation: true, unexpectedStop: true, etaDelay: false, lateNightHours: true, unresponsiveTimer: true },
  },
  {
    id: "step6",
    stepNum: "06",
    title: "Mom's Live View",
    badge: "📱 Companion Dashboard",
    score: "Active Alert",
    view: "contact",
    description: "What trusted contact sees on their phone: Live telemetry, last known location, direct call.",
    signals: { routeDeviation: true, unexpectedStop: true, etaDelay: false, lateNightHours: true, unresponsiveTimer: true },
  },
  {
    id: "step7",
    stepNum: "07",
    title: "I'm Safe Confirmed",
    badge: "✓ Resolved",
    score: "Score: 1",
    view: "confirmed",
    description: "Passenger confirms safety. Companion dashboard and state machine return to normal.",
    signals: { routeDeviation: false, unexpectedStop: false, etaDelay: false, lateNightHours: true, unresponsiveTimer: false },
  },
  {
    id: "step8",
    stepNum: "08",
    title: "Journey Complete",
    badge: "🎉 Arrived Safely",
    score: "Completed",
    view: "completed",
    description: "Destination reached. Checkpoints logged, history archived, companion notified.",
    signals: { routeDeviation: false, unexpectedStop: false, etaDelay: false, lateNightHours: true, unresponsiveTimer: false },
  },
];

interface PitchDemoControllerProps {
  currentView: string;
  onSelectStep: (step: PitchStep) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  isSplitView: boolean;
  onToggleSplitView: () => void;
  onOpenDataset: () => void;
}

export function PitchDemoController({
  currentView,
  onSelectStep,
  isOpen,
  onToggleOpen,
  isSplitView,
  onToggleSplitView,
  onOpenDataset,
}: PitchDemoControllerProps) {
  return (
    <>
      {/* Floating Demo Trigger Badge */}
      <div className="fixed bottom-5 right-5 z-[100] flex items-center gap-2">
        <button
          onClick={onToggleSplitView}
          className={cn(
            "hidden md:flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black shadow-lift transition-all",
            isSplitView
              ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
              : "border bg-surface hover:bg-muted text-foreground"
          )}
          title="Toggle Two-Screen Split Mode: Passenger + Mom's View side-by-side"
        >
          <Columns2 className="size-4 text-primary" />
          <span>{isSplitView ? "Exit Dual Screen" : "Dual Screen Demo"}</span>
        </button>

        <button
          onClick={onOpenDataset}
          className="hidden md:flex items-center gap-2 rounded-full border bg-surface px-4 py-2.5 text-xs font-black text-foreground shadow-lift hover:bg-muted transition-all"
        >
          <Database className="size-4 text-primary" />
          <span>Kerala Dataset</span>
        </button>

        <button
          onClick={onToggleOpen}
          className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-black text-primary-foreground shadow-lift hover:opacity-95 transition-all"
        >
          <Radio className="size-4 text-primary animate-pulse" />
          <span>5-Min Pitch Demo</span>
        </button>
      </div>

      {/* Expanded Pitch Control Drawer */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-20 md:bottom-20 z-[110] mx-auto max-w-4xl rounded-2xl border bg-surface/98 p-5 shadow-lift backdrop-blur-md animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[10px] font-black text-primary">
                  JUDGES PRESENTATION SCRIPT
                </span>
                <h4 className="font-extrabold text-sm sm:text-base">5-Minute Live Pitch Flow</h4>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Click any step to demonstrate the proactive Safety Anomaly Engine & Escalation System
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex text-xs font-bold gap-1"
                onClick={onToggleSplitView}
              >
                <Columns2 className="size-3.5 text-primary" />
                {isSplitView ? "Exit Split" : "Dual Screen"}
              </Button>
              <Button size="icon" variant="ghost" onClick={onToggleOpen}>
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {HACKATHON_PITCH_STEPS.map((step) => {
              const isActive = currentView === step.view;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    onSelectStep(step);
                  }}
                  className={cn(
                    "flex flex-col text-left p-3 rounded-xl border transition-all relative overflow-hidden",
                    isActive
                      ? "border-primary bg-primary-soft/70 ring-1 ring-primary shadow-soft"
                      : "bg-muted/40 hover:bg-muted/80 border-border"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-extrabold text-muted-foreground">
                      STEP {step.stepNum}
                    </span>
                    <span className="text-[10px] font-bold text-primary">{step.score}</span>
                  </div>
                  <p className="mt-1 font-black text-xs truncate">{step.title}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{step.badge}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
