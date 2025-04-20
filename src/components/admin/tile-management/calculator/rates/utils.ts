
import { ProjectRates, ProjectSection } from "./types";

// Helper functie om project secties op te halen op basis van projectType
export const getProjectSections = (projectType: string): ProjectSection[] => {
  console.log("Getting project sections for:", projectType);
  
  // Default secties voor alle projecttypes
  const defaultSections: ProjectSection[] = [
    { id: "base_rates", title: "Basistarief" }
  ];

  // Specifieke secties per projecttype
  switch (projectType) {
    case "floor":
      return [
        ...defaultSections,
        { id: "floor_tile_size", title: "Vloertegel formaten" },
        { id: "floor_type", title: "Vloertegel typen" },
        { id: "floor_pattern", title: "Legpatronen" },
        { id: "additional_floor", title: "Extra opties vloer" }
      ];
    case "wall":
      return [
        ...defaultSections,
        { id: "wall_tile_size", title: "Wandtegel formaten" },
        { id: "wall_type", title: "Wandtegel typen" },
        { id: "additional_wall", title: "Extra opties wand" }
      ];
    case "bathroom":
      return [
        ...defaultSections,
        { id: "bathroom_tile_size", title: "Badkamer tegel formaten" },
        { id: "bathroom_options", title: "Badkamer opties" },
        { id: "shower_options", title: "Douche opties" },
        { id: "additional_bathroom", title: "Extra opties badkamer" }
      ];
    default:
      console.log("Using default sections for unknown project type:", projectType);
      return defaultSections;
  }
};

// Helper functie om project titel op te halen
export const getSectionTitle = (projectType: string): string => {
  switch (projectType) {
    case "floor":
      return "Vloerbetegeling tarieven";
    case "wall":
      return "Wandbetegeling tarieven";
    case "bathroom":
      return "Badkamer tarieven";
    default:
      return "Basistarief prijzen";
  }
};

// Helper functie om default rates te genereren
export const getDefaultRates = (): ProjectRates => {
  return {
    base_rates: {
      basic_installation: { name: "Basis installatie (per m²)", value: 45 },
      minimum_price: { name: "Minimum prijs project", value: 500 }
    },
    floor_tile_size: {
      size_30x30: { name: "30x30 cm", value: 1.0 },
      size_60x60: { name: "60x60 cm", value: 1.1 },
      size_80x80: { name: "80x80 cm", value: 1.2 },
      size_100x100: { name: "100x100 cm", value: 1.3 },
      size_120x120: { name: "120x120 cm", value: 1.4 }
    },
    floor_type: {
      ceramic: { name: "Keramisch", value: 1.0 },
      natural_stone: { name: "Natuursteen", value: 1.2 },
      porcelain: { name: "Porselein", value: 1.1 }
    },
    floor_pattern: {
      straight: { name: "Recht", value: 1.0 },
      diagonal: { name: "Diagonaal", value: 1.15 },
      herringbone: { name: "Visgraat", value: 1.3 },
      romeins_verband: { name: "Romeins verband", value: 1.4 }
    },
    additional_floor: {
      plinths: { name: "Plinten (per strekkende meter)", value: 15 },
      chape: { name: "Chape (per m²)", value: 28 },
      chape_primer: { name: "Chape primer (per m²)", value: 4 }
    },
    wall_tile_size: {
      size_20x20: { name: "20x20 cm", value: 1.0 },
      size_30x60: { name: "30x60 cm", value: 1.1 },
      size_60x60: { name: "60x60 cm", value: 1.2 },
      size_100x100: { name: "100x100 cm", value: 1.3 }
    },
    wall_type: {
      ceramic: { name: "Keramisch", value: 1.0 },
      natural_stone: { name: "Natuursteen", value: 1.3 },
      mosaic: { name: "Mozaïek", value: 1.5 }
    },
    additional_wall: {
      prep_work: { name: "Voorbereidend werk (per m²)", value: 12 },
      corners: { name: "Hoekprofielen (per stuk)", value: 10 }
    },
    bathroom_tile_size: {
      size_20x20: { name: "20x20 cm", value: 1.0 },
      size_30x30: { name: "30x30 cm", value: 1.0 },
      size_30x60: { name: "30x60 cm", value: 1.1 },
      size_60x60: { name: "60x60 cm", value: 1.2 }
    },
    bathroom_options: {
      floor_tiling: { name: "Vloerbetegeling", value: 48 },
      wall_tiling: { name: "Wandbetegeling", value: 52 },
      ceiling: { name: "Plafond (per m²)", value: 65 }
    },
    shower_options: {
      standard_shower: { name: "Standaard douche", value: 650 },
      walk_in_shower: { name: "Inloopdouche", value: 850 },
      shower_wall: { name: "Douchewand", value: 350 }
    },
    additional_bathroom: {
      waterproofing: { name: "Waterdichting (per m²)", value: 15 },
      niches: { name: "Inbouwnis (per stuk)", value: 120 },
      floor_drain: { name: "Vloerput", value: 80 }
    }
  };
};
