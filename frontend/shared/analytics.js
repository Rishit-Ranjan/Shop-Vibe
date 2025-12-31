// A simple analytics service that logs events to the console.
// In a real-world application, this would be replaced with a proper analytics service.

const Analytics = {
    trackEvent: (eventName, eventData) => {
        console.log(`[Analytics] Event: ${eventName}`, eventData);
    },
};
