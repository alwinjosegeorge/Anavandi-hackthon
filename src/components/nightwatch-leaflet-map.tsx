import React, { useEffect, useRef, useState } from "react";
import { LocateFixed, Navigation, ShieldCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// Declare Leaflet on window for dynamic client load
declare global {
  interface Window {
    L: any;
  }
}

interface NightwatchLeafletMapProps {
  compact?: boolean;
  deviation?: boolean;
  dark?: boolean;
  userPositionOverride?: [number, number];
  className?: string;
}

// Kochi to Kakkanad Route Coordinates
const ROUTE_POINTS: [number, number][] = [
  [9.9790, 76.2759], // Marine Drive (Start)
  [9.9750, 76.2785], // Menaka Junction
  [9.9714, 76.2842], // MG Road Metro (CP 1)
  [9.9820, 76.2880], // Kaloor approach
  [9.9988, 76.2927], // Kaloor Junction (CP 2)
  [10.0035, 76.3010], // JLN Stadium corridor
  [10.0076, 76.3073], // Palarivattom (CP 3)
  [10.0118, 76.3250], // Padamugal
  [10.0159, 76.3419], // Kakkanad (Destination)
];

const DEVIATION_POINTS: [number, number][] = [
  [9.9988, 76.2927], // Kaloor Junction detour start
  [9.9940, 76.3050], // Thammanam detour
  [9.9890, 76.3120], // Off-track position
];

const CHECKPOINTS = [
  { name: "Marine Drive", pos: [9.9790, 76.2759] as [number, number], time: "11:06 PM", status: "Started" },
  { name: "MG Road Metro", pos: [9.9714, 76.2842] as [number, number], time: "11:17 PM", status: "Verified" },
  { name: "Kaloor Junction", pos: [9.9988, 76.2927] as [number, number], time: "11:28 PM", status: "Resolved" },
  { name: "Palarivattom", pos: [10.0076, 76.3073] as [number, number], time: "11:35 PM", status: "Approaching" },
  { name: "Kakkanad", pos: [10.0159, 76.3419] as [number, number], time: "11:48 PM", status: "Destination" },
];

function loadLeafletScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return;
    if (window.L) {
      resolve(window.L);
      return;
    }
    const existing = document.getElementById("leaflet-script");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.id = "leaflet-script";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function NightwatchLeafletMap({
  compact = false,
  deviation = false,
  dark = false,
  userPositionOverride,
  className,
}: NightwatchLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // User position based on normal or deviation
  const userPos: [number, number] = userPositionOverride || (deviation ? [9.9890, 76.3120] : [10.0045, 76.3035]);

  useEffect(() => {
    let isMounted = true;

    loadLeafletScript().then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // If map already initialized, remove it first
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map centered between Kochi and Kakkanad
      const map = L.map(mapContainerRef.current, {
        center: userPos,
        zoom: compact ? 12 : 13,
        zoomControl: false,
        attributionControl: false,
      });

      // Add modern zoom control at top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Choose tile layer: Dark Matter for dark mode, Voyager for light mode
      const tileUrl = dark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      // Draw Planned Route Line
      if (deviation) {
        // Dashed planned route
        L.polyline(ROUTE_POINTS, {
          color: dark ? "#94a3b8" : "#64748b",
          weight: 4,
          dashArray: "6, 8",
          opacity: 0.7,
        }).addTo(map);

        // Alert deviated segment
        L.polyline(DEVIATION_POINTS, {
          color: "#f59e0b",
          weight: 6,
          opacity: 0.95,
        }).addTo(map);
      } else {
        // Glowing outline for normal route
        L.polyline(ROUTE_POINTS, {
          color: "#ea580c",
          weight: 9,
          opacity: 0.3,
        }).addTo(map);

        // Core route line in primary safety orange
        L.polyline(ROUTE_POINTS, {
          color: "#f97316",
          weight: 5,
          opacity: 0.95,
          lineJoin: "round",
          lineCap: "round",
        }).addTo(map);
      }

      // Add Checkpoint Markers
      CHECKPOINTS.forEach((cp, idx) => {
        const isStart = idx === 0;
        const isEnd = idx === CHECKPOINTS.length - 1;

        const iconHtml = isStart
          ? `<div style="background:#16a34a;color:white;width:24px;height:24px;border-radius:999px;display:grid;place-items:center;font-size:10px;font-weight:900;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;">A</div>`
          : isEnd
          ? `<div style="background:#ea580c;color:white;width:24px;height:24px;border-radius:999px;display:grid;place-items:center;font-size:10px;font-weight:900;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;">B</div>`
          : `<div style="background:${dark ? '#0f172a' : '#ffffff'};color:#f97316;border:2px solid #f97316;width:16px;height:16px;border-radius:999px;box-shadow:0 2px 6px rgba(0,0,0,0.2);"></div>`;

        const cpIcon = L.divIcon({
          html: iconHtml,
          className: "custom-cp-marker",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(cp.pos, { icon: cpIcon }).addTo(map);
        marker.bindPopup(
          `<div style="font-family:sans-serif;padding:4px 2px;">
            <div style="font-weight:800;font-size:13px;color:#0f172a;">${cp.name}</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px;">ETA: ${cp.time} · ${cp.status}</div>
          </div>`
        );
      });

      // Add Live User Pulse Marker
      const userPulseHtml = `
        <div style="position:relative;width:32px;height:32px;display:grid;place-items:center;">
          <div style="position:absolute;inset:0;border-radius:999px;background:${deviation ? 'rgba(245,158,11,0.35)' : 'rgba(249,115,22,0.35)'};animation:leaflet-pulse 2s infinite;"></div>
          <div style="width:14px;height:14px;border-radius:999px;background:${deviation ? '#f59e0b' : '#f97316'};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);position:relative;z-index:2;"></div>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userPulseHtml,
        className: "custom-user-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const userMarker = L.marker(userPos, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
      userMarker.bindPopup(
        `<div style="font-family:sans-serif;padding:4px 2px;">
          <div style="font-weight:800;font-size:13px;color:${deviation ? '#b45309' : '#ea580c'};">
            ${deviation ? 'Route Deviation Detected' : 'Alwin (Live)'}
          </div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">
            ${deviation ? 'Off-route near Kaloor · Attention Needed' : 'Journey on track · 62% completed'}
          </div>
        </div>`
      );

      // Fit bounds nicely so the whole corridor or user area is visible
      if (compact) {
        map.setView(userPos, 12.5);
      } else {
        const bounds = L.latLngBounds(ROUTE_POINTS);
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      mapInstanceRef.current = map;
      setIsLoaded(true);

      // Invalidate size after short delay to handle tabs / animation resizing
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [dark, deviation, compact, userPos[0], userPos[1]]);

  // Re-center on user position
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(userPos, 14, { duration: 0.8 });
    }
  };

  return (
    <div className={cn("relative overflow-hidden w-full bg-muted/20", compact ? "h-64" : "h-full min-h-[380px]", className)}>
      <style>{`
        @keyframes leaflet-pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          70% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        .leaflet-container {
          width: 100%;
          height: 100%;
          background: ${dark ? "#0f172a" : "#f8fafc"};
          font-family: inherit;
        }
        .custom-user-marker, .custom-cp-marker {
          background: transparent;
          border: none;
        }
      `}</style>

      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Loading Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface/70 backdrop-blur-sm">
          <Navigation className="size-8 text-primary animate-spin" />
          <p className="mt-2 text-xs font-bold text-muted-foreground">Loading Leaflet Map...</p>
        </div>
      )}

      {/* Route Badge in Corner */}
      <div className="absolute left-3 top-3 z-[400] flex items-center gap-2 rounded-md bg-surface/95 px-3 py-1.5 text-xs font-bold shadow-soft backdrop-blur border">
        {deviation ? (
          <span className="flex items-center gap-1.5 text-warning font-black">
            <AlertTriangle className="size-3.5" /> Route Detour
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-primary font-black">
            <ShieldCheck className="size-3.5 text-success" /> Kochi · Kakkanad
          </span>
        )}
      </div>

      {/* Locate Me Button */}
      <button
        type="button"
        onClick={handleRecenter}
        aria-label="Center on live location"
        className="absolute bottom-3 right-3 z-[400] grid size-10 place-items-center rounded-full bg-surface shadow-lift border text-primary hover:bg-primary/10 transition-colors"
      >
        <LocateFixed className="size-4" />
      </button>
    </div>
  );
}
