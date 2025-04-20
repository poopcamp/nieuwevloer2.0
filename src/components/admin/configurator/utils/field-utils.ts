
// Field types available in the configurator
export const fieldTypes = [
  { value: "text", label: "Tekstveld" },
  { value: "number", label: "Nummeriek veld" },
  { value: "textarea", label: "Tekstgebied" },
  { value: "select", label: "Dropdown selectie" },
  { value: "radio", label: "Radio buttons" },
  { value: "checkbox", label: "Checkbox" },
  { value: "toggle", label: "Schakelaar" },
  { value: "range", label: "Schuifbalk" },
  { value: "date", label: "Datumkiezer" },
  { value: "email", label: "E-mail veld" },
  { value: "phone", label: "Telefoonnummer" },
  { value: "dimensions", label: "Afmetingen (L×B)" },
  { value: "tile-selector", label: "Tegelselectie" },
  { value: "image-selector", label: "Afbeeldingsselectie" },
  { value: "color-picker", label: "Kleurkiezer" },
];

// Get the human-readable label for a field type
export const getFieldTypeLabel = (fieldType: string): string => {
  const fieldTypeObj = fieldTypes.find(type => type.value === fieldType);
  return fieldTypeObj ? fieldTypeObj.label : fieldType;
};

// Field option templates for different field types
export const getDefaultOptionsForFieldType = (fieldType: string): any => {
  switch (fieldType) {
    case "select":
    case "radio":
      return [
        { label: "Optie 1", value: "optie_1" },
        { label: "Optie 2", value: "optie_2" },
        { label: "Optie 3", value: "optie_3" },
      ];
    case "range":
      return {
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50
      };
    case "dimensions":
      return {
        lengthLabel: "Lengte",
        widthLabel: "Breedte",
        unit: "cm"
      };
    default:
      return [];
  }
};

// Check if a field type requires options to be set
export const fieldTypeRequiresOptions = (fieldType: string): boolean => {
  return ["select", "radio", "checkbox", "tile-selector", "image-selector"].includes(fieldType);
};

// Check if a field type can have price impact
export const fieldTypeCanHavePriceImpact = (fieldType: string): boolean => {
  return ["select", "radio", "checkbox", "toggle", "range", "tile-selector", "image-selector"].includes(fieldType);
};
