export interface BetterlyticsConfig {
  /** Your unique site identifier from Betterlytics */
  siteId: string;
  /** Custom tracking server URL (defaults to https://betterlytics.io/track) */
  serverUrl?: string;
  /** Custom analytics script URL (defaults to https://betterlytics.io/analytics.js) */
  scriptUrl?: string;
  /** Array of URL patterns to normalize (e.g., ['/users/*', '/products/*']) */
  dynamicUrls?: string[];
}

export interface EventProperties {
  [key: string]: string | number | boolean;
}

export type TrackingFunction = (eventName: string, eventProps?: EventProperties) => void;

/**
 * Initialize Betterlytics tracking
 * @param config Configuration options
 * @returns A function to track custom events
 */
declare function Betterlytics(config: BetterlyticsConfig): TrackingFunction;

export default Betterlytics;