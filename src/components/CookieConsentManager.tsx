
import { useCookiePreferences } from "@/hooks/useCookiePreferences";
import CookieBanner from "./cookie/CookieBanner";
import CookiePreferencesDialog from "./cookie/CookiePreferencesDialog";

const CookieConsentManager = () => {
  const {
    preferences,
    showBanner,
    showPreferences,
    acceptAll,
    acceptSelected,
    handlePreferenceChange,
    openPreferences,
    closePreferences
  } = useCookiePreferences();

  if (!showBanner && !showPreferences) return null;

  return (
    <>
      {/* Main Cookie Banner */}
      {showBanner && (
        <CookieBanner 
          onAcceptAll={acceptAll} 
          onCustomize={openPreferences}
        />
      )}

      {/* Preferences Dialog */}
      <CookiePreferencesDialog
        open={showPreferences}
        onOpenChange={(open) => !open && closePreferences()}
        preferences={preferences}
        onPreferenceChange={handlePreferenceChange}
        onSave={acceptSelected}
        onCancel={closePreferences}
      />
    </>
  );
};

export default CookieConsentManager;
