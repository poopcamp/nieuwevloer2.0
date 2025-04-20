
export enum AppointmentDialogStep {
  SUMMARY = 'summary',
  FORM = 'form',
  SUCCESS = 'success',
}

export interface SubmissionResult {
  success: boolean;
  message?: string;
  bookingReference?: string;
}
