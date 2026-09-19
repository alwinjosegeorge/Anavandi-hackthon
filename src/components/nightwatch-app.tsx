import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  Bell,
  Bus,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  ContactRound,
  History,
  Home,
  LocateFixed,
  MapPin,
  Menu,
  Navigation,
  Phone,
  Plus,
  Route as RouteIcon,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Moon,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { NightwatchLeafletMap, type LocationPoint } from "@/components/nightwatch-leaflet-map";

type View =
  | "splash" | "onboarding" | "home" | "plan" | "active" | "safety" | "deviation"
  | "stopped" | "check" | "confirmed" | "missed" | "completed" | "contact"
  | "notifications" | "history" | "details" | "contacts" | "settings" | "empty"
  | "offline" | "location";

const demoViews: { label: string; view: View }[] = [
  { label: "Home", view: "home" }, { label: "Plan", view: "plan" }, { label: "Normal", view: "active" },
  { label: "Deviation", view: "deviation" }, { label: "Unexpected stop", view: "stopped" },
  { label: "Safety check", view: "check" }, { label: "Missed check-in", view: "missed" },
  { label: "SOS", view: "active" }, { label: "Completed", view: "completed" },
  { label: "Mom's view", view: "contact" }, { label: "History", view: "history" },
  { label: "Notifications", view: "notifications" }, { label: "Settings", view: "settings" },
  { label: "Empty states", view: "empty" },
];

function StatusDot({ tone = "success" }: { tone?: "success" | "warning" | "danger" }) {
  return <span className={cn("inline-block size-2 rounded-full", tone === "success" && "bg-success", tone === "warning" && "bg-warning", tone === "danger" && "bg-danger")} />;
}



function Header({ title, back, right }: { title: string; back?: () => void; right?: React.ReactNode }) {
  return (
    <header className="grid h-16 grid-cols-[44px_minmax(0,1fr)_44px] items-center px-4">
      {back ? <Button aria-label="Go back" size="icon" variant="ghost" onClick={back}><ArrowLeft /></Button> : <span />}
      <h1 className="truncate text-center text-base font-bold">{title}</h1>
      <div className="flex justify-end">{right}</div>
    </header>
  );
}

