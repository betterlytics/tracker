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

declare global {
  interface Window {
    betterlytics?: TrackingFunction & { q?: any[] };
  }
}

function Betterlytics(options: BetterlyticsConfig): TrackingFunction {
  if (!options || !options.siteId) {
    throw new Error("Betterlytics: siteId is required");
  }

  const config = {
    siteId: options.siteId,
    serverUrl: options.serverUrl || "https://betterlytics.io/track",
    scriptUrl: options.scriptUrl || "https://betterlytics.io/analytics.js",
    dynamicUrls: options.dynamicUrls || [],
  };

  // Check if script is already loaded
  if (document.querySelector('script[src*="analytics.js"]')) {
    console.warn("Betterlytics: Already initialized");
    return window.betterlytics || function () {};
  }

  // Create and inject the script
  const script = document.createElement("script");
  script.async = true;
  script.src = config.scriptUrl;
  script.setAttribute("data-site-id", config.siteId);
  script.setAttribute("data-server-url", config.serverUrl);

  if (config.dynamicUrls.length > 0) {
    script.setAttribute("data-dynamic-urls", config.dynamicUrls.join(","));
  }

  // Add script to head
  document.head.appendChild(script);

  // Initialize the queue for events sent before script loads
  window.betterlytics =
    window.betterlytics ||
    function () {
      window.betterlytics!.q = window.betterlytics!.q || [];
      window.betterlytics!.q.push(arguments);
    };

  // Return the tracking function
  return function (eventName: string, eventProps?: EventProperties) {
    if (window.betterlytics) {
      window.betterlytics(eventName, eventProps);
    }
  };
}

export default Betterlytics;