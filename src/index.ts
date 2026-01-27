export interface BetterlyticsConfig {
  /** Custom tracking server URL (defaults to https://betterlytics.io/event) */
  serverUrl?: string;
  /** Custom analytics script URL (defaults to https://betterlytics.io/analytics.js) */
  scriptUrl?: string;
  /** Array of URL patterns to normalize (e.g., ['/users/*', '/products/*']) */
  dynamicUrls?: string[];
  /** Enable Core Web Vitals tracking */
  enableWebVitals?: boolean;
  /** Disable Outbound Link tracking */
  disableOutboundLinks?: boolean;
  /** Mode for Outbound Link tracking (defaults to "domain") */
  outboundLinksMode?: "domain" | "full";
  /** Enable Session Replay */
  enableSessionReplay?: boolean;
  /** Indicates consent is already granted; loads replay if sampled (defaults to false) */
  consentReplay?: boolean;
  /** Percent of eligible sessions to record (0-100, defaults to 5) */
  replaySample?: number;
  /** Minimum recording length required to upload/finalize (defaults to 15s) */
  replayMinDuration?: number;
  /** Auto‑stop after this many seconds of inactivity (defaults to 600s) */
  replayIdleCutoff?: number;
  /** Hard cap on total recording length (defaults to 1200s) */
  replayMaxDuration?: number;
  /** Array of URL patterns where recording is disabled (e.g., ['/users/*', '/products/*']) */
  disableReplayOnUrls?: string[];
  /** Debug */
  debug?: boolean;
}

type InitFunction = (siteId: string, options?: BetterlyticsConfig) => void;
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
    serverUrl: options.serverUrl || "https://betterlytics.io/event",
    scriptUrl: options.scriptUrl || "https://betterlytics.io/analytics.js",
    dynamicUrls: options.dynamicUrls || [],
    enableWebVitals: options.enableWebVitals || false,
    disableOutboundLinks: options.disableOutboundLinks || false,
    outboundLinksMode: options.outboundLinksMode || "domain",
    enableSessionReplay: options.enableSessionReplay || false,
    consentReplay: options.consentReplay || false,
    replaySample: options.replaySample || 5,
    replayMinDuration: options.replayMinDuration || 15,
    replayIdleCutoff: options.replayIdleCutoff || 600,
    replayMaxDuration: options.replayMaxDuration || 1200,
    disableReplayOnUrls: options.disableReplayOnUrls || [],
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
  script.setAttribute("data-web-vitals", config.enableWebVitals.toString());
  script.setAttribute(
    "data-outbound-links",
    config.disableOutboundLinks ? "off" : config.outboundLinksMode,
  );
  script.setAttribute("data-replay", config.enableSessionReplay.toString());
  script.setAttribute("data-consent-replay", config.consentReplay.toString());
  script.setAttribute("data-replay-sample", config.replaySample.toString());
  script.setAttribute(
    "data-replay-min-duration",
    config.replayMinDuration.toString(),
  );
  script.setAttribute(
    "data-replay-idle-cutoff",
    config.replayIdleCutoff.toString(),
  );
  script.setAttribute(
    "data-replay-max-duration",
    config.replayMaxDuration.toString(),
  );
  script.setAttribute(
    "data-disable-replay-on-urls",
    config.disableReplayOnUrls.join(","),
  );
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
