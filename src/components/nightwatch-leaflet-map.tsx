import React, { useEffect, useRef, useState } from "react";
import { LocateFixed, Navigation, ShieldCheck, AlertTriangle, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

// Declare Leaflet on window for dynamic client load
declare global {
  interface Window {
    L: any;
  }
}

export interface LocationPoint {
  name: string;
  detail?: string;
  coords: [number, number];
}

interface NightwatchLeafletMapProps {
  compact?: boolean;
  deviation?: boolean;
  dark?: boolean;
  from?: LocationPoint;
  to?: LocationPoint;
  userPositionOverride?: [number, number];
  className?: string;
}

// Default Kochi to Kakkanad Route Coordinates
const DEFAULT_ROUTE_POINTS: [number, number][] = [
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
  from,
  to,
  userPositionOverride,
  className,
}: NightwatchLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // Default to satellite view as requested by user
  const [mapType, setMapType] = useState<"satellite" | "street">("satellite");

  // Determine active start and end coordinates
  const startCoords: [number, number] = from ? from.coords : [9.9790, 76.2759];
  const endCoords: [number, number] = to ? to.coords : [10.0159, 76.3419];

  // Dynamic route points connecting Start -> intermediate waypoints -> End
  const routePoints: [number, number][] = React.useMemo(() => {
    if (!from && !to) return DEFAULT_ROUTE_POINTS;
    // If customized points, build road path connecting them
    const points: [number, number][] = [startCoords];
    // Include intermediate corridor points if route spans Kochi central
    DEFAULT_ROUTE_POINTS.forEach((pt) => {
      const isStartClose = Math.hypot(pt[0] - startCoords[0], pt[1] - startCoords[1]) < 0.005;
      const isEndClose = Math.hypot(pt[0] - endCoords[0], pt[1] - endCoords[1]) < 0.005;
      if (!isStartClose && !isEndClose) {
        points.push(pt);
      }
    });
    points.push(endCoords);
    return points;
  }, [startCoords[0], startCoords[1], endCoords[0], endCoords[1]]);

  // User position based on normal or deviation
  const userPos: [number, number] = userPositionOverride || (
    deviation
      ? [9.9890, 76.3120]
      : [
          (startCoords[0] + endCoords[0]) / 2 + 0.002,
          (startCoords[1] + endCoords[1]) / 2 + 0.002,
        ]
  );

  useEffect(() => {
    let isMounted = true;

    loadLeafletScript().then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: userPos,
        zoom: compact ? 12 : 13,
        zoomControl: false,
        attributionControl: false,
      });

      // Zoom control at top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Tile layers: Satellite (Esri World Imagery) vs Street (CartoDB)
      if (mapType === "satellite") {
        // High-resolution Satellite Imagery
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
          maxZoom: 19,
        }).addTo(map);

        // Hybrid Road & Place Labels Overlay
        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
          subdomains: "abcd",
          opacity: 0.85,
        }).addTo(map);
      } else {
        // Street Map
        const streetUrl = dark
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

        L.tileLayer(streetUrl, {
          maxZoom: 19,
          subdomains: "abcd",
        }).addTo(map);
      }

      // Draw Planned / Active Route Line
      if (deviation) {
        L.polyline(routePoints, {
          color: "#94a3b8",
          weight: 4,
          dashArray: "6, 8",
          opacity: 0.8,
        }).addTo(map);

        L.polyline(DEVIATION_POINTS, {
          color: "#f59e0b",
          weight: 6,
          opacity: 0.95,
        }).addTo(map);
      } else {
        // Outer glowing outline
        L.polyline(routePoints, {
          color: "#ea580c",
          weight: 10,
          opacity: mapType === "satellite" ? 0.45 : 0.3,
        }).addTo(map);

        // Core sharp route polyline
        L.polyline(routePoints, {
          color: "#f97316",
          weight: 5,
          opacity: 1,
          lineJoin: "round",
          lineCap: "round",
        }).addTo(map);
      }

      // Custom Start (A) Marker
      const startIcon = L.divIcon({
        html: `<div style="background:#16a34a;color:white;width:28px;height:28px;border-radius:999px;display:grid;place-items:center;font-size:11px;font-weight:900;box-shadow:0 3px 10px rgba(0,0,0,0.5);border:2.5px solid white;">A</div>`,
        className: "custom-pin-marker",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const startMarker = L.marker(startCoords, { icon: startIcon }).addTo(map);
      startMarker.bindPopup(
        `<div style="font-family:sans-serif;padding:4px 2px;">
          <div style="font-weight:800;font-size:13px;color:#16a34a;">Start Location</div>
          <div style="font-size:11px;color:#334155;margin-top:2px;">${from ? from.name : "Marine Drive, Kochi"}</div>
        </div>`
      );

      // Custom Destination (B) Marker
      const endIcon = L.divIcon({
        html: `<div style="background:#ea580c;color:white;width:28px;height:28px;border-radius:999px;display:grid;place-items:center;font-size:11px;font-weight:900;box-shadow:0 3px 10px rgba(0,0,0,0.5);border:2.5px solid white;">B</div>`,
        className: "custom-pin-marker",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const endMarker = L.marker(endCoords, { icon: endIcon }).addTo(map);
      endMarker.bindPopup(
        `<div style="font-family:sans-serif;padding:4px 2px;">
          <div style="font-weight:800;font-size:13px;color:#ea580c;">Destination</div>
          <div style="font-size:11px;color:#334155;margin-top:2px;">${to ? to.name : "Kakkanad, Kochi"}</div>
        </div>`
      );

      // Intermediate Checkpoint Markers along the route
      if (routePoints.length > 2) {
        const midPoints = routePoints.slice(1, -1);
        midPoints.forEach((pt, i) => {
          const cpIcon = L.divIcon({
            html: `<div style="background:#ffffff;color:#f97316;border:2px solid #f97316;width:16px;height:16px;border-radius:999px;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
            className: "custom-cp-marker",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });
          const m = L.marker(pt, { icon: cpIcon }).addTo(map);
          m.bindPopup(
            `<div style="font-family:sans-serif;padding:4px 2px;">
              <div style="font-weight:800;font-size:12px;color:#0f172a;">Safety Checkpoint ${i + 1}</div>
              <div style="font-size:11px;color:#64748b;margin-top:2px;">Corridor Monitoring Active</div>
            </div>`
          );
        });
      }

      // Live User Pulse Marker
      const userPulseHtml = `
        <div style="position:relative;width:34px;height:34px;display:grid;place-items:center;">
          <div style="position:absolute;inset:0;border-radius:999px;background:${deviation ? 'rgba(245,158,11,0.45)' : 'rgba(249,115,22,0.45)'};animation:leaflet-pulse 2s infinite;"></div>
          <div style="width:14px;height:14px;border-radius:999px;background:${deviation ? '#f59e0b' : '#f97316'};border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.6);position:relative;z-index:2;"></div>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userPulseHtml,
        className: "custom-user-marker",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const userMarker = L.marker(userPos, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
      userMarker.bindPopup(
        `<div style="font-family:sans-serif;padding:4px 2px;">
          <div style="font-weight:800;font-size:13px;color:${deviation ? '#b45309' : '#ea580c'};">
            ${deviation ? 'Route Deviation Detected' : 'Alwin (Live Journey)'}
          </div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">
            ${deviation ? 'Off-route near Kaloor · Attention Needed' : 'Journey on track · Speed 38 km/h'}
          </div>
        </div>`
      );

      // Fit bounds to show start, end, and user position
      const bounds = L.latLngBounds([startCoords, endCoords, userPos]);
      map.fitBounds(bounds, { padding: compact ? [30, 30] : [50, 50] });

      mapInstanceRef.current = map;
      setIsLoaded(true);

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
  }, [mapType, dark, deviation, compact, startCoords[0], startCoords[1], endCoords[0], endCoords[1], userPos[0], userPos[1]]);

  // Re-center on live user location
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(userPos, 14, { duration: 0.8 });
    }
  };

  return (
    <div className={cn("relative overflow-hidden w-full bg-slate-900", compact ? "h-64" : "h-full min-h-[380px]", className)}>
      <style>{`
        @keyframes leaflet-pulse {
          0% { transform: scale(0.8); opacity: 0.85; }
          70% { transform: scale(2.3); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0.85; }
        }
        .leaflet-container {
          width: 100%;
          height: 100%;
          background: #0f172a;
          font-family: inherit;
        }
        .custom-user-marker, .custom-cp-marker, .custom-pin-marker {
          background: transparent;
          border: none;
        }
      `}</style>

      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Loading Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm text-white">
          <Navigation className="size-8 text-primary animate-spin" />
          <p className="mt-2 text-xs font-bold text-slate-300">Loading Satellite Map...</p>
        </div>
      )}

      {/* Route Badge in Top-Left Corner */}
      <div className="absolute left-3 top-3 z-[400] flex items-center gap-2 rounded-lg bg-surface/95 px-3 py-1.5 text-xs font-bold shadow-soft backdrop-blur border">
        {deviation ? (
          <span className="flex items-center gap-1.5 text-warning font-black">
            <AlertTriangle className="size-3.5" /> Route Detour
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-foreground font-black truncate max-w-[200px]">
            <ShieldCheck className="size-3.5 text-success shrink-0" />
            <span className="truncate">{from ? from.name : "Kochi"} → {to ? to.name : "Kakkanad"}</span>
          </span>
        )}
      </div>

      {/* Satellite vs Street Toggle in Top-Right Corner */}
      <div className="absolute right-3 top-14 z-[400]">
        <button
          type="button"
          onClick={() => setMapType(mapType === "satellite" ? "street" : "satellite")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-extrabold shadow-lift backdrop-blur transition-all",
            mapType === "satellite"
              ? "bg-foreground text-primary-foreground border-primary/40 shadow-glow"
              : "bg-surface/95 text-foreground hover:bg-surface"
          )}
          title="Toggle Satellite / Street View"
        >
          <Layers className="size-3.5 text-primary" />
          <span>{mapType === "satellite" ? "🛰️ Satellite" : "🗺️ Street"}</span>
        </button>
      </div>

      {/* Locate Me Button at Bottom-Right */}
      <button
        type="button"
        onClick={handleRecenter}
        aria-label="Center on live location"
        className="absolute bottom-3 right-3 z-[400] grid size-10 place-items-center rounded-full bg-surface/95 shadow-lift border text-primary hover:bg-primary/10 transition-colors"
      >
        <LocateFixed className="size-4" />
      </button>
    </div>
  );
}
