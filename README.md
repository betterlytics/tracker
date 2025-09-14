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

You can also initialize Betterlytics with optional paramaters like this:

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

## Configuration

### Required Options

- `siteId`: Your unique site identifier from your [Betterlytics Dashboard](https://betterlytics.io)

### Optional Options

- `dynamicUrls`: Array of URL patterns to normalize (e.g., `['/users/*', '/products/*']`)
- `serverUrl`: Custom tracking server URL (defaults to `https://betterlytics.io/track`)
- `scriptUrl`: Custom analytics script URL (defaults to `https://betterlytics.io/analytics.js`)
- `enableWebVitals`: Boolean value for enabling Web Vitals tracking (defaults to `false`)
- `disableOutboundLinks`: Boolean value for disabling Outbound Link tracking (defaults to `false`)
- `outboundLinksMode`: Mode for what is being tracked for Outbound Links (Options: `"domain" | "full"` defaults to `"domain"`)
- `debug`: Boolean value for console warnings (defaults to `false`)

## Links

- [Betterlytics Website](https://betterlytics.io)
- [Documentation](https://betterlytics.io/docs)
- [Main Repository](https://github.com/betterlytics/betterlytics)
- [Issues & Support](https://github.com/betterlytics/tracker/issues)

## License

MIT
