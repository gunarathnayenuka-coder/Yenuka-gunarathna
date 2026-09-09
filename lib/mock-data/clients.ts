import type { Client, ClientActivityEvent, ClientStatus } from "@/types";
import { daysAgo, makeId, pick, randFloat, randInt, rngFor } from "./rng";
import { CITIES_BY_COUNTRY, CLIENT_SEEDS, COUNTRIES, domainFor } from "./constants";
import { users } from "./organizations";

const STATUS_BY_INDEX: ClientStatus[] = [
  "active",
  "active",
  "active",
  "active",
  "active",
  "active",
  "active",
  "active",
  "onboarding",
  "active",
  "paused",
  "active",
];

const managers = users.filter((u) => u.role === "seo_manager" || u.role === "agency_owner");

export const clients: Client[] = CLIENT_SEEDS.map(({ name, industry }, index) => {
  const rng = rngFor(`client-${index}`);
  const country = index % 5 === 0 ? pick(rng, COUNTRIES) : "Sri Lanka";
  const cities = CITIES_BY_COUNTRY[country] ?? ["Colombo"];
  const status = STATUS_BY_INDEX[index] ?? "active";
  const websiteCount = index % 4 === 0 ? 2 : 1;
  const websiteIds = Array.from({ length: websiteCount }, (_, i) => makeId("web", index * 2 + i + 1));

  return {
    id: makeId("client", index + 1),
    name,
    industry,
    country,
    status,
    websiteIds,
    primaryWebsiteId: websiteIds[0],
    contactName: pick(rng, ["Priya", "Ruwan", "Anjali", "Dinesh", "Malki", "Suresh"]) + " " + pick(rng, ["Silva", "Perera", "Rathnayake", "Gomez"]),
    contactEmail: `contact@${domainFor(name)}`,
    contactPhone: `+94 7${randInt(rng, 0, 9)} ${randInt(rng, 100, 999)} ${randInt(rng, 1000, 9999)}`,
    address: {
      line1: `${randInt(rng, 1, 240)} ${pick(rng, ["Galle Road", "Duplication Road", "Marine Drive", "Union Place", "Havelock Road"])}`,
      city: pick(rng, cities),
      region: pick(rng, cities),
      postalCode: `${randInt(rng, 10000, 99999)}`,
      country,
    },
    targetAudience: `${industry} customers in ${pick(rng, cities)} and surrounding areas`,
    monthlyBudget: pick(rng, [50000, 75000, 100000, 150000, 200000, 300000]),
    accountManagerId: pick(rng, managers).id,
    seoHealthScore: randInt(rng, 58, 96),
    organicTraffic: randInt(rng, 1200, 48000),
    organicTrafficChangePct: randFloat(rng, -18, 42, 1),
    trackedKeywords: randInt(rng, 40, 320),
    top10Keywords: randInt(rng, 8, 120),
    openIssues: randInt(rng, 2, 34),
    lastAuditAt: daysAgo(randInt(rng, 0, 6)),
    createdAt: daysAgo(randInt(rng, 30, 400)),
  };
});

export function getClientById(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

const ACTIVITY_TEMPLATES: { type: ClientActivityEvent["type"]; message: (name: string) => string }[] = [
  { type: "audit_completed", message: () => "Monthly technical SEO audit completed" },
  { type: "content_published", message: () => "New blog article published and internally linked" },
  { type: "report_sent", message: () => "Monthly performance report sent to client" },
  { type: "issue_resolved", message: () => "6 broken internal links fixed" },
  { type: "keyword_ranked", message: (n) => `"${n}" entered the top 10` },
  { type: "note", message: () => "Strategy call scheduled with client stakeholders" },
];

export const clientActivity: ClientActivityEvent[] = clients.flatMap((client, ci) => {
  const rng = rngFor(`activity-${client.id}`);
  return Array.from({ length: 6 }, (_, i) => {
    const template = pick(rng, ACTIVITY_TEMPLATES);
    return {
      id: makeId(`activity-${ci}`, i + 1),
      clientId: client.id,
      type: template.type,
      message: template.message(pick(rng, ["SEO services Colombo", "best plumber near me", "affordable dental implants"])),
      actor: pick(rng, users).name,
      createdAt: daysAgo(randInt(rng, 0, 45)),
    };
  });
});
