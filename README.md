# @betterlytics/tracker

Privacy-focused, cookieless analytics for your website. Simple integration with just a few lines of code.

## Installation

Install the package using your preferred package manager:

```bash
# npm
npm install @betterlytics/tracker

# yarn
yarn add @betterlytics/tracker

# pnpm
pnpm add @betterlytics/tracker

# bun
bun add @betterlytics/tracker
```

## Usage

Import and initialize Betterlytics in your application:

```javascript
import betterlytics from "@betterlytics/tracker";

// Initialize Betterlytics
betterlytics.init("your-site-id");

// Track custom events
betterlytics.event("newsletter-signup");
betterlytics.event("button-click", { button: "cta-header" });
```

You can also initialize Betterlytics with optional parameters like this:

```javascript
import betterlytics from "@betterlytics/tracker";

// Initialize Betterlytics with optional configurations
betterlytics.init("your-site-id", {
  dynamicUrls: ["/users/*", "/products/*"], // optional
});
```

### Custom Events

Track user interactions and conversions with custom events. Learn more about [custom events in our documentation](https://betterlytics.io/docs/integration/custom-events).

```javascript
// Track conversions
betterlytics.event("purchase", {
  product: "premium-plan",
  value: 29.99,
  currency: "USD",
});

// Track engagement
betterlytics.event("video-play", {
  video: "onboarding-tutorial",
  duration: 120,
});
```

### Dynamic URLs

Dynamic URLs contain variable segments that change based on user context, making them difficult to analyze collectively. Betterlytics supports single (`*`) and double (`**`) wildcards to normalize these URLs. Learn more about [dynamic URLs in our documentation](https://betterlytics.io/docs/integration/dynamic-urls).

```javascript
betterlytics.init("your-site-id", {
  dynamicUrls: ["/users/*", "/products/*/reviews", "/blog/**"],
});
```

### Web Vitals

Web Vitals tracking is disabled by default. [Web Vitals in our documentation](https://betterlytics.io/docs/integration/web-vitals).

To enable tracking of Core Web Vitals:

```javascript
betterlytics.init("your-site-id", {
  enableWebVitals: true,
});
```

### Outbound Links

Outbound Links are the external links your users click on on your site.\
Only the domain of these links are tracked by default. [Outbound Links in our documentation](https://betterlytics.io/docs/integration/outbound-links).

To track the full Outbound Links, and not just the domain:

```javascript
betterlytics.init("your-site-id", {
  outboundLinksMode: "full",
});
```

To disable Outbound Link tracking:

```javascript
betterlytics.init("your-site-id", {
  disableOutboundLinks: true,
});
```

### Session Replay

Session Replay is disabled by default. [Session Replay in our documentation](https://betterlytics.io/docs/integration/session-replay).

To enable Session Replay:

```javascript
betterlytics.init("your-site-id", {
  enableSessionReplay: true,
});
```

You can also configure the replay settings:

```javascript
betterlytics.init("your-site-id", {
  enableSessionReplay: true,
  replaySample: 20,
  consentReplay: true,
});
```

### Error Tracking

Error tracking is disabled by default. [Error Tracking in our documentation](https://betterlytics.io/docs/integration/errors).

To enable error tracking:

```javascript
betterlytics.init("your-site-id", {
  trackErrors: true,
});
```

To also capture `console.error()` calls:

```javascript
betterlytics.init("your-site-id", {
  trackErrors: true,
  trackConsoleErrors: true,
});
```

To capture a replay when an error occurs, even for sessions not sampled for regular recording:

```javascript
betterlytics.init("your-site-id", {
  enableSessionReplay: true,
  trackErrors: true,
  replayOnError: true,
});
```

### Global Properties

Global properties are a flat key/value map attached automatically to every event sent from the client. Unlike per-event custom properties, they persist across all events and are ideal for stable identifiers like user plan tier, app version, or feature flag cohort. [Global Properties in our documentation](https://betterlytics.io/docs/integration/global-properties).

To set initial global properties on init:

```javascript
betterlytics.init("your-site-id", {
  globalProperties: {
    plan: "premium",
    app_version: "2.1.0",
  },
});
```

Update, clear, or read the global properties at runtime:

```javascript
// Merge new keys (existing keys not in the object are preserved)
betterlytics.setGlobalProperties({ plan: "enterprise" });

// Read the current map (shallow copy)
const props = betterlytics.getGlobalProperties();

// Remove all global properties
betterlytics.clearGlobalProperties();
```

Values must be `string`, `number`, or `boolean`. Invalid values are skipped with a console warning.

## Configuration

### Required Options

- `siteId`: Your unique site identifier from your [Betterlytics Dashboard](https://betterlytics.io)

### Optional Options

- `dynamicUrls`: Array of URL patterns to normalize (e.g., `['/users/*', '/products/*']`)
- `serverUrl`: Custom tracking server URL (defaults to `https://betterlytics.io/event`)
- `scriptUrl`: Custom analytics script URL (defaults to `https://betterlytics.io/analytics.js`)
- `enableWebVitals`: Boolean value for enabling Web Vitals tracking (defaults to `false`)
- `disableOutboundLinks`: Boolean value for disabling Outbound Link tracking (defaults to `false`)
- `outboundLinksMode`: Mode for what is being tracked for Outbound Links (Options: `"domain" | "full"` defaults to `"domain"`)
- `enableSessionReplay`: Boolean value for enabling Session Replay (defaults to `false`)
- `consentReplay`: Boolean value. Indicates consent is already granted (defaults to `false`)
- `replaySample`: Number (0-100). Percent of eligible sessions to record (defaults to `5`)
- `replayMinDuration`: Number (seconds). Minimum recording length required to upload/finalize (defaults to `15`)
- `replayIdleCutoff`: Number (seconds). Auto‑stop after this many seconds of inactivity (defaults to `600`)
- `replayMaxDuration`: Number (seconds). Hard cap on total recording length (defaults to `1200`)
- `disableReplayOnUrls`: Array of URL patterns where recording is disabled (defaults to `[]`)
- `trackErrors`: Boolean value for enabling error tracking (defaults to `false`)
- `trackConsoleErrors`: Boolean value for capturing `console.error()` calls. Requires `trackErrors` to be `true` (defaults to `false`)
- `replayOnError`: Boolean value for capturing a replay when an error occurs, even for sessions not sampled for regular recording. Requires `enableSessionReplay` and consent (defaults to `false`)
- `globalProperties`: Flat key/value map (`Record<string, string | number | boolean>`) attached to every event (defaults to `{}`)
- `debug`: Boolean value for console warnings (defaults to `false`)

## Links

- [Betterlytics Website](https://betterlytics.io)
- [Documentation](https://betterlytics.io/docs)
- [Main Repository](https://github.com/betterlytics/betterlytics)
- [Issues & Support](https://github.com/betterlytics/tracker/issues)

## License

MIT
