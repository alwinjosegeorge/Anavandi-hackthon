import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
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
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { NightwatchLeafletMap } from "@/components/nightwatch-leaflet-map";

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

export function NightwatchApp() {
  const [view, setView] = useState<View>("splash");
  const [onboard, setOnboard] = useState(0);
  const [demoOpen, setDemoOpen] = useState(false);
  const [framed, setFramed] = useState(true);
  const [sos, setSos] = useState<"closed" | "confirm" | "sent">("closed");
  const [addContact, setAddContact] = useState(false);
  const [dark, setDark] = useState(false);

  const go = (next: View) => { setView(next); setDemoOpen(false); if (next === "active" && demoViews.find((item) => item.label === "SOS" && item.view === next)) setSos("closed"); };
  const backHome = () => setView("home");
  const nav = [{ label: "Home", icon: Home, view: "home" as View }, { label: "History", icon: History, view: "history" as View }, { label: "Contacts", icon: Users, view: "contacts" as View }, { label: "Settings", icon: Settings, view: "settings" as View }];
  const content = (() => {
    if (view === "splash") {
      return (
        <div className="relative flex min-h-[760px] h-full flex-col items-center justify-center bg-background px-8 text-foreground overflow-hidden">
          <div className="absolute -top-24 size-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="mb-6 grid size-24 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-glow animate-in zoom-in-95 duration-500">
            <ShieldCheck className="size-12" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">NIGHTWATCH</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your journey. Watched over.</p>
          <Button className="mt-14 h-12 w-full max-w-xs font-bold shadow-soft" onClick={() => setView("onboarding")}>
            Begin safely <ChevronRight className="size-4 ml-1" />
          </Button>
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
      return <div className="flex min-h-[760px] flex-col p-6"><div className="flex justify-between"><span className="text-sm font-black">NIGHTWATCH</span><Button variant="ghost" size="sm" onClick={() => setView("home")}>Skip</Button></div><div className="flex flex-1 flex-col items-center justify-center text-center"><div className="relative mb-10 grid size-52 place-items-center rounded-full bg-primary-soft"><div className="absolute inset-6 rounded-full border border-primary/20" /><Icon className="size-20 text-primary" /></div><h2 className="max-w-xs text-3xl font-black">{slide.title}</h2><p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">{slide.copy}</p></div><div className="mb-7 flex justify-center gap-2">{slides.map((_, i) => <span key={i} className={cn("h-1.5 rounded-full transition-all", i === onboard ? "w-8 bg-primary" : "w-2 bg-border")} />)}</div><Button className="h-12 w-full" onClick={() => onboard < 2 ? setOnboard(onboard + 1) : setView("home")}>{onboard === 2 ? "Get started" : "Continue"}<ChevronRight /></Button></div>;
    }
    if (view === "home") return <><div className="px-5 pb-28 pt-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Good evening,</p><h1 className="text-2xl font-black">Alwin</h1></div><Button aria-label="Notifications" size="icon" variant="outline" onClick={() => go("notifications")}><Bell /></Button></div><section className="mt-7 overflow-hidden rounded-lg bg-foreground p-5 text-primary-foreground shadow-lift"><div className="flex justify-between"><div><p className="text-xs font-bold uppercase text-primary">Night journey</p><h2 className="mt-2 text-2xl font-black">Ready for a journey?</h2></div><Shield className="size-9 text-primary" /></div><div className="mt-6 rounded-md bg-primary-foreground/10 p-4"><div className="flex gap-3"><LocateFixed className="size-4 text-success" /><div><p className="text-[10px] uppercase text-primary-foreground/50">From</p><p className="text-sm font-semibold">Current Location</p></div></div><div className="ml-2 my-1 h-5 border-l border-dashed border-primary-foreground/30"/><button className="flex w-full gap-3 text-left" onClick={() => go("plan")}><MapPin className="size-4 text-primary" /><div><p className="text-[10px] uppercase text-primary-foreground/50">To</p><p className="text-sm text-primary-foreground/70">Where are you going?</p></div></button></div><Button className="mt-4 h-12 w-full" onClick={() => go("active")}><Navigation /> Start journey</Button><Button variant="ghost" className="mt-1 w-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => go("plan")}>Plan for later</Button></section><section className="mt-5 grid grid-cols-2 gap-3"><button className="rounded-lg border bg-surface p-4 text-left shadow-soft" onClick={() => go("safety")}><div className="flex items-center gap-2"><StatusDot /><span className="text-xs font-bold">ALL SYSTEMS READY</span></div><p className="mt-5 text-sm font-bold">Safety status</p><p className="text-xs text-muted-foreground">Everything looks good</p></button><button className="rounded-lg border bg-surface p-4 text-left shadow-soft" onClick={() => go("contacts")}><div className="grid size-9 place-items-center rounded-full bg-primary-soft font-bold text-primary">M</div><p className="mt-3 text-sm font-bold">Mom</p><p className="flex items-center gap-1 text-xs text-muted-foreground"><StatusDot /> Connected</p></button></section><section className="mt-7"><div className="flex items-center justify-between"><h2 className="font-extrabold">Recent journeys</h2><Button variant="ghost" size="sm" onClick={() => go("history")}>View all</Button></div><button className="mt-3 flex w-full items-center gap-3 rounded-lg border bg-surface p-4 text-left"><div className="grid size-10 place-items-center rounded-md bg-primary-soft"><RouteIcon className="size-5 text-primary" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">Marine Drive → Kakkanad</p><p className="text-xs text-muted-foreground">Yesterday · 42 min</p></div><Check className="size-5 text-success" /></button></section></div></>;
    if (view === "plan") return <><Header title="Plan journey" back={backHome}/><div className="space-y-5 px-5 pb-10"><div className="rounded-lg border bg-surface p-4 shadow-soft"><label className="text-xs font-bold text-muted-foreground">FROM</label><div className="mt-2 flex items-center gap-3 rounded-md bg-muted p-3"><LocateFixed className="size-4 text-success"/><span className="text-sm font-semibold">Kochi</span></div><div className="mx-5 h-4 border-l border-dashed"/><label className="text-xs font-bold text-muted-foreground">TO</label><div className="mt-2 flex items-center gap-3 rounded-md bg-muted p-3"><MapPin className="size-4 text-primary"/><span className="text-sm font-semibold">Kakkanad</span></div></div><div className="grid grid-cols-2 gap-3"><div className="rounded-lg border bg-surface p-3"><p className="text-xs text-muted-foreground">Departure</p><p className="mt-1 text-sm font-bold">Today, 11:00 PM</p></div><div className="rounded-lg border bg-surface p-3"><p className="text-xs text-muted-foreground">Watching over you</p><p className="mt-1 text-sm font-bold">Mom</p></div></div><div className="overflow-hidden rounded-lg border bg-surface shadow-soft"><NightwatchLeafletMap compact dark={dark}/><div className="p-4"><div className="grid grid-cols-3"><Metric value="14.2 km" label="Distance"/><Metric value="42 min" label="Duration"/><Metric value="11:48" label="ETA"/></div><div className="mt-4 flex items-center gap-2 border-t pt-4 text-xs font-semibold"><ShieldCheck className="size-4 text-success"/> 3 safety checkpoints planned</div></div></div><div className="rounded-lg border border-primary/30 bg-primary-soft p-4"><p className="text-xs font-black uppercase text-primary">Kochi Night Transit · Segment 07</p><p className="mt-1 text-xs text-muted-foreground">Urban corridor · Moderate activity · 3 monitored zones</p></div><Button className="h-12 w-full" onClick={() => go("active")}><Navigation /> Start journey</Button></div></>;
    if (view === "active") return <div className="relative min-h-[760px]"><NightwatchLeafletMap dark={dark} className="min-h-[760px] h-[760px]"/><div className="absolute inset-x-4 top-4 rounded-lg bg-surface/95 p-4 shadow-lift backdrop-blur"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-black"><StatusDot/> JOURNEY NORMAL</span><span className="text-xs text-muted-foreground">ETA 11:48 PM</span></div><div className="mt-4 flex items-end justify-between"><div><p className="text-2xl font-black">18 min</p><p className="text-xs text-muted-foreground">remaining · 5.4 km</p></div><span className="text-sm font-black text-primary">62%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-[62%] rounded-full bg-primary" /></div></div><div className="absolute inset-x-4 bottom-5 rounded-lg bg-surface p-4 shadow-lift"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Next checkpoint</p><p className="text-sm font-bold">Palarivattom · 4 min</p></div><Button variant="outline" size="sm" onClick={() => go("safety")}><Shield /> Safety</Button></div><div className="mt-4 flex gap-3"><Button variant="outline" className="h-11 flex-1" onClick={backHome}>End journey</Button><Button className="h-11 flex-1" onClick={() => setSos("confirm")}><Phone /> SOS</Button></div></div></div>;
    if (view === "safety") { const checks: Array<{ icon: LucideIcon; title: string; sub: string }> = [{icon:RouteIcon,title:"Route on track",sub:"No unexpected changes"},{icon:Navigation,title:"Movement normal",sub:"Steady movement detected"},{icon:Clock3,title:"ETA 11:48 PM",sub:"18 minutes remaining"},{icon:ContactRound,title:"Mom connected",sub:"Updated just now"}]; return <><Header title="Journey safety" back={() => go("active")}/><div className="px-5 pb-24"><div className="flex flex-col items-center py-8 text-center"><div className="grid size-24 place-items-center rounded-full bg-success-soft"><ShieldCheck className="size-12 text-success"/></div><p className="mt-5 text-xs font-black text-success">JOURNEY NORMAL</p><h2 className="mt-2 text-2xl font-black">Everything looks good</h2><p className="mt-2 text-sm text-muted-foreground">Monitoring your trip to Kakkanad</p></div><div className="rounded-lg border bg-surface p-4 shadow-soft">{checks.map(({icon: Icon,title,sub}) => <div key={title} className="flex items-center gap-3 border-b py-3 last:border-0"><div className="grid size-9 place-items-center rounded-md bg-muted"><Icon className="size-4"/></div><div className="flex-1"><p className="text-sm font-bold">{title}</p><p className="text-xs text-muted-foreground">{sub}</p></div><Check className="size-4 text-success"/></div>)}</div><Button variant="outline" className="mt-5 h-11 w-full" onClick={() => setSos("confirm")}><Phone/> Emergency options</Button></div></>; }
    if (view === "deviation" || view === "stopped") { const stopped = view === "stopped"; return <><Header title={stopped ? "Unexpected stop" : "Route change detected"} back={() => go("active")}/><div className="px-5 pb-8"><div className="rounded-lg bg-warning-soft p-4"><div className="flex items-center gap-2 text-warning-foreground"><AlertTriangle className="size-5"/><span className="text-xs font-black">ATTENTION NEEDED</span></div><h2 className="mt-3 text-xl font-black">{stopped ? "You've been stopped for 12 min" : "We noticed a route difference"}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{stopped ? "You haven't moved near Kaloor Junction. Let us know if everything is okay." : "Your journey differs from the planned route. This can happen because of a detour or change of plans."}</p></div><div className="mt-4 overflow-hidden rounded-lg border"><NightwatchLeafletMap compact deviation={!stopped} dark={dark}/></div><Button className="mt-5 h-12 w-full" onClick={() => go("confirmed")}><ShieldCheck/> I'm safe</Button><Button variant="outline" className="mt-3 h-12 w-full" onClick={() => go("active")}>{stopped ? "View journey" : "Check journey"}</Button></div></> }
    if (view === "check") return <div className="flex min-h-[760px] flex-col items-center justify-center px-6 text-center"><div className="safety-pulse grid size-32 place-items-center rounded-full bg-primary-soft"><Shield className="size-14 text-primary"/></div><p className="mt-10 text-xs font-black text-primary">SAFETY CHECK</p><h1 className="mt-2 text-3xl font-black">Are you safe?</h1><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">We noticed an unusual change. Please check in before we alert Mom.</p><div className="my-8 font-mono text-4xl font-bold">00:30</div><Button className="h-12 w-full" onClick={() => go("confirmed")}><ShieldCheck/> Yes, I'm safe</Button><Button variant="outline" className="mt-3 h-12 w-full text-danger" onClick={() => setSos("confirm")}><Phone/> Get help</Button></div>;
    if (view === "confirmed") return <div className="flex min-h-[760px] flex-col items-center justify-center px-6 text-center"><div className="grid size-28 place-items-center rounded-full bg-success-soft"><Check className="size-14 text-success"/></div><h1 className="mt-8 text-3xl font-black">You're safe</h1><p className="mt-3 max-w-xs text-sm text-muted-foreground">Your check-in was recorded. Mom can see that everything is okay.</p><Button className="mt-10 h-12 w-full" onClick={() => go("active")}>Continue journey</Button></div>;
    if (view === "missed") return <div className="flex min-h-[760px] flex-col px-6 py-12"><div className="grid size-16 place-items-center rounded-full bg-danger-soft"><AlertTriangle className="size-8 text-danger"/></div><p className="mt-8 text-xs font-black text-danger">CHECK-IN MISSED</p><h1 className="mt-2 text-3xl font-black">Mom has been notified</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">You didn't respond to the safety check. Your trusted contact now has your journey details.</p><div className="mt-8 rounded-lg border bg-surface p-4"><p className="text-xs text-muted-foreground">Last known location</p><p className="mt-1 font-bold">Kaloor Junction, Kochi</p><p className="mt-1 text-xs text-muted-foreground">11:42 PM · 1 minute ago</p></div><div className="mt-auto"><Button className="h-12 w-full" onClick={() => go("confirmed")}>I'm safe now</Button><Button variant="outline" className="mt-3 h-12 w-full text-danger" onClick={() => setSos("confirm")}><Phone/> Get emergency help</Button></div></div>;
    if (view === "completed") return <div className="min-h-[760px] px-5 py-10"><div className="flex flex-col items-center text-center"><div className="grid size-24 place-items-center rounded-full bg-success-soft"><Sparkles className="size-11 text-success"/></div><p className="mt-6 text-xs font-black text-success">ARRIVED SAFELY</p><h1 className="mt-2 text-3xl font-black">Journey complete</h1><p className="mt-2 text-sm text-muted-foreground">Kakkanad · 11:48 PM</p></div><div className="my-8 grid grid-cols-3 rounded-lg border bg-surface p-5 text-center shadow-soft"><Metric value="14.2" label="Kilometres"/><Metric value="42" label="Minutes"/><Metric value="3/3" label="Checkpoints"/></div><div className="rounded-lg border bg-surface p-4"><Timeline/></div><Button className="mt-8 h-12 w-full" onClick={backHome}>Done</Button></div>;
    if (view === "contact") return <div className="min-h-[760px] bg-companion"><header className="flex items-center justify-between border-b bg-surface px-6 py-4"><div><p className="text-xs font-black text-primary">NIGHTWATCH</p><h1 className="font-extrabold">Trusted Contact</h1></div><div className="flex items-center gap-2 text-sm font-bold"><div className="grid size-9 place-items-center rounded-full bg-primary-soft text-primary">M</div><span className="hidden sm:block">Mom's view</span></div></header><main className="mx-auto grid max-w-6xl gap-5 p-5 md:grid-cols-[1.1fr_.9fr]"><div className="overflow-hidden rounded-lg border bg-surface shadow-soft"><NightwatchLeafletMap dark={dark} className="min-h-[460px] h-full"/></div><div className="space-y-4"><div className="rounded-lg border bg-surface p-5 shadow-soft"><div className="flex items-center gap-2 text-xs font-black"><StatusDot/> ALWIN IS ON TRACK</div><h2 className="mt-4 text-2xl font-black">Heading to Kakkanad</h2><p className="mt-1 text-sm text-muted-foreground">Updated just now · ETA 11:48 PM</p><div className="mt-5 grid grid-cols-3 border-t pt-5"><Metric value="5.4 km" label="Remaining"/><Metric value="18 min" label="Time left"/><Metric value="62%" label="Progress"/></div></div><div className="rounded-lg border bg-surface p-5"><h3 className="font-extrabold">Journey updates</h3><div className="mt-5"><Timeline/></div></div><div className="rounded-lg border border-warning/40 bg-warning-soft p-4"><p className="text-xs font-black">ATTENTION HISTORY</p><p className="mt-1 text-sm font-bold">Route change resolved at 11:28 PM</p><p className="text-xs text-muted-foreground">Alwin confirmed they were safe.</p></div></div></main></div>;
    if (view === "notifications") { const notes = [["Journey started","Mom is now watching your journey","11:06 PM",Navigation],["Route deviation","A different route was detected","11:26 PM",AlertTriangle],["Safety check confirmed","You checked in as safe","11:28 PM",ShieldCheck],["Journey completed","You arrived at Kakkanad safely","Yesterday",Check]] as const; return <><Header title="Notifications" back={backHome}/><div className="space-y-3 px-5">{notes.map(([title,copy,time,Icon]) => <div key={title} className="flex gap-3 rounded-lg border bg-surface p-4"><div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-soft"><Icon className="size-5 text-primary"/></div><div><div className="flex flex-wrap items-center gap-x-2"><p className="text-sm font-bold">{title}</p><span className="text-[10px] text-muted-foreground">{time}</span></div><p className="mt-1 text-xs text-muted-foreground">{copy}</p></div></div>)}</div></> }
    if (view === "history") return <><Header title="Journey history" back={backHome}/><div className="space-y-3 px-5 pb-24">{[["Marine Drive","Kakkanad","Yesterday · 11:06 PM","42 min"],["Fort Kochi","Edappally","Sep 17 · 10:32 PM","36 min"],["Vyttila","Kalamassery","Sep 12 · 9:48 PM","31 min"]].map(([from,to,date,time]) => <button key={date} onClick={() => go("details")} className="flex w-full items-center gap-3 rounded-lg border bg-surface p-4 text-left shadow-soft"><div className="grid size-11 shrink-0 place-items-center rounded-md bg-success-soft"><Check className="size-5 text-success"/></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{from} → {to}</p><p className="text-xs text-muted-foreground">{date} · {time}</p></div><ChevronRight className="size-4"/></button>)}</div></>;
    if (view === "details") return <><Header title="Journey details" back={() => go("history")}/><div className="px-5 pb-10"><div className="overflow-hidden rounded-lg border"><NightwatchLeafletMap compact dark={dark}/></div><div className="my-4 grid grid-cols-3 rounded-lg border bg-surface p-4 text-center"><Metric value="14.2 km" label="Distance"/><Metric value="42 min" label="Duration"/><Metric value="Safe" label="Outcome"/></div><div className="rounded-lg border bg-surface p-5"><h2 className="mb-5 font-extrabold">Full timeline</h2><Timeline detailed/></div></div></>;
    if (view === "contacts") return <><Header title="Trusted contacts" back={backHome} right={<Button aria-label="Add contact" size="icon" variant="ghost" onClick={() => setAddContact(true)}><Plus/></Button>}/><div className="px-5 pb-24"><div className="rounded-lg border bg-surface p-4 shadow-soft"><div className="flex items-center gap-3"><div className="grid size-12 place-items-center rounded-full bg-primary-soft text-lg font-black text-primary">M</div><div className="flex-1"><p className="font-bold">Mom</p><p className="text-xs text-muted-foreground">Primary · Connected</p></div><StatusDot/></div><div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4"><Button variant="outline" size="sm"><Phone/> Call</Button><Button variant="outline" size="sm">Edit</Button></div></div><div className="mt-6 rounded-lg bg-muted p-4"><ShieldCheck className="size-5 text-success"/><p className="mt-2 text-sm font-bold">Who gets journey alerts?</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Trusted contacts receive starts, safety alerts, missed check-ins, and arrival updates.</p></div></div></>;
    if (view === "settings") return <><Header title="Profile & settings" back={backHome}/><div className="px-5 pb-24"><div className="mb-6 flex items-center gap-4"><div className="grid size-16 place-items-center rounded-full bg-foreground text-xl font-black text-primary-foreground">A</div><div><p className="text-lg font-black">Alwin George</p><p className="text-xs text-muted-foreground">Nightwatch member</p></div></div>{[["Journey monitoring","Watch routes and movement",true],["Safety check timer","Ask when something changes",true],["Location privacy","Share only during journeys",true]].map(([title,copy,on]) => <div key={String(title)} className="flex items-center gap-3 border-b py-4"><div className="flex-1"><p className="text-sm font-bold">{title as string}</p><p className="text-xs text-muted-foreground">{copy as string}</p></div><Switch defaultChecked={on as boolean}/></div>)}<div className="flex items-center gap-3 border-b py-4"><div className="flex-1"><p className="text-sm font-bold">Dark appearance</p><p className="text-xs text-muted-foreground">Reduce brightness at night</p></div><Switch checked={dark} onCheckedChange={setDark}/></div><div className="mt-6 rounded-lg border bg-surface p-4"><p className="text-xs font-black text-primary">PRIVACY FIRST</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Mock prototype: no location or personal information leaves this device.</p></div></div></>;
    const emptyConfig: Record<"empty"|"offline"|"location", [string,string,typeof Bell]> = { empty:["No active journey","Start a journey when you're ready. Nightwatch will appear here.",RouteIcon], offline:["You're offline","Journey monitoring will resume when your connection returns.",AlertTriangle], location:["Location unavailable","Enable location access to preview your position and route.",LocateFixed]};
    if (view === "empty" || view === "offline" || view === "location") { const [title,copy,Icon] = emptyConfig[view]; return <><Header title="System states" back={backHome}/><div className="flex min-h-[620px] flex-col items-center justify-center px-8 text-center"><div className="grid size-20 place-items-center rounded-full bg-muted"><Icon className="size-8 text-muted-foreground"/></div><h1 className="mt-6 text-2xl font-black">{title}</h1><p className="mt-2 max-w-xs text-sm text-muted-foreground">{copy}</p><Button className="mt-8" onClick={() => view === "empty" ? go("offline") : view === "offline" ? go("location") : backHome()}>{view === "location" ? "Back home" : "View next state"}</Button></div></> }
    return null;
  })();

  const showNav = ["home","history","contacts","settings"].includes(view);
  return (
    <div className={cn("nightwatch-root", dark && "dark")}>
      <div className="fixed right-3 top-3 z-[80] hidden items-center gap-2 lg:flex"><Button variant="outline" size="sm" onClick={() => setFramed(!framed)}><Smartphone/>{framed ? "Full view" : "Device frame"}</Button></div>
      <div className={cn("app-stage", framed && view !== "contact" ? "device-stage" : "full-stage", view === "contact" && "contact-stage")}>
        <div className={cn("app-viewport", framed && view !== "contact" && "device-frame")}>
          {framed && view !== "contact" && <div className="device-island" />}
          <div className={cn("app-scroll-body", showNav && !framed && "pb-24")}>
            {content}
          </div>
          {showNav && (
            <nav
              className={cn(
                "z-30 grid h-20 grid-cols-4 border-t bg-surface/95 pb-2 backdrop-blur shadow-soft",
                framed && view !== "contact"
                  ? "sticky bottom-0 shrink-0 w-full"
                  : "fixed bottom-0 inset-x-0 mx-auto max-w-lg w-full"
              )}
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
            showNav ? "bottom-36" : "bottom-20"
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
          "fixed left-1/2 z-[95] flex -translate-x-1/2 items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-lift transition-all",
          showNav ? "bottom-24" : "bottom-4"
        )}
      >
        <Menu className="size-4 text-primary" /> Demo mode
      </button>
      {sos !== "closed" && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-overlay p-4"><div className="w-full max-w-md rounded-lg bg-surface p-5 shadow-lift">{sos === "confirm" ? <><div className="mx-auto grid size-14 place-items-center rounded-full bg-danger-soft"><Phone className="size-6 text-danger"/></div><h2 className="mt-4 text-center text-xl font-black">Need immediate help?</h2><p className="mt-2 text-center text-sm text-muted-foreground">This demo will notify Mom and share your last known location.</p><Button variant="destructive" className="mt-6 h-12 w-full" onClick={() => setSos("sent")}><Phone/> Send SOS now</Button><Button variant="ghost" className="mt-2 w-full" onClick={() => setSos("closed")}>Cancel</Button></> : <div className="py-5 text-center"><div className="mx-auto grid size-16 place-items-center rounded-full bg-danger-soft"><Check className="size-8 text-danger"/></div><p className="mt-5 text-xs font-black text-danger">SOS SENT</p><h2 className="mt-1 text-2xl font-black">Help is being contacted</h2><p className="mt-2 text-sm text-muted-foreground">Mom received your location and journey details.</p><Button className="mt-6 h-11 w-full" onClick={() => setSos("closed")}>Return to journey</Button></div>}</div></div>}
      {addContact && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-overlay p-4"><div className="w-full max-w-md rounded-lg bg-surface p-5"><div className="flex items-center justify-between"><h2 className="text-xl font-black">Add trusted contact</h2><Button size="icon" variant="ghost" onClick={() => setAddContact(false)}><X/></Button></div><label className="mt-5 block text-xs font-bold">NAME</label><div className="mt-2 rounded-md border p-3 text-sm text-muted-foreground">e.g. Dad</div><label className="mt-4 block text-xs font-bold">PHONE</label><div className="mt-2 rounded-md border p-3 text-sm text-muted-foreground">+91 98765 43210</div>{["Journey updates","Safety alerts","SOS notifications"].map((label) => <div key={label} className="flex items-center justify-between border-b py-4"><span className="text-sm font-semibold">{label}</span><Switch defaultChecked/></div>)}<Button className="mt-5 h-12 w-full" onClick={() => setAddContact(false)}><Plus/> Add contact</Button></div></div>}
    </div>
  );
}