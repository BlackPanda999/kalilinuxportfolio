import { createFileRoute } from "@tanstack/react-router";

import { Desktop } from "@/components/os/Desktop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Osama Khan — Cyber Security & IT Specialist Portfolio" },
      {
        name: "description",
        content:
          "Explore Osama Khan's portfolio as a live Linux desktop: penetration testing projects, 30+ certifications, cloud security work, CVs and an AI assistant that answers questions about him.",
      },
      { property: "og:title", content: "Osama Khan — Cyber Security & IT Specialist Portfolio" },
      {
        property: "og:description",
        content:
          "A Linux-desktop portfolio: pen-testing projects, SIEM labs, cloud security, certifications and an AI assistant.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Desktop />;
}
