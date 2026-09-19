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

export function PitchDemoController(_props: PitchDemoControllerProps) {
  return null;
}
