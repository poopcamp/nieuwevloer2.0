
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";
import { useConfiguratorAppointmentDialog } from "./hooks/useConfiguratorAppointmentDialog";
import DialogContentComponent from "./DialogContent";
import DialogFooter from "./DialogFooter";
import SuccessMessage from "./SuccessMessage";
import { ConfiguratorState } from "../../configurator/types";

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
  } = useConfiguratorAppointmentDialog({
    configState: state,
    price,
    onOpenChange,
    wantsToBuyTiles,
    tilePricePerSqm,
    squareMetersWithCuttingLoss,
    tileCost
  });

  // Extract relevant information from state for display
  const tileFormat = state.projectType === 'vloer' 
    ? state.tileSize || 'Niet geselecteerd'
    : state.projectType === 'badkamer'
      ? state.bathroomTileSize || 'Niet geselecteerd'
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
