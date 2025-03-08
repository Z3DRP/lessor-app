export enum CommunicationPreference {
  Email = "email",
  Phone = "phone",
  Text = "text",
}

export enum PaymentStatus {
  Accepted = "accepted",
  Rejecte = "rejected",
}

export enum PropertyStatus {
  Pending = "pending",
  InProgress = "in-progress",
  Completed = "completed",
  Unknown = "unknown",
  Paused = "paused",
}

export enum MethodOfPayment {
  Check = "check",
  Cash = "cash",
}

export enum PeriodType {
  Weekly = "weekly",
  BiWeekly = "bi-weekly",
  Monthly = "monthly",
}

export enum TaskStatus {
  Scheduled = "scheduled",
  Started = "started",
  Paused = "paused",
  Failed = "failed",
  Completed = "completed",
}

export const propertyStatuses = [
  "pending",
  "in-progress",
  "completed",
  "unknown",
  "paused",
];
