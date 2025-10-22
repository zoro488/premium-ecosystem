import ReactGA from 'react-ga4';

let initialized = false;

export const initGA = () => {
  if (initialized) return;

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (measurementId && import.meta.env.PROD) {
    ReactGA.initialize(measurementId, {
      gtagOptions: {
        send_page_view: false, // We'll send pageviews manually
      },
    });
    initialized = true;
    // console.log('Google Analytics initialized');
  }
};

export const logPageView = (path) => {
  if (!initialized) return;

  ReactGA.send({
    hitType: 'pageview',
    page: path,
    title: document.title,
  });
};

export const logEvent = (category, action, label = '', value = 0) => {
  if (!initialized) return;

  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Specific event tracking helpers
export const trackAppNavigation = (_appName) => {
  logEvent('Navigation', 'app_visit', _appName);
};

export const trackFeatureUse = (feature, details = '') => {
  logEvent('Feature', 'use', `${feature}${details ? ` - ${details}` : ''}`);
};

export const trackError = (error, componentStack = '') => {
  logEvent(
    'Error',
    'exception',
    `${error.toString()}${componentStack ? ` - ${componentStack}` : ''}`
  );
};

export const trackSearch = (searchTerm, resultsCount) => {
  logEvent('Search', 'query', searchTerm, resultsCount);
};

export const trackFormSubmission = (formName, success = true) => {
  logEvent('Form', success ? 'submit_success' : 'submit_error', formName);
};

export const trackExport = (dataType, format) => {
  logEvent('Export', 'data', `${dataType} - ${format}`);
};

export const trackAIInteraction = (action, details = '') => {
  logEvent('AI', action, details);
};
