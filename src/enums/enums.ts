export enum Profiles {
  Alessor = "alessor",
  Worker = "worker",
  Tenant = "tenant",
}

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

// remove Immediate prioerty level because it must be another field that is applied plus level so it can be prioerity levl bucket based
export enum PriorityLevel {
  test = "test",
  Low = "low",
  Medium = "medium",
  High = "high",
  //Immediate = "immediate",
}

export const propertyStatuses = [
  "pending",
  "in-progress",
  "completed",
  "unknown",
  "paused",
];
