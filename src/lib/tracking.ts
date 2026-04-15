import api from "./api";

interface TrackingSettings {
  fbPixelId?: string;
  fbAccessToken?: string;
  fbTestEventCode?: string;
  ga4MeasurementId?: string;
}

let settings: TrackingSettings | null = null;

export async function initTracking() {
  try {
    const response = await api.get("/api/settings/tracking_public");

    if (response.data) {
      settings = response.data as TrackingSettings;

      if (settings.fbPixelId) {
        injectFBPixel(settings.fbPixelId);
      }

      if (settings.ga4MeasurementId) {
        injectGA4(settings.ga4MeasurementId);
      }
    }
  } catch (error) {
    console.error("Error initializing tracking:", error);
  }
}

function injectFBPixel(pixelId: string) {
  if (window.fbq) return;

  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
  );

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
}

function injectGA4(measurementId: string) {
  if (window.gtag) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
}

export async function trackEvent(
  eventName: string,
  eventData: any = {},
  userData: any = {},
) {
  // 1. Track with Facebook Pixel (Client-side)
  if (window.fbq) {
    window.fbq("track", eventName, eventData);
  }

  // 2. Track with GA4 (Client-side)
  if (window.gtag && settings?.ga4MeasurementId) {
    window.gtag("event", eventName, {
      ...eventData,
      send_to: settings.ga4MeasurementId,
    });
  }

  // 3. Track with Facebook CAPI (Server-side)
  if (settings?.fbPixelId && settings?.fbAccessToken) {
    try {
      fetch("/api/fb-capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          eventData,
          userData,
          sourceUrl: window.location.href,
        }),
      }).catch((err) => console.error("CAPI Error:", err));
    } catch (error) {
      console.error("Error sending CAPI event:", error);
    }
  }
}

// Global type definitions for tracking scripts
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
    gtag: any;
    dataLayer: any[];
  }
}
