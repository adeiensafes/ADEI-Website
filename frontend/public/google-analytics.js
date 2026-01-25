// Google Analytics 4 Configuration for ADEI ENSA Fès
// Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics Measurement ID

// Google tag (gtag.js) - Global Site Tag
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Configure your Google Analytics (uncomment and replace with your ID)
// gtag('config', 'G-XXXXXXXXXX', {
//   page_title: 'ADEI ENSA Fès',
//   page_location: 'https://adei-ensaf.ma',
//   custom_map: {
//     'custom_parameter_1': 'organization_type',
//     'custom_parameter_2': 'student_association'
//   }
// });

// Enhanced ecommerce and event tracking for student engagement
gtag('config', 'GA_MEASUREMENT_ID', {
  // Enhanced measurement
  enhanced_measurement_settings: {
    scrolls: true,
    outbound_clicks: true,
    site_search: true,
    video_engagement: true,
    file_downloads: true
  },
  // Custom dimensions for student tracking
  custom_map: {
    'dimension1': 'user_type',
    'dimension2': 'student_year',
    'dimension3': 'club_membership'
  }
});

// Track page views with additional context
function trackPageView(page_title, page_location, user_type = 'visitor') {
  gtag('event', 'page_view', {
    page_title: page_title,
    page_location: page_location,
    user_type: user_type,
    organization: 'ADEI ENSA Fès'
  });
}

// Track student engagement events
function trackStudentEngagement(action, category, label, value) {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    organization: 'ADEI ENSA Fès',
    school: 'ENSA Fès'
  });
}

// Track club interactions
function trackClubInteraction(club_name, action) {
  gtag('event', 'club_interaction', {
    event_category: 'Clubs',
    event_label: club_name,
    action: action,
    organization: 'ADEI ENSA Fès'
  });
}

// Track event registrations
function trackEventRegistration(event_name, event_type) {
  gtag('event', 'event_registration', {
    event_category: 'Events',
    event_label: event_name,
    event_type: event_type,
    organization: 'ADEI ENSA Fès'
  });
}

// Track news engagement
function trackNewsEngagement(news_title, action) {
  gtag('event', 'news_engagement', {
    event_category: 'News',
    event_label: news_title,
    action: action,
    organization: 'ADEI ENSA Fès'
  });
}

// Export functions for use in React components
window.trackPageView = trackPageView;
window.trackStudentEngagement = trackStudentEngagement;
window.trackClubInteraction = trackClubInteraction;
window.trackEventRegistration = trackEventRegistration;
window.trackNewsEngagement = trackNewsEngagement;

// Automatic scroll depth tracking
let maxScroll = 0;
window.addEventListener('scroll', function() {
  const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
  if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
    maxScroll = scrollPercent;
    gtag('event', 'scroll_depth', {
      event_category: 'Engagement',
      event_label: scrollPercent + '%',
      organization: 'ADEI ENSA Fès'
    });
  }
});

console.log('Google Analytics configured for ADEI ENSA Fès');
console.log('Remember to replace GA_MEASUREMENT_ID with your actual Google Analytics ID');
