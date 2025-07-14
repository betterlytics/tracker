export interface BetterlyticsConfig {
  /** Custom tracking server URL (defaults to https://betterlytics.io/track) */
  serverUrl?: string;
  /** Custom analytics script URL (defaults to https://betterlytics.io/analytics.js) */
  scriptUrl?: string;
  /** Array of URL patterns to normalize (e.g., ['/users/*', '/products/*']) */
  dynamicUrls?: string[];
  /** Debug */
  debug?: boolean;
}

type InitFunction = (siteId: string, options: BetterlyticsConfig) => void;
type TrackingFunction = (eventName: string, eventProps?: object) => void;

export type Betterlytics = {
  init: InitFunction;
  event: TrackingFunction;
};

declare global {
  interface Window {
    betterlytics?: {
      event: TrackingFunction;

      // Preinitalized events
      q?: IArguments[];
    };
  }
}

function isInitialized() {
  return Boolean(document.querySelector('script[src*="analytics.js"]'));
}

function setupPreinitalizedQueue() {
  if (!window.betterlytics || !window.betterlytics.q) {
    window.betterlytics = {
      q: window.betterlytics?.q || [],
      event: function () {
        window.betterlytics!.q!.push(arguments);
      },
    };
  }
}

function init(siteId: string, options: BetterlyticsConfig = {}) {
  if (!siteId) {
    throw new Error("Betterlytics: siteId is required");
  }

  // Check if script is already loaded
  if (isInitialized()) {
    if (options.debug) {
      console.warn("Betterlytics: Already initialized");
    }
    return;
  }

  const config = {
    siteId: siteId,
    serverUrl: options.serverUrl || "https://betterlytics.io/track",
    scriptUrl: options.scriptUrl || "https://betterlytics.io/analytics.js",
    dynamicUrls: options.dynamicUrls || [],
  };

  // Preload event tracking
  setupPreinitalizedQueue();

  // Create and inject the analytics.js script
  const script = document.createElement("script");
  script.async = true;
  script.src = config.scriptUrl;
  script.setAttribute("data-site-id", config.siteId);
  script.setAttribute("data-server-url", config.serverUrl);
  script.setAttribute("data-dynamic-urls", config.dynamicUrls.join(","));
  document.head.appendChild(script);
}

function event(eventName: string, eventProps?: object) {
  if (!isInitialized()) {
    setupPreinitalizedQueue();
  }
  window.betterlytics?.event(eventName, eventProps);
}

export default {
  init,
  event,
} as Betterlytics;
