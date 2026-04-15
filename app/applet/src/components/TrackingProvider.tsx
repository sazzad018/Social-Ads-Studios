import React, { createContext, useContext, useEffect, useState } from 'react';

interface TrackingSettings {
  pixelId: string;
  fbAccessToken: string;
  ga4Id: string;
}

interface TrackingContextType {
  trackEvent: (eventName: string, eventData?: any, userData?: any) => void;
  settings: TrackingSettings | null;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<TrackingSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings.php');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
          
          if (data.ga4Id) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${data.ga4Id}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag(...args: any[]) {
              window.dataLayer.push(args);
            }
            gtag('js', new Date());
            gtag('config', data.ga4Id);
          }

          if (data.pixelId) {
            (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
              if (f.fbq) return;
              n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
              };
              if (!f._fbq) f._fbq = n;
              n.push = n;
              n.loaded = !0;
              n.version = '2.0';
              n.queue = [];
              t = b.createElement(e);
              t.async = !0;
              t.src = v;
              s = b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t, s);
            })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
            
            window.fbq('init', data.pixelId);
            window.fbq('track', 'PageView');
          }
        }
      } catch (error) {
        console.error('Failed to fetch tracking settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const trackEvent = async (eventName: string, eventData: any = {}, userData: any = {}) => {
    if (window.fbq) {
      window.fbq('track', eventName, eventData);
    }

    if (window.gtag) {
      window.gtag('event', eventName, eventData);
    }

    try {
      await fetch('/api/fb-capi.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, eventData, userData }),
      });
    } catch (error) {
      console.error('Failed to send CAPI event:', error);
    }
  };

  return (
    <TrackingContext.Provider value={{ trackEvent, settings }}>
      {children}
    </TrackingContext.Provider>
  );
};

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
    gtag: any;
    dataLayer: any[];
  }
}
