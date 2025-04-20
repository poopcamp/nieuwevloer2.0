
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";
import { useAppointmentDialog } from "./dialog/useAppointmentDialog";
import DialogContentComponent from "./dialog/DialogContent";
import DialogFooter from "./DialogFooter";
import SuccessMessage from "./dialog/SuccessMessage";
import { ConfiguratorState } from "../configurator/types";
import { ensureClientPhotosBucketExists } from "@/utils/createBucket";
import { useEffect } from "react";

interface ConfiguratorAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: ConfiguratorState;
  price: number;
  wantsToBuyTiles?: boolean;
  tilePricePerSqm?: number | null;
  squareMetersWithCuttingLoss?: number;
  tileCost?: number;
}

const ConfiguratorAppointmentDialog = ({ 
  open, 
  onOpenChange, 
  state, 
  price,
  wantsToBuyTiles = false,
  tilePricePerSqm = null,
  squareMetersWithCuttingLoss = 0,
  tileCost = 0
}: ConfiguratorAppointmentDialogProps) => {
  const {
    formData,
    handleFormChange,
    handleSubmit,
    isSubmitting,
    submissionResult,
    imageFile,
    imagePreview,
    handleImageUpload,
    clearImage
  } = useAppointmentDialog({
    configState: state,
    price,
    onOpenChange,
    wantsToBuyTiles,
    tilePricePerSqm,
    squareMetersWithCuttingLoss,
    tileCost
  });

  // Ensure storage bucket exists when dialog opens
  useEffect(() => {
    if (open) {
      ensureClientPhotosBucketExists().catch(err => 
        console.error("Failed to ensure storage bucket exists:", err)
      );
    }
  }, [open]);

  // Extract relevant information from state for display
  const tileFormat = state.projectType === 'vloer' 
    ? state.tileSize || 'Niet geselecteerd'
    : state.projectType === 'badkamer'
      ? state.bathroomTileSize || 'Niet geselecteerd'
      : state.projectType === 'keukenwand'
        ? state.wallTileSize || 'Niet geselecteerd' // Ensure we display wall tile size for kitchen walls
        : 'Niet geselecteerd';

  const squareMeters = state.squareMeters || 0;
  const isSuccess = submissionResult && submissionResult.success;

  return (
    <>
      <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
        <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto p-0 flex flex-col">
          {isSuccess ? (
            <SuccessMessage email={formData.email} />
          ) : (
            <>
              <DialogContentComponent 
                tileFormat={tileFormat}
                squareMeters={squareMeters}
                calculatedPrice={price}
                formData={formData}
                onFormChange={handleFormChange}
                wantsToBuyTiles={wantsToBuyTiles}
                tilePricePerSqm={tilePricePerSqm}
                squareMetersWithCuttingLoss={squareMetersWithCuttingLoss}
                tileCost={tileCost}
                imagePreview={imagePreview}
                handleImageUpload={handleImageUpload}
                clearImage={clearImage}
              />
              
              <DialogFooter 
                isSubmitting={isSubmitting}
                onOpenChange={onOpenChange}
                handleSubmit={handleSubmit}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
};

export default ConfiguratorAppointmentDialog;
