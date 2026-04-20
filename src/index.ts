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
  /** Enables error tracking */
  trackErrors?: boolean;
  /** Also captures console.error() calls. Requires trackErrors to be true */
  trackConsoleErrors?: boolean;
  /** Captures a replay when an error occurs, even for sessions not sampled for regular recording. Requires enableSessionReplay and consent */
  replayOnError?: boolean;
  /** Flat key/value map attached to every event (e.g. { plan: "premium", app_version: "2.1.0" }) */
  globalProperties?: GlobalProperties;
  /** Debug */
  debug?: boolean;
}

export type GlobalProperties = Record<string, string | number | boolean>;

type InitFunction = (siteId: string, options?: BetterlyticsConfig) => void;
type TrackingFunction = (eventName: string, eventProps?: object) => void;
type SetGlobalPropertiesFunction = (props: GlobalProperties) => void;
type ClearGlobalPropertiesFunction = () => void;
type GetGlobalPropertiesFunction = () => GlobalProperties;

export type Betterlytics = {
  init: InitFunction;
  event: TrackingFunction;
  setGlobalProperties: SetGlobalPropertiesFunction;
  clearGlobalProperties: ClearGlobalPropertiesFunction;
  getGlobalProperties: GetGlobalPropertiesFunction;
};

declare global {
  interface Window {
    betterlytics?: {
      event: TrackingFunction;
      setGlobalProperties?: SetGlobalPropertiesFunction;
      clearGlobalProperties?: ClearGlobalPropertiesFunction;
      getGlobalProperties?: GetGlobalPropertiesFunction;

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
    trackErrors: options.trackErrors || false,
    trackConsoleErrors: options.trackConsoleErrors || false,
    replayOnError: options.replayOnError || false,
    globalProperties: options.globalProperties || {},
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
  if (config.disableReplayOnUrls.length > 0) {
    script.setAttribute(
      "data-disable-replay-on-urls",
      config.disableReplayOnUrls.join(","),
    );
  }
  script.setAttribute("data-replay-on-error", config.replayOnError.toString());
  script.setAttribute("data-track-errors", config.trackErrors.toString());
  script.setAttribute(
    "data-track-console-errors",
    config.trackConsoleErrors.toString(),
  );
  script.setAttribute(
    "data-global-properties",
    JSON.stringify(config.globalProperties),
  );
  document.head.appendChild(script);
}

function event(eventName: string, eventProps?: object) {
  if (!isInitialized()) {
    setupPreinitalizedQueue();
  }
  window.betterlytics?.event(eventName, eventProps);
}

function setGlobalProperties(props: GlobalProperties) {
  window.betterlytics?.setGlobalProperties?.(props);
}

function clearGlobalProperties() {
  window.betterlytics?.clearGlobalProperties?.();
}

function getGlobalProperties(): GlobalProperties {
  return window.betterlytics?.getGlobalProperties?.() ?? {};
}

export default {
  init,
  event,
  setGlobalProperties,
  clearGlobalProperties,
  getGlobalProperties,
} as Betterlytics;
