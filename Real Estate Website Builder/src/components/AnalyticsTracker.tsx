import { useEffect } from 'react';

interface AnalyticsTrackerProps {
  page: string;
  title?: string;
  path?: string;
}

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
    dataLayer?: any[];
  }
}

export function AnalyticsTracker({ page, title, path }: AnalyticsTrackerProps) {
  useEffect(() => {
    const trackPageView = () => {
      const pageTitle = title || `${page.charAt(0).toUpperCase() + page.slice(1)} - Rainbow Properties`;
      const pagePath = path || window.location.pathname;

      // Google Analytics 4 tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          page_title: pageTitle,
          page_location: window.location.href,
          page_path: pagePath,
        });

        // Track custom events for SEO monitoring
        window.gtag('event', 'page_view', {
          page_title: pageTitle,
          page_location: window.location.href,
          page_path: pagePath,
          content_group1: page, // Content grouping by page type
          custom_parameter_seo_page: page
        });

        // Track specific real estate events
        if (page === 'properties') {
          window.gtag('event', 'view_property_listings', {
            content_type: 'property_search',
            page_title: pageTitle
          });
        } else if (page === 'property_detail') {
          window.gtag('event', 'view_item', {
            content_type: 'property',
            page_title: pageTitle
          });
        } else if (page === 'contact') {
          window.gtag('event', 'view_contact_page', {
            content_type: 'lead_generation',
            page_title: pageTitle
          });
        } else if (page === 'calculator') {
          window.gtag('event', 'view_calculator', {
            content_type: 'tool_usage',
            page_title: pageTitle
          });
        }
      }

      // Facebook Pixel tracking (if implemented)
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'PageView', {
          content_name: pageTitle,
          content_category: page
        });
      }

      // Custom analytics for SEO performance
      const analyticsData = {
        page,
        title: pageTitle,
        path: pagePath,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        url: window.location.href,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        screenWidth: screen.width,
        screenHeight: screen.height,
        language: navigator.language,
        platform: navigator.platform
      };

      // Store analytics data locally for admin review
      try {
        const existingData = JSON.parse(localStorage.getItem('rainbow_analytics') || '[]');
        existingData.push(analyticsData);
        
        // Keep only last 100 entries to prevent storage overflow
        if (existingData.length > 100) {
          existingData.splice(0, existingData.length - 100);
        }
        
        localStorage.setItem('rainbow_analytics', JSON.stringify(existingData));
      } catch (error) {
        console.error('Failed to store analytics data:', error);
      }

      // Send to backend for aggregation (optional)
      const sendAnalytics = async () => {
        try {
          // Note: This would need a proper analytics endpoint
          // For now, we'll skip the backend call
          // await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9fbf563b/analytics`, {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'Authorization': `Bearer ${publicAnonKey}`,
          //   },
          //   body: JSON.stringify(analyticsData)
          // });
          console.debug('Analytics tracked:', analyticsData);
        } catch (error) {
          // Fail silently - analytics shouldn't break the site
          console.debug('Analytics tracking failed:', error);
        }
      };

      // Send analytics in background
      setTimeout(sendAnalytics, 1000);
    };

    // Track immediately
    trackPageView();

    // Track on route changes (for SPA behavior)
    const handleRouteChange = () => {
      setTimeout(trackPageView, 100); // Small delay to ensure DOM updates
    };

    // Listen for browser navigation events
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [page, title, path]);

  // Track time on page for engagement metrics
  useEffect(() => {
    const startTime = Date.now();

    const trackTimeOnPage = () => {
      const timeOnPage = Date.now() - startTime;
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: 'time_on_page',
          value: timeOnPage,
          event_category: 'engagement',
          event_label: page
        });
      }

      // Track engagement milestones
      if (timeOnPage > 30000) { // 30 seconds
        window.gtag?.('event', 'engaged_session', {
          content_type: page,
          engagement_time_msec: timeOnPage
        });
      }
    };

    // Track when user leaves the page
    const handleBeforeUnload = () => {
      trackTimeOnPage();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      trackTimeOnPage(); // Track time when component unmounts
    };
  }, [page]);

  return null; // This component doesn't render anything
}

// Utility function to track custom events
export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Utility function to track conversions
export const trackConversion = (conversionType: 'contact_form' | 'phone_call' | 'property_inquiry', value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-CONVERSION_ID/' + conversionType,
      value: value || 1,
      currency: 'ZAR'
    });

    // Also track as a custom event
    window.gtag('event', conversionType, {
      event_category: 'conversion',
      event_label: conversionType,
      value: value || 1
    });
  }
};

// Utility function to track property interactions
export const trackPropertyInteraction = (action: 'view' | 'favorite' | 'share' | 'contact', propertyId: string, propertyPrice?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', `property_${action}`, {
      content_type: 'property',
      content_id: propertyId,
      value: propertyPrice,
      currency: 'ZAR',
      event_category: 'property_interaction'
    });
  }
};