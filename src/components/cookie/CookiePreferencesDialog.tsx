
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CookiePreferences } from "@/hooks/useCookiePreferences";

interface CookiePreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: CookiePreferences;
  onPreferenceChange: (preference: keyof CookiePreferences) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CookiePreferencesDialog = ({
  open,
  onOpenChange,
  preferences,
  onPreferenceChange,
  onSave,
  onCancel
}: CookiePreferencesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cookie Voorkeuren</DialogTitle>
          <DialogDescription>
            Pas aan welke cookies u wilt accepteren. Noodzakelijke cookies zijn altijd vereist voor de werking van de website.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-3">
            <Checkbox id="necessary" checked disabled />
            <div className="space-y-1 leading-none">
              <label
                htmlFor="necessary"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Noodzakelijke cookies
              </label>
              <p className="text-xs text-muted-foreground">
                Deze cookies zijn essentieel voor het functioneren van de website en kunnen niet worden uitgeschakeld.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="functional" 
              checked={preferences.functional}
              onCheckedChange={() => onPreferenceChange("functional")}
            />
            <div className="space-y-1 leading-none">
              <label
                htmlFor="functional"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Functionele cookies
              </label>
              <p className="text-xs text-muted-foreground">
                Deze cookies onthouden uw voorkeuren en verbeteringen, zoals taalvoorkeuren en formuliergegevens.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="analytics" 
              checked={preferences.analytics}
              onCheckedChange={() => onPreferenceChange("analytics")}
            />
            <div className="space-y-1 leading-none">
              <label
                htmlFor="analytics"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Analytische cookies
              </label>
              <p className="text-xs text-muted-foreground">
                Deze cookies helpen ons inzicht te krijgen in hoe bezoekers onze website gebruiken, zodat we deze kunnen verbeteren.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="marketing" 
              checked={preferences.marketing}
              onCheckedChange={() => onPreferenceChange("marketing")}
            />
            <div className="space-y-1 leading-none">
              <label
                htmlFor="marketing"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Marketing cookies
              </label>
              <p className="text-xs text-muted-foreground">
                Deze cookies worden gebruikt om advertenties relevanter te maken voor u en uw interesses.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Annuleren
          </Button>
          <Button onClick={onSave}>
            Voorkeuren opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePreferencesDialog;
