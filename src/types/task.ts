import { isDefaultDate } from "@/utils/shared";
import { PriorityLevel, TaskStatus } from "enums/enums";
import { TaskCategory } from "unions/unions";
import { Property } from "./property";
import { MaintenanceWorker } from "./worker";

export type Task = {
  id?: number;
  tid?: string;
  lessorId: string;
  name?: string;
  workerId?: string;
  worker?: MaintenanceWorker;
  category: TaskCategory;
  priority: PriorityLevel;
  takePrecedence: boolean;
  details: string;
  notes: string;
  propertyId?: string;
  property: Property;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  pausedAt?: string;
  pausedReason?: string;
  failedAt?: string;
  failedReason?: string;
  estimatedCost?: number;
  actualCost?: number;
  profit?: number;
  image?: string;
};

export type AssignedTask = {
  id: number;
  taskId: string;
  workerId: string;
  status: TaskStatus;
};

export const determineTaskStatus = (task: Task) => {
  if (!isDefaultDate(task?.completedAt)) return TaskStatus.Completed;
  if (!isDefaultDate(task?.failedAt)) return TaskStatus.Failed;
  if (!isDefaultDate(task?.pausedAt)) return TaskStatus.Paused;
  if (!isDefaultDate(task?.startedAt)) return TaskStatus.Started;
  return TaskStatus.Scheduled;
};

export const taskStatusDate = (task: Task) => {
  if (task?.completedAt != null && !isDefaultDate(task?.completedAt)) {
    return formattedDate(task?.completedAt);
  }
  if (task?.failedAt != null && !isDefaultDate(task?.failedAt)) {
    return formattedDate(task?.failedAt);
  }
  if (task?.pausedAt != null && !isDefaultDate(task?.pausedAt)) {
    return formattedDate(task?.pausedAt);
  }
  if (task?.startedAt != null && !isDefaultDate(task?.startedAt)) {
    return formattedDate(task?.startedAt);
  }

  return formattedDate(task?.scheduledAt);
};

export const displayDate = (dateArg: number) =>
  new Date(dateArg).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    hour12: true,
    minute: "2-digit",
  });

export const formattedDate = (dateArg: string) =>
  new Date(dateArg).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    hour12: true,
    minute: "2-digit",
  });
