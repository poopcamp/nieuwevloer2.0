
import { Card } from "@/components/ui/card";
import { ConfiguratorState } from "../types";
import { Grid2x2, Wallpaper, Bath, Construction } from "lucide-react";

interface ProjectTypeStepProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

const ProjectTypeStep = ({ state, updateState }: ProjectTypeStepProps) => {
  const handleSelectProjectType = (type: ConfiguratorState["projectType"]) => {
    updateState({ projectType: type });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Welk type project heeft u?
      </h2>
      <p className="text-gray-600 mb-6">
        Selecteer het type project waarvoor u een richtprijs wilt berekenen
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`p-5 cursor-pointer transition-all hover:shadow-md ${
            state.projectType === "vloer" ? "bg-primary/5 border-primary/20" : ""
          }`}
          onClick={() => handleSelectProjectType("vloer")}
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${state.projectType === "vloer" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}>
              <Grid2x2 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Vloer</h3>
              <p className="text-sm text-gray-500">
                Tegels plaatsen op vloeren
              </p>
            </div>
          </div>
        </Card>
        
        <Card 
          className={`p-5 cursor-pointer transition-all hover:shadow-md ${
            state.projectType === "keukenwand" ? "bg-primary/5 border-primary/20" : ""
          }`}
          onClick={() => handleSelectProjectType("keukenwand")}
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${state.projectType === "keukenwand" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}>
              <Wallpaper className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Keukenwand</h3>
              <p className="text-sm text-gray-500">
                Tegels plaatsen op keukenwanden
              </p>
            </div>
          </div>
        </Card>
        
        <Card 
          className={`p-5 cursor-pointer transition-all hover:shadow-md ${
            state.projectType === "badkamer" ? "bg-primary/5 border-primary/20" : ""
          }`}
          onClick={() => handleSelectProjectType("badkamer")}
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${state.projectType === "badkamer" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}>
              <Bath className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Badkamer</h3>
              <p className="text-sm text-gray-500">
                Tegels voor badkamer en douche
              </p>
            </div>
          </div>
        </Card>
        
        <Card 
          className={`p-5 cursor-pointer transition-all hover:shadow-md ${
            state.projectType === "andere" ? "bg-primary/5 border-primary/20" : ""
          }`}
          onClick={() => handleSelectProjectType("andere")}
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${state.projectType === "andere" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}>
              <Construction className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Andere</h3>
              <p className="text-sm text-gray-500">
                Overige tegelprojecten
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectTypeStep;
