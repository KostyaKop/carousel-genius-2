export interface Slide {
  id: string;
  title: string;
  body: string;
  isCta: boolean;
}

export type AspectRatio = 'portrait' | 'square' | 'tiktok';
export type FontTheme = 'Inter' | 'Merriweather' | 'Montserrat' | 'Bebas Neue' | 'Unbounded';
export type SwipeStyle = 'arrow' | 'text' | 'hand';
export type Language = 'en' | 'uk' | 'ru';

export interface GlobalSettings {
  aspectRatio: AspectRatio;
  backgroundImage: string;
  isCustomBg: boolean;
  fontTheme: FontTheme;
  overlayOpacity: number;
  accentColor: string;
  textColor: string;
  handle: string;
  swipeStyle: SwipeStyle;
  titleScale: number;
  bodyScale: number;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  value: string;
  preview: string;
}

export interface ColorPreset {
  id: string;
  name: string;
  accent: string;
  text: string;
}

export interface UserProfile {
  id: string;
  subscription_tier: 'free' | 'pro';
  carousels_count: number;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CarouselData {
  id: string;
  user_id: string;
  title: string;
  slides: Slide[];
  settings: GlobalSettings;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}