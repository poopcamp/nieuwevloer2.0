
import { TileExample } from "@/types/homeContent";
import TileExampleItem from "./TileExampleItem";
import ActionButtons from "./components/ActionButtons";
import { useTagInputs } from "./hooks/useTagInputs";

interface TileExamplesListProps {
  tileExamples: TileExample[];
  onExamplesChange: (examples: TileExample[]) => void;
  onSave: () => void;
  saving: boolean;
}

const TileExamplesList = ({ 
  tileExamples, 
  onExamplesChange, 
  onSave,
  saving
}: TileExamplesListProps) => {
  const { 
    getTagInput, 
    updateTagInput, 
    clearTagInput,
    addTagInput 
  } = useTagInputs(tileExamples);

  const handleInputChange = (index: number, field: keyof TileExample, value: any) => {
    const updatedExamples = [...tileExamples];
    updatedExamples[index] = {
      ...updatedExamples[index],
      [field]: value
    };
    onExamplesChange(updatedExamples);
  };

  const addExample = () => {
    const newId = crypto.randomUUID();
    const newExamples = [
      ...tileExamples,
      {
        id: newId,
        name: "",
        size: "",
        image: "",
        description: "",
        finish: "",
        suitable_for: [],
        price_per_sqm: 0,
        featured: false
      }
    ];
    
    onExamplesChange(newExamples);
    addTagInput(newId);
  };

  const removeExample = (index: number) => {
    const updatedExamples = [...tileExamples];
    updatedExamples.splice(index, 1);
    onExamplesChange(updatedExamples);
  };

  const addTag = (index: number) => {
    const exampleId = tileExamples[index].id;
    const tag = getTagInput(exampleId)?.trim();
    
    if (!tag) return;
    
    const updatedExamples = [...tileExamples];
    const currentTags = updatedExamples[index].suitable_for || [];
    
    if (!currentTags.includes(tag)) {
      updatedExamples[index].suitable_for = [...currentTags, tag];
      onExamplesChange(updatedExamples);
    }
    
    clearTagInput(exampleId);
  };

  const removeTag = (exampleIndex: number, tagIndex: number) => {
    const updatedExamples = [...tileExamples];
    const currentTags = updatedExamples[exampleIndex].suitable_for || [];
    const updatedTags = [...currentTags];
    updatedTags.splice(tagIndex, 1);
    updatedExamples[exampleIndex].suitable_for = updatedTags;
    onExamplesChange(updatedExamples);
  };

  return (
    <div className="space-y-8">
      {tileExamples.map((example, index) => (
        <TileExampleItem
          key={example.id}
          example={example}
          index={index}
          onRemove={removeExample}
          onChange={handleInputChange}
          tagInput={getTagInput(example.id)}
          onTagInputChange={(value) => updateTagInput(example.id, value)}
          onAddTag={() => addTag(index)}
          onRemoveTag={(tagIndex) => removeTag(index, tagIndex)}
        />
      ))}
      
      <ActionButtons 
        onAddExample={addExample}
        onSave={onSave}
        saving={saving}
      />
    </div>
  );
};

export default TileExamplesList;
