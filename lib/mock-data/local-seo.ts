import type { LocalKeywordRank, LocalReview, LocalSEOProfile, LocationPage } from "@/types";
import { chance, daysAgo, pick, pickMany, randFloat, randInt, rngFor, type Rng } from "./rng";
import {
  CITIES_BY_COUNTRY,
  PERSON_FIRST_NAMES,
  PERSON_LAST_NAMES,
  REVIEW_SNIPPETS,
  SEO_SERVICE_HEADS_BY_INDUSTRY,
  slugify,
} from "./constants";
import { websites } from "./websites";
import { clients } from "./clients";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

/** Per-country plausible phone number generators, matching `COUNTRIES` in constants.ts. */
const PHONE_GENERATORS: Record<string, (rng: Rng) => string> = {
  "Sri Lanka": (rng) => `+94 7${randInt(rng, 0, 9)} ${randInt(rng, 100, 999)} ${randInt(rng, 1000, 9999)}`,
  India: (rng) => `+91 ${randInt(rng, 70000, 99999)} ${randInt(rng, 10000, 99999)}`,
  "United Kingdom": (rng) => `+44 7${randInt(rng, 100, 999)} ${randInt(rng, 100000, 999999)}`,
  "United States": (rng) => `+1 (${randInt(rng, 200, 999)}) ${randInt(rng, 200, 999)}-${randInt(rng, 1000, 9999)}`,
  "United Arab Emirates": (rng) => `+971 5${randInt(rng, 0, 9)} ${randInt(rng, 100, 999)} ${randInt(rng, 1000, 9999)}`,
  Australia: (rng) => `+61 4${randInt(rng, 10, 99)} ${randInt(rng, 100, 999)} ${randInt(rng, 100, 999)}`,
  Singapore: (rng) => `+65 ${randInt(rng, 8000, 9999)} ${randInt(rng, 1000, 9999)}`,
};

function phoneFor(rng: Rng, country: string): string {
  const generate = PHONE_GENERATORS[country] ?? PHONE_GENERATORS["Sri Lanka"];
  return generate(rng);
}

