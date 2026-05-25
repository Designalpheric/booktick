export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  stopDetails?: string;
  class: "Economy" | "Business" | "First";
  estimatedFare: number;
  currency: string;
  aircraft: string;
  amenities: string[];
}

export interface PackageItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  accommodation: string;
}

export interface PackageReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
  location: string;
}

export interface TravelPackage {
  id: string;
  slug: string;
  title: string;
  destination: string;
  country: string;
  category: "national" | "international";
  type: string[];
  duration: string;
  durationDays: number;
  priceFrom: number;
  pricePerPerson: number;
  currency: string;
  coverImage: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  reviews: PackageReview[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: PackageItineraryDay[];
  faqs: { question: string; answer: string }[];
  badge?: string;
  discount?: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  minTravellers: number;
  maxTravellers: number;
  tags: string[];
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  image: string;
  packageCount: number;
  description: string;
  popular: boolean;
}

export interface EnquiryFormData {
  name: string;
  email: string;
  mobile: string;
  destination: string;
  travelDate: string;
  travellers: number;
  packageOrFlight?: string;
  message: string;
  enquiryType: "package" | "flight" | "general";
}

export interface CustomerReview {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  package: string;
  verified: boolean;
}
