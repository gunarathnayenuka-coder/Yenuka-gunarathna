export interface LocalSEOProfile {
  id: string;
  websiteId: string;
  businessName: string;
  category: string;
  address: string;
  phone: string;
  isVerified: boolean;
  napConsistencyScore: number; // 0-100
  averageRating: number;
  totalReviews: number;
  reviewsChangePct: number;
  mapPackVisibilityPct: number; // % of tracked local keywords appearing in map pack
  openingHours: { day: string; hours: string }[];
  photosCount: number;
  postsLast30Days: number;
}

export interface LocalKeywordRank {
  id: string;
  keyword: string;
  location: string;
  mapPackRank: number | null;
  organicRank: number | null;
}

export interface LocalReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  platform: "google" | "facebook" | "yelp";
  postedAt: string;
  hasResponse: boolean;
}

export interface LocationPage {
  id: string;
  url: string;
  city: string;
  seoScore: number;
  napMatch: boolean;
}