function titleCase(input: string): string {
  return input.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** A plausible Mon-Sun opening-hours pattern: consistent weekday hours, a shorter Saturday, and Sunday often closed. */
function openingHoursFor(rng: Rng): { day: string; hours: string }[] {
  const openTime = pick(rng, ["8:00 AM", "9:00 AM", "9:30 AM"]);
  const weekdayClose = pick(rng, ["5:00 PM", "6:00 PM", "7:00 PM"]);
  const saturdayClose = pick(rng, ["1:00 PM", "2:00 PM", "4:00 PM"]);
  const sundayClosed = chance(rng, 0.6);
  const sundayClose = pick(rng, ["12:00 PM", "2:00 PM"]);

  return DAYS.map((day) => {
    if (day === "Sunday") {
      return { day, hours: sundayClosed ? "Closed" : `${openTime} – ${sundayClose}` };
    }
    if (day === "Saturday") {
      return { day, hours: chance(rng, 0.85) ? `${openTime} – ${saturdayClose}` : "Closed" };
    }
    return { day, hours: `${openTime} – ${weekdayClose}` };
  });
}

export const localProfiles: LocalSEOProfile[] = websites.map((website) => {
  const rng = rngFor(`local-profile-${website.id}`);
  const client = clients.find((c) => c.id === website.clientId)!;
  const heads = SEO_SERVICE_HEADS_BY_INDUSTRY[client.industry] ?? ["business"];
  const category = titleCase(pick(rng, heads));
  const address = client.address;

  return {
    id: `${website.id}_local_profile`,
    websiteId: website.id,
    businessName: client.name,
    category,
    address: address ? `${address.line1}, ${address.city}, ${address.country}` : client.country,
    phone: phoneFor(rng, client.country),
    isVerified: chance(rng, 0.85),
    napConsistencyScore: randInt(rng, 60, 100),
    averageRating: randFloat(rng, 3.5, 5.0, 1),
    totalReviews: randInt(rng, 20, 400),
    reviewsChangePct: randFloat(rng, -15, 40, 1),
    mapPackVisibilityPct: randInt(rng, 10, 95),
    openingHours: openingHoursFor(rng),
    photosCount: randInt(rng, 5, 150),
    postsLast30Days: randInt(rng, 0, 15),
  };
});

export function getLocalProfile(websiteId: string): LocalSEOProfile | undefined {
  return localProfiles.find((p) => p.websiteId === websiteId);
}

// --- Local keyword ranks -----------------------------------------------
// `LocalKeywordRank` (like `LocalReview` and `LocationPage` below) has no
// `websiteId` field of its own, so per-website grouping is tracked in a
// side map built alongside the flat exported array rather than on the
// records themselves.

const localKeywordRankEntries = websites.map((website) => {
  const rng = rngFor(`local-keywords-${website.id}`);
  const client = clients.find((c) => c.id === website.clientId)!;
  const heads = SEO_SERVICE_HEADS_BY_INDUSTRY[client.industry] ?? ["business"];
  const cities = CITIES_BY_COUNTRY[client.country] ?? [client.address?.city ?? "Colombo"];
  const count = randInt(rng, 8, 15);
  const used = new Set<string>();

  const ranks: LocalKeywordRank[] = Array.from({ length: count }, (_, i) => {
    let keyword = "";
    let location = "";
    let attempts = 0;
    do {
      const head = pick(rng, heads);
      location = pick(rng, cities);
      keyword = chance(rng, 0.5) ? `${head} near me` : `${head} in ${location}`;
      attempts++;
    } while (used.has(keyword) && attempts < 10);
    used.add(keyword);

    const inMapPack = chance(rng, 0.65);
    const isOrganicRanked = chance(rng, 0.78);

    return {
      id: `${website.id}_lkw_${i.toString().padStart(3, "0")}`,
      keyword,
      location,
      mapPackRank: inMapPack ? randInt(rng, 1, 20) : null,
      organicRank: isOrganicRanked ? randInt(rng, 1, 95) : null,
    };
  });

  return [website.id, ranks] as const;
});

const localKeywordRanksByWebsite: Record<string, LocalKeywordRank[]> = Object.fromEntries(localKeywordRankEntries);

export const localKeywordRanks: LocalKeywordRank[] = localKeywordRankEntries.flatMap(([, ranks]) => ranks);

export function getLocalKeywordRanks(websiteId: string): LocalKeywordRank[] {
  return localKeywordRanksByWebsite[websiteId] ?? [];
}

// --- Reviews -------------------------------------------------------------

const REVIEW_PLATFORMS: LocalReview["platform"][] = ["google", "google", "google", "facebook", "yelp"];

const localReviewEntries = websites.map((website) => {
  const rng = rngFor(`local-reviews-${website.id}`);
  const count = randInt(rng, 6, 10);

  const reviews: LocalReview[] = Array.from({ length: count }, (_, i) => ({
    id: `${website.id}_review_${i.toString().padStart(3, "0")}`,
    author: `${pick(rng, PERSON_FIRST_NAMES)} ${pick(rng, PERSON_LAST_NAMES)}`,
    rating: chance(rng, 0.82) ? randInt(rng, 4, 5) : 3,
    text: pick(rng, REVIEW_SNIPPETS),
    platform: pick(rng, REVIEW_PLATFORMS),
    postedAt: daysAgo(randInt(rng, 0, 240)),
    hasResponse: chance(rng, 0.55),
  })).sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

  return [website.id, reviews] as const;
});

const localReviewsByWebsite: Record<string, LocalReview[]> = Object.fromEntries(localReviewEntries);

export const localReviews: LocalReview[] = localReviewEntries.flatMap(([, reviews]) => reviews);

export function getLocalReviews(websiteId: string): LocalReview[] {
  return localReviewsByWebsite[websiteId] ?? [];
}

// --- Location pages --------------------------------------------------------

const locationPageEntries = websites.map((website) => {
  const rng = rngFor(`location-pages-${website.id}`);
  const client = clients.find((c) => c.id === website.clientId)!;
  const cities = CITIES_BY_COUNTRY[client.country] ?? [client.address?.city ?? "Colombo"];
  const count = randInt(rng, 1, Math.min(4, cities.length));
  const chosenCities = pickMany(rng, cities, count);

  const pages: LocationPage[] = chosenCities.map((city, i) => ({
    id: `${website.id}_locpage_${i.toString().padStart(2, "0")}`,
    url: `${website.url}/locations/${slugify(city)}`,
    city,
    seoScore: randInt(rng, 45, 98),
    napMatch: chance(rng, 0.8),
  }));

  return [website.id, pages] as const;
});

const locationPagesByWebsite: Record<string, LocationPage[]> = Object.fromEntries(locationPageEntries);

export const locationPages: LocationPage[] = locationPageEntries.flatMap(([, pages]) => pages);

export function getLocationPages(websiteId: string): LocationPage[] {
  return locationPagesByWebsite[websiteId] ?? [];
}
