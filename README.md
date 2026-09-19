# NIGHTWATCH: Your Safety Companion

Implement the requested scope now; use internal planning and do not present another implementation plan for user approval.

Create a complete high-fidelity UI/UX mobile-first prototype for NIGHTWATCH — "Proactive Safety Companion for Late-Night Journeys".

THIS PHASE IS UI/UX ONLY with realistic mock data everywhere. No backend, database, real GPS, or external APIs.

Brand & Visual Direction:
- Name: NIGHTWATCH
- Tagline: "Your journey. Watched over."
- Brand personality: Safe, Calm, Trustworthy, Modern, Premium, Human, Intelligent, Minimal
- Color Palette:
  - Primary: #F58A24 (warm orange)
  - Secondary accent: #FF9D45
  - Background: #F7F7F5 (soft off-white)
  - Surface: #FFFFFF (white rounded cards, soft shadows)
  - Primary text: #171717
  - Secondary text: #777777
  - Success: #27AE60
  - Warning: #F2B84B
  - Attention: #F58A24
  - Danger: #E55353
- Typography: Clean modern sans-serif (Inter/Plus Jakarta Sans) with strong hierarchy.
- Map presentation: Polished, clean SVG/Canvas light map styling (soft gray roads, pale water, vibrant orange route line, glowing markers, checkpoints) inspired by the layout and spacing of mobility apps in the reference images.

Key Screens & Interactive Experiences to include:
1. Splash Screen & 3-step Onboarding ("Travel with confidence", "Your journey, monitored", "Someone you trust, always connected") with progress indicators and Skip/Continue.
2. Home Dashboard: "Good evening, Alwin", hero "Ready for a journey?" card (From: Current Location, To: Where are you going?), Start Journey & Plan Journey CTA, Safety Status indicator (🟢 All systems ready), Trusted Contact (Mom - Connected), Recent Journeys.
3. Plan Journey & Route Preview: From/To inputs (Kochi → Kakkanad, Today 11:00 PM, Mom), beautiful route preview card with distance (14.2 km), duration (42 min), ETA (11:48 PM), 3 checkpoints.
4. Active Journey Screen: Immersive map view, top floating status card ("🟢 JOURNEY NORMAL"), ETA, progress bar (62%), checkpoint progress list, End Journey button, and Safety panel action.
5. Safety Status & Simulation States:
   - Dedicated Journey Safety status screen (Normal, Route On Track, Movement Normal, ETA, Contact connected)
   - Route Deviation Alert ("We noticed that your journey differs from the planned route", map comparison, I'M SAFE / CHECK JOURNEY)
   - Unexpected Stop Alert ("12 min stopped", I'M SAFE / VIEW JOURNEY)
   - Safety Check Screen ("Are you safe?", subtle pulse, 00:30 countdown, YES I'M SAFE / GET HELP)
   - Safety Confirmed state ("You're safe", CONTINUE JOURNEY)
   - Safety Check Missed escalation screen (Mom notified, last known location 11:42 PM)
6. SOS Modal & UI: Calm yet clear floating emergency action, "Need immediate help?" sheet, confirmation dialog, and simulated "SOS SENT" feedback.
7. Trusted Contact Dashboard: Desktop-responsive companion dashboard ("Mom's view") showing Alwin's live journey status, attention required alerts, route, distance, and update timestamps.
8. Notifications & History:
   - Notification Center with timestamped cards (Journey started, Deviation, Safety check, Completed)
   - Journey History list & Journey Details screen with complete vertical timeline (started, checkpoints, alerts resolved, completed)
   - Journey Completed celebration screen with summary stats
9. Trusted Contacts & Settings: Contact management (+ Add Contact modal with notification preference toggles), Profile & Settings toggles (Monitoring, Safety timer, Dark/Light appearance, Privacy).
10. Empty & Error States: Viewable states for No active journey, No notifications, Offline, Location unavailable.
11. Hackathon Journey Context Card: Segment corridor metadata card.
12. Demo Mode Bar / Quick Switcher: A sticky floating tester pill or drawer allowing hackathon judges or users to immediately switch between any journey state (Normal, Deviation, Unexpected Stop, Safety Check countdown, Missed check-in, SOS, Completed, Trusted Contact view, etc.) seamlessly.
13. Mobile Device Frame toggle: An option to view inside an iPhone shell or full responsive view.


## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
