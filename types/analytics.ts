export interface GSCQueryRow {
  id: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  clicksChangePct: number;
  positionChange: number;
}

export interface GSCPageRow {
  id: string;
  url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCSummary {
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
  clicksChangePct: number;
  impressionsChangePct: number;
  positionChange: number;
  clicksSeries: { date: string; clicks: number; impressions: number }[];
}

export interface GA4Summary {
  users: number;
  usersChangePct: number;
  sessions: number;
  sessionsChangePct: number;
  organicSessions: number;
  organicSessionsChangePct: number;
  conversions: number;
  conversionsChangePct: number;
  engagementRate: number;
  avgSessionDurationSec: number;
  sessionsSeries: { date: string; sessions: number; organicSessions: number }[];
}

export interface GA4LandingPage {
  id: string;
  url: string;
  sessions: number;
  organicSessions: number;
  conversions: number;
  engagementRate: number;
  changePct: number;
}

export interface TrafficChangeInsight {
  id: string;
  headline: string;
  changePct: number;
  direction: "up" | "down";
  reasons: string[];
  recommendedAction: string;
}
