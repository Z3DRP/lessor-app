import { PriorityLevel, TaskStatus } from "enums/enums";
import { Property } from "./property";
import { MaintenanceWorker } from "./worker";

export type Task = {
  id?: number;
  tid?: string;
  lessorId: string;
  name?: string;
  workerId?: string;
  worker?: MaintenanceWorker;
  priority: PriorityLevel;
  takePrecedence: boolean;
  details: string;
  notes: string;
  propertyId: number;
  property: Property;
  scheduledAt: number;
  startedAt?: number;
  completedAt?: number;
  pausedAt?: number;
  pausedReason?: string;
  failedAt?: number;
  failedReason?: string;
  estimatedCost?: number;
  actualCost?: number;
  image?: string;
};

export type AssignedTask = {
  id: number;
  taskId: number;
  workerId: number;
  status: TaskStatus;
};

export const determineTaskStatus = (task: Task) => {
  if (task.completedAt != null) return TaskStatus.Completed;
  if (task.failedAt != null) return TaskStatus.Failed;
  if (task.pausedAt != null) return TaskStatus.Paused;
  return TaskStatus.Scheduled;
};

export const formattedDate = (dateArg: number) =>
  new Date(dateArg).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    hour12: true,
    minute: "2-digit",
  });
