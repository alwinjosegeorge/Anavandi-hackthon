import React from "react";
import { AlertTriangle, Clock3, Navigation, Route as RouteIcon, Shield, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnomalySignals {
  routeDeviation: boolean; // +2
  unexpectedStop: boolean; // +2
  etaDelay: boolean; // +1
  lateNightHours: boolean; // +1
  unresponsiveTimer: boolean; // +2
}

export interface AnomalyScoreResult {
  score: number;
  level: "normal" | "attention" | "checkin" | "escalated";
  title: string;
  description: string;
  colorClass: string;
  bgClass: string;
  badgeTone: "success" | "warning" | "danger";
}

/**
 * Deterministic Safety Anomaly Engine
 * Calculates risk index (0 - 8) based on observable journey conditions.
 */
export function calculateAnomalyScore(signals: AnomalySignals): AnomalyScoreResult {
  let score = 0;

  if (signals.lateNightHours) score += 1;
  if (signals.etaDelay) score += 1;
  if (signals.routeDeviation) score += 2;
  if (signals.unexpectedStop) score += 2;
  if (signals.unresponsiveTimer) score += 2;

  // Level 0: 0 - 2 Normal
  // Level 1: 3 - 4 Attention
  // Level 2: 5 - 6 Check-in Required
  // Level 3: 7+ Escalated
  if (score <= 2) {
    return {
      score,
      level: "normal",
      title: "🟢 Level 0: Normal",
      description: "Journey parameters within normal corridor boundaries.",
      colorClass: "text-success",
      bgClass: "bg-success/10 border-success/30",
      badgeTone: "success",
    };
  } else if (score <= 4) {
    return {
      score,
      level: "attention",
      title: "🟡 Level 1: Attention Needed",
      description: "Single anomaly detected (route variation or minor delay).",
      colorClass: "text-warning",
      bgClass: "bg-warning/10 border-warning/30",
      badgeTone: "warning",
    };
  } else if (score <= 6) {
    return {
      score,
      level: "checkin",
      title: "🟠 Level 2: Safety Check Required",
      description: "Multiple anomalies detected. Prompting passenger check-in (30s timer).",
      colorClass: "text-warning-foreground",
      bgClass: "bg-warning-soft border-warning/40",
      badgeTone: "warning",
    };
  } else {
    return {
      score,
      level: "escalated",
      title: "🔴 Level 3: Escalated / Alert Sent",
      description: "Check-in unresponsive. Alert dispatched to Trusted Companion & KSRTC helpline.",
      colorClass: "text-danger",
      bgClass: "bg-danger-soft border-danger/40",
      badgeTone: "danger",
    };
  }
}

interface AnomalyEngineWidgetProps {
  signals: AnomalySignals;
  onToggleSignal?: (key: keyof AnomalySignals) => void;
  interactive?: boolean;
  compact?: boolean;
}

export function AnomalyEngineWidget({
  signals,
  onToggleSignal,
  interactive = false,
  compact = false,
}: AnomalyEngineWidgetProps) {
  const result = calculateAnomalyScore(signals);

  const signalItems = [
    {
      key: "lateNightHours" as const,
      label: "Late-night corridor window (10 PM - 5 AM)",
      weight: "+1",
      active: signals.lateNightHours,
      icon: Clock3,
    },
    {
      key: "etaDelay" as const,
      label: "ETA Delay (> 15 min anomaly)",
      weight: "+1",
      active: signals.etaDelay,
      icon: Navigation,
    },
    {
      key: "routeDeviation" as const,
      label: "Route deviation off designated highway",
      weight: "+2",
      active: signals.routeDeviation,
      icon: RouteIcon,
    },
    {
      key: "unexpectedStop" as const,
      label: "Stationary stop (> 10 min without transit hub)",
      weight: "+2",
      active: signals.unexpectedStop,
      icon: AlertTriangle,
    },
    {
      key: "unresponsiveTimer" as const,
      label: "Unresponsive safety check-in",
      weight: "+2",
      active: signals.unresponsiveTimer,
      icon: ShieldAlert,
    },
  ];

  return (
    <div className={cn("rounded-2xl border bg-surface p-4 sm:p-5 shadow-soft", result.bgClass)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className={cn("size-5", result.colorClass)} />
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Automated Safety Engine
            </p>
            <h4 className="font-extrabold text-sm sm:text-base">{result.title}</h4>
          </div>
        </div>
        <div className="flex items-baseline gap-1 text-right">
          <span className={cn("font-black text-2xl sm:text-3xl", result.colorClass)}>
            {result.score}
          </span>
          <span className="text-xs font-bold text-muted-foreground">/ 8</span>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground font-medium">{result.description}</p>

      {/* Progress meter bar */}
      <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-muted/60">
        <div
          className={cn(
            "h-full transition-all duration-500",
            result.score <= 2 && "bg-success",
            result.score > 2 && result.score <= 4 && "bg-warning",
            result.score > 4 && result.score <= 6 && "bg-warning-foreground",
            result.score > 6 && "bg-danger"
          )}
          style={{ width: `${Math.min(100, (result.score / 8) * 100)}%` }}
        />
      </div>

      {/* Signals Breakdown */}
      {!compact && (
        <div className="mt-4 space-y-2 border-t pt-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
            <span>OBSERVABLE JOURNEY SIGNALS</span>
            <span>WEIGHT</span>
          </div>
          {signalItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                onClick={() => interactive && onToggleSignal && onToggleSignal(item.key)}
                className={cn(
                  "flex items-center justify-between rounded-lg p-2 text-xs transition-colors",
                  interactive && "cursor-pointer hover:bg-muted/70",
                  item.active ? "bg-surface font-bold text-foreground shadow-xs border" : "text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className={cn("size-3.5", item.active ? result.colorClass : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </div>
                <span className={cn("font-black text-[11px]", item.active ? result.colorClass : "text-muted-foreground")}>
                  {item.active ? item.weight : "0"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
