
export interface ExtendedCalculatorSubmission {
  projectId: string;
  projectName: string;
  name: string;
  email: string;
  phone: string;
  squareMeters: number;
  selectedTileFormat?: {
    id: string;
    name: string;
    dimensions: string;
  };
  selectedTileStyle?: {
    id: string;
    name: string;
  };
  selectedOptions: Array<{
    id: string;
    name: string;
    price: number;
    internal_cost: number;
  }>;
  questionResponses: Record<string, any>;
  notes?: string;
  projectImage?: string;
  calculatedPrice: number;
  wantsSiteVisit: boolean;
  wantsShowroomVisit: boolean;
  addressStreet?: string;
  addressCity?: string;
}

export interface SendEmailOptions {
  from: string;
  to: string[];
  subject: string;
  html: string;
  reply_to?: string;
}

export interface EmailResponse {
  data: any;
  error: any;
}
