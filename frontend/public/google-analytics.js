// Google Analytics 4 Configuration
// Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics Measurement ID

// Google tag (gtag.js)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Configure your Google Analytics
// gtag('config', 'GA_MEASUREMENT_ID');

// Example usage (uncomment and replace with your ID):
// gtag('config', 'G-XXXXXXXXXX');

// Track page views
function trackPageView(page_title, page_location) {
  gtag('event', 'page_view', {
    page_title: page_title,
    page_location: page_location
  });
}

// Track custom events
function trackEvent(action, category, label, value) {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
}

// Export functions for use in React components
window.trackPageView = trackPageView;
window.trackEvent = trackEvent;