function DesktopNavBar({
  view,
  go,
  dark,
  setDark,
  setSos,
}: {
  view: View;
  go: (next: View) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
  setSos: (s: "closed" | "confirm" | "sent") => void;
}) {
  const links: { label: string; view: View; icon: LucideIcon }[] = [
    { label: "Home", view: "home", icon: Home },
    { label: "Plan Route", view: "plan", icon: RouteIcon },
    { label: "Live Journey", view: "active", icon: Navigation },
    { label: "Safety", view: "safety", icon: ShieldCheck },
    { label: "History", view: "history", icon: History },
    { label: "Contacts", view: "contacts", icon: Users },
    { label: "Settings", view: "settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b bg-surface/95 px-3 sm:px-6 lg:px-8 backdrop-blur shadow-sm hidden md:flex items-center justify-between">
      <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => go("home")}>
        <div className="grid size-9 sm:size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
          <ShieldCheck className="size-5 sm:size-6" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-base sm:text-lg tracking-tight">NIGHTWATCH</span>
            <span className="rounded-full bg-primary-soft px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold text-primary">
              ആനവണ്ടി
            </span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold">Kerala Night Transit Safety</p>
        </div>
      </div>

      <nav className="flex items-center gap-0.5 xl:gap-1">
        {links.map(({ label, view: target, icon: Icon }) => {
          const isActive = view === target;
          return (
            <button
              key={label}
              onClick={() => go(target)}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2 xl:px-3 py-1.5 text-xs font-bold transition-all shrink-0",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 xl:gap-3 shrink-0">
        <button
          onClick={() => go("safety")}
          className="hidden sm:flex items-center gap-1.5 rounded-full border bg-muted/60 px-2.5 py-1.5 text-xs font-bold hover:bg-muted transition-colors"
        >
          <span className="size-2 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] font-bold">Systems Ready</span>
        </button>

        <Button
          variant="destructive"
          size="sm"
          className="font-extrabold text-xs shadow-soft px-3"
          onClick={() => setSos("confirm")}
        >
          <Phone className="size-3.5 mr-1" /> SOS
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setDark(!dark)}
          className="size-8 sm:size-9 rounded-lg"
          title="Toggle Dark Mode"
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </header>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div><p className="text-lg font-extrabold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>;
}

function Timeline({ detailed = false }: { detailed?: boolean }) {
  const events = detailed ? [
    ["Journey started", "11:06 PM · Marine Drive"], ["Checkpoint 1 passed", "11:17 PM · MG Road"],
    ["Route deviation resolved", "11:28 PM · You confirmed safe"], ["Checkpoint 2 passed", "11:35 PM · Palarivattom"],
    ["Arrived safely", "11:48 PM · Kakkanad"],
  ] : [["Kochi", "11:06 PM"], ["MG Road", "11:17 PM"], ["Palarivattom", "11:35 PM"], ["Kakkanad", "11:48 PM"]];
  return <div className="space-y-0">{events.map(([name, time], i) => <div key={name} className="grid grid-cols-[20px_1fr] gap-3"><div className="flex flex-col items-center"><span className={cn("mt-1 size-3 rounded-full border-2", i < events.length - 1 ? "border-primary bg-primary" : "border-success bg-success")} />{i < events.length - 1 && <span className="h-12 w-px bg-border" />}</div><div><p className="text-sm font-semibold">{name}</p><p className="text-xs text-muted-foreground">{time}</p></div></div>)}</div>;
}

export const KERALA_BUS_STANDS: LocationPoint[] = [
  // Thiruvananthapuram
  { name: "Thampanoor KSRTC Central", detail: "KSRTC Central Bus Terminal · Thiruvananthapuram", coords: [8.4875, 76.9525] },
  { name: "East Fort (Kizhakke Kotta)", detail: "City Bus Terminal · Thiruvananthapuram", coords: [8.4830, 76.9480] },
  { name: "Attingal KSRTC Bus Stand", detail: "KSRTC Sub Depot · Thiruvananthapuram", coords: [8.6948, 76.8152] },
  { name: "Nedumangad KSRTC Stand", detail: "KSRTC Depot · Thiruvananthapuram", coords: [8.6015, 77.0016] },
  { name: "Neyyattinkara KSRTC Stand", detail: "KSRTC Depot · Thiruvananthapuram", coords: [8.4005, 77.0864] },

  // Kollam
  { name: "Kollam KSRTC Bus Terminal", detail: "Chinnakada KSRTC Depot · Kollam", coords: [8.8870, 76.5910] },
  { name: "Andamukkam Private Bus Stand", detail: "Town Bus Stand · Kollam", coords: [8.8850, 76.5860] },
  { name: "Karunagappally KSRTC Stand", detail: "KSRTC Depot · Kollam", coords: [9.0560, 76.5360] },
  { name: "Kottarakkara KSRTC Stand", detail: "KSRTC Depot · Kollam", coords: [8.9980, 76.7720] },
  { name: "Punalur KSRTC Bus Stand", detail: "KSRTC Sub Depot · Kollam", coords: [9.0190, 76.9280] },

  // Pathanamthitta
  { name: "Pathanamthitta KSRTC Stand", detail: "District KSRTC Depot · Pathanamthitta", coords: [9.2660, 76.7860] },
  { name: "Adoor KSRTC Bus Station", detail: "KSRTC Depot · Pathanamthitta", coords: [9.1530, 76.7320] },
  { name: "Thiruvalla KSRTC Terminal", detail: "KSRTC Bus Terminal · Pathanamthitta", coords: [9.3830, 76.5740] },
  { name: "Pandalam KSRTC Bus Stand", detail: "KSRTC Stand · Pathanamthitta", coords: [9.2270, 76.6780] },
  { name: "Ranni KSRTC Bus Stand", detail: "KSRTC Stand · Pathanamthitta", coords: [9.3820, 76.7890] },

  // Alappuzha
  { name: "Alappuzha KSRTC Bus Station", detail: "Boat Jetty Road KSRTC · Alappuzha", coords: [9.4920, 76.3320] },
  { name: "Cherthala KSRTC Bus Station", detail: "KSRTC Depot · Alappuzha", coords: [9.6860, 76.3370] },
  { name: "Kayamkulam KSRTC Bus Station", detail: "KSRTC Depot · Alappuzha", coords: [9.1740, 76.4980] },
  { name: "Mavelikkara KSRTC Stand", detail: "KSRTC Sub Depot · Alappuzha", coords: [9.2670, 76.5510] },
  { name: "Haripad KSRTC Bus Station", detail: "KSRTC Depot · Alappuzha", coords: [9.2880, 76.4630] },

  // Kottayam
  { name: "Kottayam KSRTC Bus Terminal", detail: "Main KSRTC Depot · Kottayam", coords: [9.5870, 76.5230] },
  { name: "Changanassery KSRTC Stand", detail: "KSRTC Bus Station · Kottayam", coords: [9.4440, 76.5400] },
  { name: "Pala KSRTC Bus Station", detail: "KSRTC Depot · Kottayam", coords: [9.7120, 76.6830] },
  { name: "Vaikom KSRTC Bus Station", detail: "KSRTC Sub Depot · Kottayam", coords: [9.7490, 76.3960] },
  { name: "Erumely KSRTC Bus Stand", detail: "Pilgrim Transit Stand · Kottayam", coords: [9.5760, 76.8480] },

  // Idukki
  { name: "Thodupuzha KSRTC Bus Station", detail: "KSRTC Depot · Idukki", coords: [9.8970, 76.7140] },
  { name: "Munnar KSRTC Bus Station", detail: "Hill Station KSRTC Depot · Idukki", coords: [10.0889, 77.0595] },
  { name: "Kattappana KSRTC Stand", detail: "KSRTC Bus Station · Idukki", coords: [9.7520, 77.1180] },
  { name: "Kumily KSRTC Bus Station", detail: "Thekkady Border KSRTC · Idukki", coords: [9.6050, 77.1650] },
  { name: "Adimali Bus Stand", detail: "KSRTC & Private Stand · Idukki", coords: [10.0130, 76.9530] },

  // Ernakulam
  { name: "Vyttila Mobility Hub", detail: "KSRTC, Metro & Water Metro · Ernakulam", coords: [9.9698, 76.3190] },
  { name: "Ernakulam KSRTC Bus Station", detail: "KSRTC Stand Road, Karikkamuri · Ernakulam", coords: [9.9720, 76.2890] },
  { name: "Kaloor Private Bus Terminal", detail: "Main City Bus Terminal · Ernakulam", coords: [9.9988, 76.2927] },
  { name: "Aluva KSRTC & Private Stand", detail: "Railway & Metro Hub · Ernakulam", coords: [10.1076, 76.3516] },
  { name: "Angamaly KSRTC Bus Station", detail: "KSRTC Depot · Ernakulam", coords: [10.1960, 76.3860] },
  { name: "Perumbavoor KSRTC Stand", detail: "KSRTC Depot · Ernakulam", coords: [10.1140, 76.4800] },
  { name: "Muvattupuzha KSRTC Stand", detail: "KSRTC Depot · Ernakulam", coords: [9.9830, 76.5770] },
  { name: "Kothamangalam KSRTC Stand", detail: "KSRTC Depot · Ernakulam", coords: [10.0630, 76.6280] },
  { name: "North Paravur KSRTC Stand", detail: "KSRTC Sub Depot · Ernakulam", coords: [10.1470, 76.2310] },
  { name: "Fort Kochi Bus Stand", detail: "Heritage City Stand · Ernakulam", coords: [9.9658, 76.2425] },

  // Thrissur
  { name: "Thrissur KSRTC Bus Terminal", detail: "Near Railway Station · Thrissur", coords: [10.5180, 76.2130] },
  { name: "Sakthan Thampuran Bus Stand", detail: "South Private Bus Terminal · Thrissur", coords: [10.5120, 76.2190] },
  { name: "Vadakke Stand (North Stand)", detail: "North City Bus Stand · Thrissur", coords: [10.5280, 76.2160] },
  { name: "Guruvayur KSRTC Bus Station", detail: "Temple Town KSRTC Stand · Thrissur", coords: [10.5950, 76.0400] },
  { name: "Chalakudy KSRTC Bus Station", detail: "KSRTC Depot · Thrissur", coords: [10.3060, 76.3330] },
  { name: "Kodungallur Bus Stand", detail: "KSRTC & Private Stand · Thrissur", coords: [10.2240, 76.1980] },
  { name: "Irinjalakuda KSRTC Stand", detail: "KSRTC Sub Depot · Thrissur", coords: [10.3450, 76.2080] },

  // Palakkad
  { name: "Palakkad KSRTC Bus Station", detail: "Main KSRTC Depot · Palakkad", coords: [10.7760, 76.6540] },
  { name: "Palakkad Stadium Bus Stand", detail: "Private Bus Terminal · Palakkad", coords: [10.7810, 76.6560] },
  { name: "Ottapalam KSRTC Bus Station", detail: "KSRTC Depot · Palakkad", coords: [10.7720, 76.3780] },
  { name: "Mannarkkad KSRTC Stand", detail: "KSRTC Sub Depot · Palakkad", coords: [10.9880, 76.4580] },
  { name: "Chittur KSRTC Bus Stand", detail: "KSRTC Stand · Palakkad", coords: [10.7020, 76.7190] },
  { name: "Vadakkencherry Bus Stand", detail: "Highway Junction Stand · Palakkad", coords: [10.5960, 76.5020] },

  // Malappuram
  { name: "Malappuram KSRTC Bus Station", detail: "Valakkulam Depot · Malappuram", coords: [11.0510, 76.0710] },
  { name: "Manjeri Municipal Bus Terminal", detail: "KSRTC & Municipal Stand · Malappuram", coords: [11.1210, 76.1240] },
  { name: "Perinthalmanna KSRTC Stand", detail: "KSRTC Sub Depot · Malappuram", coords: [10.9780, 76.2260] },
  { name: "Tirur KSRTC & Municipal Stand", detail: "Town Bus Stand · Malappuram", coords: [10.9160, 75.9240] },
  { name: "Ponnani KSRTC Bus Station", detail: "Coastal KSRTC Depot · Malappuram", coords: [10.7740, 75.9260] },
  { name: "Nilambur KSRTC Bus Station", detail: "Forest Valley KSRTC Stand · Malappuram", coords: [11.2770, 76.2270] },
  { name: "Kottakkal Bus Stand", detail: "Arya Vaidya Sala Town Stand · Malappuram", coords: [10.9980, 75.9980] },

  // Kozhikode
  { name: "Kozhikode KSRTC Terminal", detail: "Mavoor Road KSRTC Complex · Kozhikode", coords: [11.2580, 75.7920] },
  { name: "Palayam Bus Stand", detail: "City Bus Terminal · Kozhikode", coords: [11.2490, 75.7860] },
  { name: "Kozhikode New Bus Stand", detail: "Indira Gandhi Road · Kozhikode", coords: [11.2590, 75.7960] },
  { name: "Vadakara KSRTC Bus Station", detail: "KSRTC Depot · Kozhikode", coords: [11.6040, 75.5920] },
  { name: "Thamarassery KSRTC Stand", detail: "Ghat Road Transit KSRTC · Kozhikode", coords: [11.4170, 75.9360] },
  { name: "Koyilandy KSRTC Bus Stand", detail: "KSRTC Stand · Kozhikode", coords: [11.4420, 75.6960] },

  // Wayanad
  { name: "Sulthan Bathery KSRTC Depot", detail: "Interstate Transit Depot · Wayanad", coords: [11.6640, 76.2570] },
  { name: "Kalpetta KSRTC Bus Station", detail: "District Headquarter Stand · Wayanad", coords: [11.6070, 76.0820] },
  { name: "Mananthavady KSRTC Stand", detail: "North Wayanad Depot · Wayanad", coords: [11.8020, 76.0040] },
  { name: "Vythiri Bus Stand", detail: "Gateway Transit Stand · Wayanad", coords: [11.5510, 76.0410] },

  // Kannur
  { name: "Kannur KSRTC Bus Terminal", detail: "Thavakkara KSRTC Complex · Kannur", coords: [11.8720, 75.3720] },
  { name: "Kannur Old Bus Stand", detail: "City Center Stand · Kannur", coords: [11.8680, 75.3670] },
  { name: "Thalassery KSRTC Bus Station", detail: "KSRTC Depot · Kannur", coords: [11.7500, 75.4920] },
  { name: "Payyanur KSRTC Bus Station", detail: "KSRTC Sub Depot · Kannur", coords: [12.1020, 75.2040] },
  { name: "Iritty KSRTC Bus Stand", detail: "Hill Highway Stand · Kannur", coords: [11.9790, 75.6690] },
  { name: "Taliparamba KSRTC Stand", detail: "National Highway Stand · Kannur", coords: [12.0460, 75.3620] },

  // Kasaragod
  { name: "Kasaragod KSRTC Bus Station", detail: "Railway Station Road · Kasaragod", coords: [12.5020, 74.9920] },
  { name: "Kasaragod New Bus Stand", detail: "Town Bus Stand · Kasaragod", coords: [12.5080, 74.9880] },
  { name: "Kanhangad KSRTC Bus Station", detail: "KSRTC Depot · Kasaragod", coords: [12.3160, 75.0930] },
  { name: "Nileshwaram Bus Stand", detail: "KSRTC & Private Stand · Kasaragod", coords: [12.2530, 75.1320] },
  { name: "Uppala Bus Stand", detail: "North Kasaragod Stand · Kasaragod", coords: [12.6880, 74.9080] },
];

export const KOCHI_LOCATIONS = KERALA_BUS_STANDS;

function calculateTripStats(from: LocationPoint, to: LocationPoint) {
  const lat1 = from.coords[0];
  const lon1 = from.coords[1];
  const lat2 = to.coords[0];
  const lon2 = to.coords[1];
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const crowdDistanceKm = R * c;
  // Realistic road factor for Kerala highways (~1.3x crow-flies)
  const distanceKm = Math.max(1.5, Math.round(crowdDistanceKm * 1.32 * 10) / 10);

  // Speed: ~25 km/h for local town trips, ~42 km/h for inter-district Kerala state bus
  let durationMins: number;
  if (distanceKm <= 20) {
    durationMins = Math.max(8, Math.round(distanceKm * 2.4 + 4));
  } else {
    durationMins = Math.round((distanceKm / 42) * 60 + 10);
  }

  const durationStr =
    durationMins >= 60
      ? `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`
      : `${durationMins} min`;

  const now = new Date();
  const etaDate = new Date(now.getTime() + durationMins * 60000);
  const etaHours = etaDate.getHours();
  const etaMinutes = etaDate.getMinutes().toString().padStart(2, "0");
  const ampm = etaHours >= 12 ? "PM" : "AM";
  const formattedHours = etaHours % 12 || 12;
  const etaStr = `${formattedHours}:${etaMinutes} ${ampm}`;

  return {
    distanceKm: `${distanceKm} km`,
    durationMins: durationStr,
    durationNumber: durationMins,
    eta: etaStr,
  };
}

export const DISTRICTS = [
  "All",
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

export function NightwatchApp() {
  const [view, setView] = useState<View>(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      return "home";
    }
    return "splash";
  });
  const [onboard, setOnboard] = useState(0);
  const [demoOpen, setDemoOpen] = useState(false);
  const [sos, setSos] = useState<"closed" | "confirm" | "sent">("closed");
  const [addContact, setAddContact] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // When visiting on laptop/desktop, land directly on the rich website view
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      if (view === "splash" || view === "onboarding") {
        setView("home");
      }
    }
  }, []);

  // Dynamic Departure and Destination states (Default: Thampanoor KSRTC Central -> Vyttila Mobility Hub)
  const [fromLoc, setFromLoc] = useState<LocationPoint>(KERALA_BUS_STANDS[0]);
  const [toLoc, setToLoc] = useState<LocationPoint>(KERALA_BUS_STANDS[30]);
  const [pickerMode, setPickerMode] = useState<"from" | "to" | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);

  const filteredStands = KERALA_BUS_STANDS.filter((loc) => {
    const matchesDistrict =
      selectedDistrict === "All" ||
      (loc.detail && loc.detail.toLowerCase().includes(selectedDistrict.toLowerCase())) ||
      loc.name.toLowerCase().includes(selectedDistrict.toLowerCase());
    const matchesSearch =
      !searchQuery.trim() ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.detail && loc.detail.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDistrict && matchesSearch;
  });

  const tripStats = calculateTripStats(fromLoc, toLoc);

  const swapLocations = () => {
    const temp = fromLoc;
    setFromLoc(toLoc);
    setToLoc(temp);
  };

  const handleSelectLocation = (loc: LocationPoint) => {
    if (pickerMode === "from") {
      setFromLoc(loc);
    } else if (pickerMode === "to") {
      setToLoc(loc);
    }
    setPickerMode(null);
    setSearchQuery("");
    setCustomInput("");
  };

  const handleUseGps = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLoading(false);
          const currentPoint: LocationPoint = {
            name: "Current GPS Location",
            detail: `Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)}`,
            coords: [pos.coords.latitude, pos.coords.longitude],
          };
          handleSelectLocation(currentPoint);
        },
        () => {
          setGpsLoading(false);
          const defaultKochi: LocationPoint = {
            name: "Marine Drive, Kochi",
            detail: "Central Kochi",
            coords: [9.9790, 76.2759],
          };
          handleSelectLocation(defaultKochi);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const offset = Math.random() * 0.02 - 0.01;
    const newPoint: LocationPoint = {
      name: customInput.trim(),
      detail: "Custom location",
      coords: [9.9988 + offset, 76.3100 + offset],
    };
    handleSelectLocation(newPoint);
  };

  const go = (next: View) => { setView(next); setDemoOpen(false); if (next === "active" && demoViews.find((item) => item.label === "SOS" && item.view === next)) setSos("closed"); };
  const backHome = () => setView("home");
  const nav = [{ label: "Home", icon: Home, view: "home" as View }, { label: "History", icon: History, view: "history" as View }, { label: "Contacts", icon: Users, view: "contacts" as View }, { label: "Settings", icon: Settings, view: "settings" as View }];
  const content = (() => {
    if (view === "splash") {
      return (
        <div className="relative flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center bg-background px-6 lg:px-8 text-foreground overflow-hidden">
          <div className="absolute top-1/4 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          
          {/* Mobile Phone App Splash View */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full mx-auto md:hidden">
            <div className="mb-6 grid size-24 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-glow animate-in zoom-in-95 duration-500">
              <ShieldCheck className="size-12" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">NIGHTWATCH</h1>
            <p className="mt-2 text-sm text-muted-foreground font-medium">Your journey. Watched over.</p>
            <Button className="mt-10 h-12 w-full max-w-xs font-bold shadow-soft" onClick={() => setView("onboarding")}>
              Begin safely <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>

          {/* Desktop Laptop Web Landing View */}
          <div className="hidden md:flex relative z-10 flex-col items-center text-center max-w-2xl w-full mx-auto py-12 animate-in fade-in-50 duration-500">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft/80 px-4 py-1.5 text-xs font-black text-primary">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              KERALA TRANSIT SAFETY NETWORK · ആനവണ്ടി
            </div>
            <div className="mb-6 grid size-20 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-glow">
              <ShieldCheck className="size-10" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              Nightwatch Kerala Safety Web
            </h1>
            <p className="mt-3 text-base text-muted-foreground max-w-lg leading-relaxed font-medium">
              Real-time night transit monitoring, satellite highway tracking, and instant safety deviation alerts covering all 14 Kerala districts.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Button size="lg" className="h-12 px-8 font-extrabold shadow-soft" onClick={() => setView("home")}>
                Open Web Dashboard <ChevronRight className="size-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 font-bold" onClick={() => setView("plan")}>
                <RouteIcon className="size-4 mr-2" /> Plan Route
              </Button>
            </div>
          </div>
        </div>
      );
    }
    if (view === "onboarding") {
      const slides: Array<{ title: string; copy: string; icon: LucideIcon }> = [
        { title: "Travel with confidence", copy: "Plan late-night journeys with a calm companion beside you.", icon: Navigation },
        { title: "Your journey, monitored", copy: "Smart check-ins notice changes without getting in your way.", icon: RouteIcon },
        { title: "Someone you trust, always connected", copy: "Keep the people you choose informed from start to finish.", icon: ContactRound },
      ];
      const slide = slides[onboard];
      if (!slide) return null;
      const Icon = slide.icon;
      return (
        <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-6">
          <div className="flex w-full max-w-md flex-col p-6 rounded-2xl border bg-surface shadow-soft mx-auto">
            <div className="flex justify-between items-center"><span className="text-sm font-black">NIGHTWATCH</span><Button variant="ghost" size="sm" onClick={() => setView("home")}>Skip</Button></div>
            <div className="flex flex-1 flex-col items-center justify-center text-center py-8">
              <div className="relative mb-8 grid size-44 place-items-center rounded-full bg-primary-soft">
                <div className="absolute inset-5 rounded-full border border-primary/20" />
                <Icon className="size-16 text-primary" />
              </div>
              <h2 className="max-w-xs text-2xl lg:text-3xl font-black">{slide.title}</h2>
              <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{slide.copy}</p>
            </div>
            <div className="mb-6 flex justify-center gap-2">
              {slides.map((_, i) => <span key={i} className={cn("h-1.5 rounded-full transition-all", i === onboard ? "w-8 bg-primary" : "w-2 bg-border")} />)}
            </div>
            <Button className="h-12 w-full font-bold" onClick={() => onboard < 2 ? setOnboard(onboard + 1) : setView("home")}>
              {onboard === 2 ? "Get started" : "Continue"}<ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      );
    }
    if (view === "home") return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-28 md:pb-12">
        <div className="md:grid md:grid-cols-[380px_1fr] lg:grid-cols-[440px_1fr] md:gap-6 lg:gap-8 md:items-start">
          {/* Left Column: Journey Controls & Status */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Good evening,</p>
                <h1 className="text-2xl lg:text-3xl font-black">Alwin</h1>
              </div>
              <Button aria-label="Notifications" size="icon" variant="outline" onClick={() => go("notifications")}>
                <Bell className="size-4" />
              </Button>
            </div>

            <section className="overflow-hidden rounded-2xl bg-foreground p-5 text-primary-foreground shadow-lift">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Night journey</p>
                  <h2 className="mt-2 text-2xl font-black">Ready for a journey?</h2>
                </div>
                <Shield className="size-9 text-primary shrink-0" />
              </div>

              <div className="mt-6 rounded-xl bg-primary-foreground/10 p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <button
                    className="flex flex-1 items-center gap-3 text-left p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
                    onClick={() => { setPickerMode("from"); setSearchQuery(""); }}
                  >
                    <LocateFixed className="size-4 text-success shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold text-primary-foreground/50">From</p>
                      <p className="truncate text-sm font-semibold text-primary-foreground">{fromLoc.name}</p>
                    </div>
                  </button>
                  <button
                    title="Swap From and To"
                    onClick={swapLocations}
                    className="p-2 rounded-full hover:bg-primary-foreground/20 text-primary transition-colors shrink-0"
                  >
                    <ArrowUpDown className="size-4" />
                  </button>
                </div>

                <div className="ml-4 h-3 border-l border-dashed border-primary-foreground/30" />

                <button
                  className="flex w-full items-center gap-3 text-left p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
                  onClick={() => { setPickerMode("to"); setSearchQuery(""); }}
                >
                  <MapPin className="size-4 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase font-bold text-primary-foreground/50">To</p>
                    <p className="truncate text-sm font-semibold text-primary-foreground">{toLoc.name}</p>
                  </div>
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-primary-foreground/70 px-1">
                <span>{tripStats.distanceKm} · {tripStats.durationMins}</span>
                <span>ETA {tripStats.eta}</span>
              </div>

              <Button className="mt-4 h-12 w-full font-bold shadow-soft" onClick={() => go("active")}>
                <Navigation className="size-4 mr-2" /> Start journey
              </Button>
              <Button
                variant="ghost"
                className="mt-1 w-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                onClick={() => go("plan")}
              >
                Plan route & checkpoints
              </Button>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <button className="rounded-xl border bg-surface p-4 text-left shadow-soft hover:border-primary/50 transition-colors" onClick={() => go("safety")}>
                <div className="flex items-center gap-2"><StatusDot /><span className="text-xs font-bold">ALL SYSTEMS READY</span></div>
                <p className="mt-4 text-sm font-bold">Safety status</p>
                <p className="text-xs text-muted-foreground">Everything looks good</p>
              </button>
              <button className="rounded-xl border bg-surface p-4 text-left shadow-soft hover:border-primary/50 transition-colors" onClick={() => go("contacts")}>
                <div className="grid size-9 place-items-center rounded-full bg-primary-soft font-bold text-primary">M</div>
                <p className="mt-3 text-sm font-bold">Mom</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><StatusDot /> Connected</p>
              </button>
            </section>

            <section>
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-base">Recent journeys</h2>
                <Button variant="ghost" size="sm" onClick={() => go("history")}>View all</Button>
              </div>
              <button onClick={() => go("plan")} className="mt-3 flex w-full items-center gap-3 rounded-xl border bg-surface p-4 text-left shadow-soft hover:border-primary/50 transition-colors">
                <div className="grid size-10 place-items-center rounded-lg bg-primary-soft">
                  <RouteIcon className="size-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{fromLoc.name} → {toLoc.name}</p>
                  <p className="text-xs text-muted-foreground">Planned · {tripStats.durationMins}</p>
                </div>
                <Check className="size-5 text-success" />
              </button>
            </section>
          </div>

          {/* Right Column (Web View on desktop only): High-Res Kerala Satellite Map & Metrics */}
          <div className="hidden md:flex md:flex-col md:gap-5">
            <div className="overflow-hidden rounded-2xl border bg-surface shadow-soft">
              <div className="flex items-center justify-between border-b px-5 py-3.5 bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-black tracking-wide">LIVE SATELLITE ROUTE MAP · KERALA</span>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">{fromLoc.name} → {toLoc.name}</span>
              </div>
              <div className="h-[430px] w-full">
                <NightwatchLeafletMap dark={dark} from={fromLoc} to={toLoc} className="h-full w-full" />
              </div>
              <div className="grid grid-cols-4 divide-x border-t p-4 bg-surface text-center">
                <Metric value={tripStats.distanceKm} label="Distance" />
                <Metric value={tripStats.durationMins} label="Est. Duration" />
                <Metric value={tripStats.eta} label="Arrive By" />
                <Metric value="Safe" label="Corridor Status" />
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary-soft/60 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase text-primary tracking-wide">Kerala State Transit Safety Network (ആനവണ്ടി)</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Active monitoring covering KSRTC Depots and Municipal transit lines across all 14 districts with instant deviation alerts.
                </p>
              </div>
              <Button size="sm" onClick={() => go("plan")} className="shrink-0 ml-4 font-bold">
                Route Plan <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Website Footer */}
        <footer className="hidden md:block border-t bg-surface/50 mt-12 pt-8 pb-4 text-xs text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground font-black text-xs">
                NW
              </div>
              <div>
                <p className="font-extrabold text-foreground text-sm">NIGHTWATCH KERALA WEB</p>
                <p className="text-[11px]">Kerala State Transit Safety Network (ആനവണ്ടി)</p>
              </div>
            </div>
            <div className="flex items-center gap-5 font-semibold">
              <button onClick={() => go("plan")} className="hover:text-primary transition-colors">Plan Route</button>
              <button onClick={() => go("active")} className="hover:text-primary transition-colors">Live Tracking</button>
              <button onClick={() => go("safety")} className="hover:text-primary transition-colors">Safety Corridor</button>
              <button onClick={() => go("history")} className="hover:text-primary transition-colors">Recent Journeys</button>
              <button onClick={() => go("contacts")} className="hover:text-primary transition-colors">Emergency Contacts</button>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-success/15 text-success font-bold px-2.5 py-1 text-[11px] flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-success animate-pulse" /> Police 112 Active
              </span>
              <span className="text-[11px] font-medium">KSRTC: 0471-2463799</span>
            </div>
          </div>
        </footer>
      </div>
    );
    if (view === "plan") return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-28 md:pb-12">
        <div className="md:hidden">
          <Header title="Plan journey" back={backHome} />
        </div>
        <div className="md:grid md:grid-cols-[380px_1fr] lg:grid-cols-[440px_1fr] md:gap-6 lg:gap-8 md:items-start">
          {/* Left Column: Route Setup & Details */}
          <div className="space-y-5">
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={backHome}>
                  <ArrowLeft className="size-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-black">Plan Journey</h1>
                  <p className="text-xs text-muted-foreground font-semibold">Select departure and destination across Kerala</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-surface p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-muted-foreground">FROM (START POINT)</label>
                <button
                  onClick={swapLocations}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <ArrowUpDown className="size-3.5" /> Swap
                </button>
              </div>
              <button
                onClick={() => { setPickerMode("from"); setSearchQuery(""); }}
                className="mt-2 flex w-full items-center gap-3 rounded-xl bg-muted p-3 text-left hover:bg-muted/80 transition-colors"
              >
                <LocateFixed className="size-4 text-success shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate">{fromLoc.name}</p>
                  {fromLoc.detail && <p className="text-xs text-muted-foreground truncate">{fromLoc.detail}</p>}
                </div>
                <ChevronRight className="size-4 text-muted-foreground shrink-0" />
              </button>

              <div className="mx-5 my-2 h-3 border-l border-dashed" />

              <label className="text-xs font-bold text-muted-foreground">TO (DESTINATION)</label>
              <button
                onClick={() => { setPickerMode("to"); setSearchQuery(""); }}
                className="mt-2 flex w-full items-center gap-3 rounded-xl bg-muted p-3 text-left hover:bg-muted/80 transition-colors"
              >
                <MapPin className="size-4 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate">{toLoc.name}</p>
                  {toLoc.detail && <p className="text-xs text-muted-foreground truncate">{toLoc.detail}</p>}
                </div>
                <ChevronRight className="size-4 text-muted-foreground shrink-0" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-surface p-4 shadow-soft">
                <p className="text-xs text-muted-foreground">Departure</p>
                <p className="mt-1 text-sm font-bold">Now, Night Safe</p>
              </div>
              <div className="rounded-xl border bg-surface p-4 shadow-soft">
                <p className="text-xs text-muted-foreground">Watching over you</p>
                <p className="mt-1 text-sm font-bold">Mom</p>
              </div>
            </div>

            {/* Mobile-only compact map preview */}
            <div className="overflow-hidden rounded-xl border bg-surface shadow-soft md:hidden">
              <NightwatchLeafletMap compact dark={dark} from={fromLoc} to={toLoc} />
              <div className="p-4">
                <div className="grid grid-cols-3 text-center">
                  <Metric value={tripStats.distanceKm} label="Distance" />
                  <Metric value={tripStats.durationMins} label="Duration" />
                  <Metric value={tripStats.eta} label="ETA" />
                </div>
                <div className="mt-4 flex items-center gap-2 border-t pt-4 text-xs font-semibold">
                  <ShieldCheck className="size-4 text-success" /> 3 safety checkpoints planned on route
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary-soft p-4">
              <p className="text-xs font-black uppercase text-primary">Kerala Monitored Transit Corridor</p>
              <p className="mt-1 text-xs text-muted-foreground">{fromLoc.name} to {toLoc.name} · Live satellite & safety check-ins enabled</p>
            </div>

            <Button className="h-12 w-full font-bold shadow-soft" onClick={() => go("active")}>
              <Navigation className="size-4 mr-2" /> Start journey
            </Button>
          </div>

          {/* Right Column (Web view on desktop only): Full Map View with Checkpoints */}
          <div className="hidden md:block sticky top-24">
            <div className="overflow-hidden rounded-2xl border bg-surface shadow-soft">
              <div className="flex items-center justify-between border-b px-5 py-3.5 bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-black tracking-wide">STATE TRANSIT SATELLITE ROUTE</span>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">3 Checkpoints active</span>
              </div>
              <div className="h-[460px] w-full">
                <NightwatchLeafletMap dark={dark} from={fromLoc} to={toLoc} className="h-full w-full" />
              </div>
              <div className="p-5 border-t bg-surface">
                <div className="grid grid-cols-4 divide-x text-center">
                  <Metric value={tripStats.distanceKm} label="Total Distance" />
                  <Metric value={tripStats.durationMins} label="Duration" />
                  <Metric value={tripStats.eta} label="Estimated Arrival" />
                  <Metric value="Active" label="Safety Coverage" />
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5 text-xs">
                  <span className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="size-4 text-success" /> Automated safety deviation detection
                  </span>
                  <span className="text-muted-foreground font-medium">Statewide Highway Grid</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    if (view === "active") return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_420px] md:gap-6 lg:gap-8 md:h-[calc(100vh-140px)]">
          <div className="overflow-hidden rounded-2xl border bg-surface shadow-soft h-full flex flex-col">
            <div className="flex items-center justify-between border-b px-5 py-3.5 bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-black tracking-wide">LIVE GPS SATELLITE TRACKING</span>
              </div>
              <span className="text-xs text-primary font-bold">Kerala Monitored Corridor</span>
            </div>
            <div className="flex-1 w-full min-h-[500px]">
              <NightwatchLeafletMap dark={dark} from={fromLoc} to={toLoc} className="h-full w-full" />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border bg-surface p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-black text-success">
                  <StatusDot tone="success" /> JOURNEY NORMAL
                </span>
                <span className="text-xs font-semibold text-muted-foreground">ETA {tripStats.eta}</span>
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <div>
                  <p className="text-3xl font-black">{tripStats.durationMins}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Remaining · {tripStats.distanceKm}</p>
                </div>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-extrabold text-primary">
                  In Transit
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[45%] rounded-full bg-primary animate-pulse" />
              </div>
            </div>

            <div className="rounded-2xl border bg-surface p-6 shadow-soft space-y-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground">START</p>
                <p className="font-bold text-sm truncate">{fromLoc.name}</p>
              </div>
              <div className="border-t pt-3">
                <p className="text-xs font-bold text-muted-foreground">DESTINATION</p>
                <p className="font-bold text-base truncate text-primary">{toLoc.name}</p>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-muted-foreground">TRUSTED COMPANION</p>
                  <span className="text-xs text-success font-semibold">Active & Watching</span>
                </div>
                <p className="font-bold text-sm mt-1">Mom (+91 98765 43210)</p>
              </div>
            </div>

            <div className="mt-auto flex gap-3 pt-2">
              <Button variant="outline" className="h-12 flex-1 font-bold" onClick={backHome}>
                End journey
              </Button>
              <Button variant="outline" className="h-12 font-bold" onClick={() => go("safety")}>
                <Shield className="size-4 mr-1.5" /> Safety
              </Button>
              <Button variant="destructive" className="h-12 flex-1 font-bold" onClick={() => setSos("confirm")}>
                <Phone className="size-4 mr-1.5" /> SOS
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile View (Preserved exactly) */}
        <div className="relative min-h-[760px] md:hidden rounded-2xl overflow-hidden border">
          <NightwatchLeafletMap dark={dark} from={fromLoc} to={toLoc} className="min-h-[760px] h-[760px]" />
          <div className="absolute inset-x-4 top-4 rounded-lg bg-surface/95 p-4 shadow-lift backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-black"><StatusDot/> JOURNEY NORMAL</span>
              <span className="text-xs text-muted-foreground">ETA {tripStats.eta}</span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-2xl font-black">{tripStats.durationMins}</p>
                <p className="text-xs text-muted-foreground">remaining · {tripStats.distanceKm}</p>
              </div>
              <span className="text-sm font-black text-primary">Active</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[45%] rounded-full bg-primary animate-pulse" />
            </div>
          </div>
          <div className="absolute inset-x-4 bottom-5 rounded-lg bg-surface p-4 shadow-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="text-sm font-bold truncate max-w-[200px]">{toLoc.name}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => go("safety")}><Shield /> Safety</Button>
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="h-11 flex-1" onClick={backHome}>End journey</Button>
              <Button className="h-11 flex-1" onClick={() => setSos("confirm")}><Phone /> SOS</Button>
            </div>
          </div>
        </div>
      </div>
    );
    if (view === "safety") { const checks: Array<{ icon: LucideIcon; title: string; sub: string }> = [{icon:RouteIcon,title:"Route on track",sub:"No unexpected changes"},{icon:Navigation,title:"Movement normal",sub:"Steady movement detected"},{icon:Clock3,title:`ETA ${tripStats.eta}`,sub:`${tripStats.durationMins} remaining`},{icon:ContactRound,title:"Mom connected",sub:"Updated just now"}]; return <div className="w-full max-w-2xl mx-auto"><Header title="Journey safety" back={() => go("active")}/><div className="px-5 pb-24"><div className="flex flex-col items-center py-8 text-center"><div className="grid size-24 place-items-center rounded-full bg-success-soft"><ShieldCheck className="size-12 text-success"/></div><p className="mt-5 text-xs font-black text-success">JOURNEY NORMAL</p><h2 className="mt-2 text-2xl font-black">Everything looks good</h2><p className="mt-2 text-sm text-muted-foreground">Monitoring your trip to {toLoc.name}</p></div><div className="rounded-lg border bg-surface p-4 shadow-soft">{checks.map(({icon: Icon,title,sub}) => <div key={title} className="flex items-center gap-3 border-b py-3 last:border-0"><div className="grid size-9 place-items-center rounded-md bg-muted"><Icon className="size-4"/></div><div className="flex-1"><p className="text-sm font-bold">{title}</p><p className="text-xs text-muted-foreground">{sub}</p></div><Check className="size-4 text-success"/></div>)}</div><Button variant="outline" className="mt-5 h-11 w-full" onClick={() => setSos("confirm")}><Phone/> Emergency options</Button></div></div>; }
    if (view === "deviation" || view === "stopped") { const stopped = view === "stopped"; return <div className="w-full max-w-2xl mx-auto"><Header title={stopped ? "Unexpected stop" : "Route change detected"} back={() => go("active")}/><div className="px-5 pb-8"><div className="rounded-lg bg-warning-soft p-4"><div className="flex items-center gap-2 text-warning-foreground"><AlertTriangle className="size-5"/><span className="text-xs font-black">ATTENTION NEEDED</span></div><h2 className="mt-3 text-xl font-black">{stopped ? "You've been stopped for 12 min" : "We noticed a route difference"}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{stopped ? `You haven't moved on the route to ${toLoc.name}. Let us know if everything is okay.` : "Your journey differs from the planned route. This can happen because of a detour or change of plans."}</p></div><div className="mt-4 overflow-hidden rounded-lg border"><NightwatchLeafletMap compact deviation={!stopped} dark={dark} from={fromLoc} to={toLoc}/></div><Button className="mt-5 h-12 w-full" onClick={() => go("confirmed")}><ShieldCheck/> I'm safe</Button><Button variant="outline" className="mt-3 h-12 w-full" onClick={() => go("active")}>{stopped ? "View journey" : "Check journey"}</Button></div></div>; }
    if (view === "check") return <div className="w-full max-w-2xl mx-auto flex min-h-[760px] flex-col items-center justify-center px-6 text-center"><div className="safety-pulse grid size-32 place-items-center rounded-full bg-primary-soft"><Shield className="size-14 text-primary"/></div><p className="mt-10 text-xs font-black text-primary">SAFETY CHECK</p><h1 className="mt-2 text-3xl font-black">Are you safe?</h1><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">We noticed an unusual change. Please check in before we alert Mom.</p><div className="my-8 font-mono text-4xl font-bold">00:30</div><Button className="h-12 w-full" onClick={() => go("confirmed")}><ShieldCheck/> Yes, I'm safe</Button><Button variant="outline" className="mt-3 h-12 w-full text-danger" onClick={() => setSos("confirm")}><Phone/> Get help</Button></div>;
    if (view === "confirmed") return <div className="w-full max-w-2xl mx-auto flex min-h-[760px] flex-col items-center justify-center px-6 text-center"><div className="grid size-28 place-items-center rounded-full bg-success-soft"><Check className="size-14 text-success"/></div><h1 className="mt-8 text-3xl font-black">You're safe</h1><p className="mt-3 max-w-xs text-sm text-muted-foreground">Your check-in was recorded. Mom can see that everything is okay.</p><Button className="mt-10 h-12 w-full" onClick={() => go("active")}>Continue journey</Button></div>;
    if (view === "missed") return <div className="w-full max-w-2xl mx-auto flex min-h-[760px] flex-col px-6 py-12"><div className="grid size-16 place-items-center rounded-full bg-danger-soft"><AlertTriangle className="size-8 text-danger"/></div><p className="mt-8 text-xs font-black text-danger">CHECK-IN MISSED</p><h1 className="mt-2 text-3xl font-black">Mom has been notified</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">You didn't respond to the safety check. Your trusted contact now has your journey details.</p><div className="mt-8 rounded-lg border bg-surface p-4"><p className="text-xs text-muted-foreground">Last known location</p><p className="mt-1 font-bold">Near {toLoc.name}</p><p className="mt-1 text-xs text-muted-foreground">11:42 PM · 1 minute ago</p></div><div className="mt-auto"><Button className="h-12 w-full" onClick={() => go("confirmed")}>I'm safe now</Button><Button variant="outline" className="mt-3 h-12 w-full text-danger" onClick={() => setSos("confirm")}><Phone/> Get emergency help</Button></div></div>;
    if (view === "completed") return <div className="w-full max-w-2xl mx-auto min-h-[760px] px-5 py-10"><div className="flex flex-col items-center text-center"><div className="grid size-24 place-items-center rounded-full bg-success-soft"><Sparkles className="size-11 text-success"/></div><p className="mt-6 text-xs font-black text-success">ARRIVED SAFELY</p><h1 className="mt-2 text-3xl font-black">Journey complete</h1><p className="mt-2 text-sm text-muted-foreground">{toLoc.name} · {tripStats.eta}</p></div><div className="my-8 grid grid-cols-3 rounded-lg border bg-surface p-5 text-center shadow-soft"><Metric value={tripStats.distanceKm} label="Kilometres"/><Metric value={tripStats.durationMins} label="Minutes"/><Metric value="3/3" label="Checkpoints"/></div><div className="rounded-lg border bg-surface p-4"><Timeline/></div><Button className="mt-8 h-12 w-full" onClick={backHome}>Done</Button></div>;
    if (view === "contact") return <div className="min-h-[760px] bg-companion"><header className="flex items-center justify-between border-b bg-surface px-6 py-4"><div><p className="text-xs font-black text-primary">NIGHTWATCH</p><h1 className="font-extrabold">Trusted Contact</h1></div><div className="flex items-center gap-2 text-sm font-bold"><div className="grid size-9 place-items-center rounded-full bg-primary-soft text-primary">M</div><span className="hidden sm:block">Mom's view</span></div></header><main className="mx-auto grid max-w-6xl gap-5 p-5 md:grid-cols-[1.1fr_.9fr]"><div className="overflow-hidden rounded-lg border bg-surface shadow-soft"><NightwatchLeafletMap dark={dark} from={fromLoc} to={toLoc} className="min-h-[460px] h-full"/></div><div className="space-y-4"><div className="rounded-lg border bg-surface p-5 shadow-soft"><div className="flex items-center gap-2 text-xs font-black"><StatusDot/> ALWIN IS ON TRACK</div><h2 className="mt-4 text-2xl font-black">Heading to {toLoc.name}</h2><p className="mt-1 text-sm text-muted-foreground">Updated just now · ETA {tripStats.eta}</p><div className="mt-5 grid grid-cols-3 border-t pt-5"><Metric value={tripStats.distanceKm} label="Total Distance"/><Metric value={tripStats.durationMins} label="Duration"/><Metric value="Active" label="Progress"/></div></div><div className="rounded-lg border bg-surface p-5"><h3 className="font-extrabold">Journey updates</h3><div className="mt-5"><Timeline/></div></div><div className="rounded-lg border border-warning/40 bg-warning-soft p-4"><p className="text-xs font-black">ATTENTION HISTORY</p><p className="mt-1 text-sm font-bold">Route change resolved at 11:28 PM</p><p className="text-xs text-muted-foreground">Alwin confirmed they were safe.</p></div></div></main></div>;
    if (view === "notifications") { const notes = [["Journey started",`Mom is now watching your journey to ${toLoc.name}`,"11:06 PM",Navigation],["Route deviation","A different route was detected","11:26 PM",AlertTriangle],["Safety check confirmed","You checked in as safe","11:28 PM",ShieldCheck],["Journey completed",`You arrived at ${toLoc.name} safely`,"Yesterday",Check]] as const; return <div className="w-full max-w-2xl mx-auto"><Header title="Notifications" back={backHome}/><div className="space-y-3 px-5 pb-24">{notes.map(([title,copy,time,Icon]) => <div key={title} className="flex gap-3 rounded-lg border bg-surface p-4"><div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-soft"><Icon className="size-5 text-primary"/></div><div><div className="flex flex-wrap items-center gap-x-2"><p className="text-sm font-bold">{title}</p><span className="text-[10px] text-muted-foreground">{time}</span></div><p className="mt-1 text-xs text-muted-foreground">{copy}</p></div></div>)}</div></div>; }
    if (view === "history") return <div className="w-full max-w-2xl mx-auto"><Header title="Journey history" back={backHome}/><div className="space-y-3 px-5 pb-24">{[["Marine Drive","Kakkanad","Yesterday · 11:06 PM","42 min"],["Fort Kochi","Edappally","Sep 17 · 10:32 PM","36 min"],["Vyttila","Kalamassery","Sep 12 · 9:48 PM","31 min"]].map(([from,to,date,time]) => <button key={date} onClick={() => go("details")} className="flex w-full items-center gap-3 rounded-lg border bg-surface p-4 text-left shadow-soft"><div className="grid size-11 shrink-0 place-items-center rounded-md bg-success-soft"><Check className="size-5 text-success"/></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{from} → {to}</p><p className="text-xs text-muted-foreground">{date} · {time}</p></div><ChevronRight className="size-4"/></button>)}</div></div>;
    if (view === "details") return <div className="w-full max-w-2xl mx-auto"><Header title="Journey details" back={() => go("history")}/><div className="px-5 pb-10"><div className="overflow-hidden rounded-lg border"><NightwatchLeafletMap compact dark={dark} from={fromLoc} to={toLoc}/></div><div className="my-4 grid grid-cols-3 rounded-lg border bg-surface p-4 text-center"><Metric value={tripStats.distanceKm} label="Distance"/><Metric value={tripStats.durationMins} label="Duration"/><Metric value="Safe" label="Outcome"/></div><div className="rounded-lg border bg-surface p-5"><h2 className="mb-5 font-extrabold">Full timeline</h2><Timeline detailed/></div></div></div>;
    if (view === "contacts") return <div className="w-full max-w-2xl mx-auto"><Header title="Trusted contacts" back={backHome} right={<Button aria-label="Add contact" size="icon" variant="ghost" onClick={() => setAddContact(true)}><Plus/></Button>}/><div className="px-5 pb-24"><div className="rounded-lg border bg-surface p-4 shadow-soft"><div className="flex items-center gap-3"><div className="grid size-12 place-items-center rounded-full bg-primary-soft text-lg font-black text-primary">M</div><div className="flex-1"><p className="font-bold">Mom</p><p className="text-xs text-muted-foreground">Primary · Connected</p></div><StatusDot/></div><div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4"><Button variant="outline" size="sm"><Phone/> Call</Button><Button variant="outline" size="sm">Edit</Button></div></div><div className="mt-6 rounded-lg bg-muted p-4"><ShieldCheck className="size-5 text-success"/><p className="mt-2 text-sm font-bold">Who gets journey alerts?</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Trusted contacts receive starts, safety alerts, missed check-ins, and arrival updates.</p></div></div></div>;
    if (view === "settings") return <div className="w-full max-w-2xl mx-auto"><Header title="Profile & settings" back={backHome}/><div className="px-5 pb-24"><div className="mb-6 flex items-center gap-4"><div className="grid size-16 place-items-center rounded-full bg-foreground text-xl font-black text-primary-foreground">A</div><div><p className="text-lg font-black">Alwin George</p><p className="text-xs text-muted-foreground">Nightwatch member</p></div></div>{[["Journey monitoring","Watch routes and movement",true],["Safety check timer","Ask when something changes",true],["Location privacy","Share only during journeys",true]].map(([title,copy,on]) => <div key={String(title)} className="flex items-center gap-3 border-b py-4"><div className="flex-1"><p className="text-sm font-bold">{title as string}</p><p className="text-xs text-muted-foreground">{copy as string}</p></div><Switch defaultChecked={on as boolean}/></div>)}<div className="flex items-center gap-3 border-b py-4"><div className="flex-1"><p className="text-sm font-bold">Dark appearance</p><p className="text-xs text-muted-foreground">Reduce brightness at night</p></div><Switch checked={dark} onCheckedChange={setDark}/></div><div className="mt-6 rounded-lg border bg-surface p-4"><p className="text-xs font-black text-primary">PRIVACY FIRST</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Mock prototype: no location or personal information leaves this device.</p></div></div></div>;
    const emptyConfig: Record<"empty"|"offline"|"location", [string,string,typeof Bell]> = { empty:["No active journey","Start a journey when you're ready. Nightwatch will appear here.",RouteIcon], offline:["You're offline","Journey monitoring will resume when your connection returns.",AlertTriangle], location:["Location unavailable","Enable location access to preview your position and route.",LocateFixed]};
    if (view === "empty" || view === "offline" || view === "location") { const [title,copy,Icon] = emptyConfig[view]; return <div className="w-full max-w-2xl mx-auto"><Header title="System states" back={backHome}/><div className="flex min-h-[620px] flex-col items-center justify-center px-8 text-center"><div className="grid size-20 place-items-center rounded-full bg-muted"><Icon className="size-8 text-muted-foreground"/></div><h1 className="mt-6 text-2xl font-black">{title}</h1><p className="mt-2 max-w-xs text-sm text-muted-foreground">{copy}</p><Button className="mt-8" onClick={() => view === "empty" ? go("offline") : view === "offline" ? go("location") : backHome()}>{view === "location" ? "Back home" : "View next state"}</Button></div></div> }
    return null;
  })();

  const showNav = ["home","history","contacts","settings"].includes(view);
  return (
    <div className={cn("nightwatch-root", dark && "dark")}>
      <DesktopNavBar
        view={view}
        go={go}
        dark={dark}
        setDark={setDark}
        setSos={setSos}
      />
      <div className={cn("app-stage web-stage", view === "contact" && "contact-stage")}>
        <div className="app-viewport web-viewport">
          <div className={cn("app-scroll-body flex-1 w-full", showNav && "pb-24 md:pb-8")}>
            {content}
          </div>
          {showNav && (
            <nav
              className="fixed bottom-0 inset-x-0 mx-auto max-w-lg w-full z-30 grid h-20 grid-cols-4 border-t bg-surface/95 pb-2 backdrop-blur shadow-soft md:hidden"
            >
              {nav.map(({ label, icon: Icon, view: target }) => (
                <button
                  key={label}
                  onClick={() => go(target)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 text-[10px] font-semibold text-muted-foreground transition-colors",
                    view === target && "text-primary"
                  )}
                >
                  <Icon className="size-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
      {demoOpen && (
        <div
          className={cn(
            "fixed inset-x-3 z-[90] mx-auto max-w-xl rounded-lg border bg-surface p-3 shadow-lift",
            showNav ? "bottom-36 lg:bottom-20" : "bottom-20 lg:bottom-20"
          )}
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-xs font-black">DEMO STATE SWITCHER</p>
            <Button size="icon" variant="ghost" onClick={() => setDemoOpen(false)}>
              <X />
            </Button>
          </div>
          <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto">
            {demoViews.map((item) => (
              <Button
                key={item.label}
                variant={view === item.view ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  go(item.view);
                  if (item.label === "SOS") setSos("confirm");
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setDemoOpen(!demoOpen)}
        className={cn(
          "fixed z-[95] flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-lift transition-all",
          "left-1/2 -translate-x-1/2 lg:left-auto lg:right-6 lg:translate-x-0",
          showNav ? "bottom-24 lg:bottom-6" : "bottom-4 lg:bottom-6"
        )}
      >
        <Menu className="size-4 text-primary" /> Demo mode
      </button>
      {sos !== "closed" && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-overlay p-4"><div className="w-full max-w-md rounded-lg bg-surface p-5 shadow-lift">{sos === "confirm" ? <><div className="mx-auto grid size-14 place-items-center rounded-full bg-danger-soft"><Phone className="size-6 text-danger"/></div><h2 className="mt-4 text-center text-xl font-black">Need immediate help?</h2><p className="mt-2 text-center text-sm text-muted-foreground">This demo will notify Mom and share your last known location.</p><Button variant="destructive" className="mt-6 h-12 w-full" onClick={() => setSos("sent")}><Phone/> Send SOS now</Button><Button variant="ghost" className="mt-2 w-full" onClick={() => setSos("closed")}>Cancel</Button></> : <div className="py-5 text-center"><div className="mx-auto grid size-16 place-items-center rounded-full bg-danger-soft"><Check className="size-8 text-danger"/></div><p className="mt-5 text-xs font-black text-danger">SOS SENT</p><h2 className="mt-1 text-2xl font-black">Help is being contacted</h2><p className="mt-2 text-sm text-muted-foreground">Mom received your location and journey details.</p><Button className="mt-6 h-11 w-full" onClick={() => setSos("closed")}>Return to journey</Button></div>}</div></div>}
      {addContact && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-overlay p-4"><div className="w-full max-w-md rounded-lg bg-surface p-5"><div className="flex items-center justify-between"><h2 className="text-xl font-black">Add trusted contact</h2><Button size="icon" variant="ghost" onClick={() => setAddContact(false)}><X/></Button></div><label className="mt-5 block text-xs font-bold">NAME</label><div className="mt-2 rounded-md border p-3 text-sm text-muted-foreground">e.g. Dad</div><label className="mt-4 block text-xs font-bold">PHONE</label><div className="mt-2 rounded-md border p-3 text-sm text-muted-foreground">+91 98765 43210</div>{["Journey updates","Safety alerts","SOS notifications"].map((label) => <div key={label} className="flex items-center justify-between border-b py-4"><span className="text-sm font-semibold">{label}</span><Switch defaultChecked/></div>)}<Button className="mt-5 h-12 w-full" onClick={() => setAddContact(false)}><Plus/> Add contact</Button></div></div>}

      {pickerMode !== null && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-overlay p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-2xl sm:rounded-2xl bg-surface p-5 shadow-lift overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <p className="text-xs font-black uppercase text-primary">
                  {pickerMode === "from" ? "Departure Location" : "Destination Location"}
                </p>
                <h2 className="text-lg font-bold">
                  {pickerMode === "from" ? "Choose start location" : "Choose destination"}
                </h2>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setPickerMode(null)}>
                <X className="size-5" />
              </Button>
            </div>

            {/* Quick GPS button */}
            <div className="pt-3">
              <button
                disabled={gpsLoading}
                onClick={handleUseGps}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary-soft py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
              >
                <LocateFixed className={cn("size-4", gpsLoading && "animate-spin")} />
                {gpsLoading ? "Detecting GPS location..." : "Use Current GPS Location"}
              </button>
            </div>

            {/* Search filter input */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search bus stand, KSRTC depot, district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border bg-muted py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* District Filter Chips */}
            <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {DISTRICTS.map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => setSelectedDistrict(dist)}
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all",
                    selectedDistrict === dist
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {dist}
                </button>
              ))}
            </div>

            {/* Locations list */}
            <div className="mt-2 flex-1 overflow-y-auto space-y-1.5 max-h-[300px] pr-1">
              <div className="flex items-center justify-between px-1 py-0.5 text-[11px] font-bold uppercase text-muted-foreground">
                <span>Kerala Bus Stands ({filteredStands.length})</span>
                {selectedDistrict !== "All" && <span className="text-primary">{selectedDistrict}</span>}
              </div>
              {filteredStands.map((loc) => {
                const isSelected =
                  (pickerMode === "from" && fromLoc.name === loc.name) ||
                  (pickerMode === "to" && toLoc.name === loc.name);
                return (
                  <button
                    key={loc.name}
                    onClick={() => handleSelectLocation(loc)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors",
                      isSelected ? "bg-primary text-primary-foreground shadow-soft" : "hover:bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-md",
                        isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary-soft text-primary"
                      )}
                    >
                      <Bus className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{loc.name}</p>
                      {loc.detail && (
                        <p
                          className={cn(
                            "truncate text-xs",
                            isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                          )}
                        >
                          {loc.detail}
                        </p>
                      )}
                    </div>
                    {isSelected && <Check className="size-4 shrink-0" />}
                  </button>
                );
              })}
              {filteredStands.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No bus stands found matching "{searchQuery}". You can enter any custom stand or stop below.
                </div>
              )}
            </div>

            {/* Custom location input */}
            <form onSubmit={handleCustomSubmit} className="mt-3 border-t pt-3 flex gap-2">
              <input
                type="text"
                placeholder="Or enter any custom location / address"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 rounded-lg border bg-muted px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" size="sm" disabled={!customInput.trim()}>
                Set
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}