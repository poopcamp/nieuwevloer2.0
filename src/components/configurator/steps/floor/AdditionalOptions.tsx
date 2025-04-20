
import { ConfiguratorState } from "../../types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip
} from "@/components/ui/tooltip";
import ExtraOptionsPopover from "./ExtraOptionsPopover";

interface AdditionalOptionsProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

// Deze component is nu vervangen door ExtraOptionsPopover
// We behouden deze component voor backwards compatibility
const AdditionalOptions = ({ state, updateState }: AdditionalOptionsProps) => {
  // We gebruiken de nieuwe ExtraOptionsPopover component
  return <ExtraOptionsPopover state={state} updateState={updateState} />;
};

export default AdditionalOptions;
