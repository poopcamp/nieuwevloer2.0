
import { useState, useEffect } from "react";

export interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true and cannot be changed
  functional: true,
  analytics: true,
  marketing: false,
};

export function useCookiePreferences() {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const storedPreferences = localStorage.getItem("cookiePreferences");
    if (!storedPreferences) {
      // If no preferences are stored, show the banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    applyPreferences(allAccepted);
  };

  const acceptSelected = () => {
    applyPreferences(preferences);
  };

  const applyPreferences = (prefs: CookiePreferences) => {
    // Save preferences to localStorage
    localStorage.setItem("cookiePreferences", JSON.stringify(prefs));
    
    // Close the banner and preferences dialog
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handlePreferenceChange = (preference: keyof CookiePreferences) => {
    if (preference === "necessary") return; // Cannot change necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference],
    }));
  };

  const openPreferences = () => {
    setShowBanner(false);
    setShowPreferences(true);
  };

  const closePreferences = () => {
    setShowBanner(true);
    setShowPreferences(false);
  };

  return {
    preferences,
    showBanner,
    showPreferences,
    setShowBanner,
    setShowPreferences,
    acceptAll,
    acceptSelected,
    handlePreferenceChange,
    openPreferences,
    closePreferences
  };
}
