
export type GDPRRequestStatus = "pending" | "rejected" | "in_progress" | "completed";

export interface GDPRRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  request_type: string;
  message: string;
  status: GDPRRequestStatus;
  admin_notes: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
}

// Interface that matches the database columns
export interface GDPRRequestDB {
  id: string;
  name: string;
  email: string;
  phone: string;
  request_type: string;
  message: string;
  status: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
}
