import { createFileRoute } from "@tanstack/react-router";
import { NightwatchApp } from "@/components/nightwatch-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NIGHTWATCH — Proactive Safety Companion" },
      { name: "description", content: "A high-fidelity safety companion prototype for late-night journeys." },
      { property: "og:title", content: "NIGHTWATCH — Your journey. Watched over." },
      { property: "og:description", content: "A proactive safety companion for confident late-night travel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <NightwatchApp />;
}
