export interface Competitor {
  id: string;
  websiteId: string;
  domain: string;
  faviconUrl?: string;
  organicKeywords: number;
  top3Keywords: number;
  top10Keywords: number;
  top20Keywords: number;
  estMonthlyTraffic: number;
  contentPages: number;
  referringDomains: number;
  technicalScore: number;
  addedAt: string;
}

export interface CompetitorKeywordGap {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number;
  ourRank: number | null;
  competitorRanks: { competitorId: string; rank: number }[];
  opportunityScore: number;
}

export interface CompetitorContentGap {
  id: string;
  topic: string;
  competitorUrl: string;
  competitorDomain: string;
  estTraffic: number;
  targetKeywords: string[];
  weCoverTopic: boolean;
}

export interface CompetitorPage {
  id: string;
  competitorId: string;
  url: string;
  title: string;
  estTraffic: number;
  topKeyword: string;
  publishedAt: string;
}
