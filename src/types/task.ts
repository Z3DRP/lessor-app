import { PriorityLevel, TaskStatus } from "enums/enums";
import { Property } from "./property";
import { Worker } from "./worker";

export type Task = {
  id?: number;
  tid?: string;
  lessorId: string;
  name?: string;
  workerId?: string;
  worker?: Worker;
  priority: PriorityLevel;
  takePrecedence: boolean;
  details: string;
  notes: string;
  propertyId: number;
  property: Property;
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  pausedAt?: Date;
  pausedReason?: string;
  failedAt?: Date;
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
