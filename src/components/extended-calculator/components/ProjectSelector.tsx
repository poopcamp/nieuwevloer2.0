
import { ExtendedProject } from '../types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Bath, Grid, Landmark } from 'lucide-react';

interface ProjectSelectorProps {
  projects: ExtendedProject[];
  selectedProject: ExtendedProject | null;
  onSelectProject: (project: ExtendedProject) => void;
}

const ProjectSelector = ({ projects, selectedProject, onSelectProject }: ProjectSelectorProps) => {
  if (projects.length === 0) {
    return <p className="text-gray-500 text-center">Geen projecttypes beschikbaar.</p>;
  }

  // Map project keys to icons
  const getProjectIcon = (iconName: string | null) => {
    switch (iconName?.toLowerCase()) {
      case 'bath':
        return <Bath className="h-5 w-5" />;
      case 'terrace':
        return <Landmark className="h-5 w-5" />;
      case 'floor':
      default:
        return <Grid className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Selecteer uw project</h3>
      
      <RadioGroup
        value={selectedProject?.id || ''}
        onValueChange={(value) => {
          const project = projects.find(p => p.id === value);
          if (project) {
            onSelectProject(project);
          }
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="space-y-2">
              <RadioGroupItem
                value={project.id}
                id={`project-${project.id}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`project-${project.id}`}
                className="flex flex-col items-center justify-center border rounded-lg p-4 cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-50"
              >
                <div className="text-gray-600 peer-data-[state=checked]:text-primary">
                  {getProjectIcon(project.icon)}
                </div>
                <p className="mt-2 font-medium text-center">{project.name}</p>
                {project.description && (
                  <p className="text-sm text-gray-500 text-center mt-1">{project.description}</p>
                )}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default ProjectSelector;
