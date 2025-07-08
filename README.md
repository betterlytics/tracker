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
import Betterlytics from "@betterlytics/tracker";

// Initialize and get the tracking function
const betterlytics = Betterlytics({
  siteId: "your-site-id",
  dynamicUrls: ["/users/*", "/products/*"], // optional
});

// Track custom events
betterlytics("newsletter-signup", { newsletter: "weekly-digest" });
betterlytics("button-click", { button: "cta-header" });
```

### Custom Events

Track user interactions and conversions with custom events. Learn more about [custom events in our documentation](https://betterlytics.io/docs/integration/custom-events).

```javascript
// Track conversions
betterlytics("purchase", {
  product: "premium-plan",
  value: 29.99,
  currency: "USD",
});

// Track engagement
betterlytics("video-play", {
  video: "onboarding-tutorial",
  duration: 120,
});
```

### Dynamic URLs

Dynamic URLs contain variable segments that change based on user context, making them difficult to analyze collectively. Betterlytics supports single (`*`) and double (`**`) wildcards to normalize these URLs. Learn more about [dynamic URLs in our documentation](https://betterlytics.io/docs/integration/dynamic-urls).

```javascript
const betterlytics = Betterlytics({
  siteId: "your-site-id",
  dynamicUrls: ["/users/*", "/products/*/reviews", "/blog/**"],
});
```

### TypeScript

Full TypeScript support is included:

```typescript
import Betterlytics from "@betterlytics/tracker";

const betterlytics = Betterlytics({
  siteId: "your-site-id",
  dynamicUrls: ["/users/*", "/products/*"],
});

// Type-safe event tracking
betterlytics("purchase", {
  product: "premium-plan",
  value: 29.99,
});
```

## Configuration

### Required Options

- `siteId`: Your unique site identifier from your [Betterlytics Dashboard](https://betterlytics.io)

### Optional Options

- `dynamicUrls`: Array of URL patterns to normalize (e.g., `['/users/*', '/products/*']`)
- `serverUrl`: Custom tracking server URL (defaults to `https://betterlytics.io/track`)
- `scriptUrl`: Custom analytics script URL (defaults to `https://betterlytics.io/analytics.js`)

## Links

- [Betterlytics Website](https://betterlytics.io)
- [Documentation](https://betterlytics.io/docs)
- [Main Repository](https://github.com/betterlytics/betterlytics)
- [Issues & Support](https://github.com/betterlytics/tracker/issues)

## License

MIT
