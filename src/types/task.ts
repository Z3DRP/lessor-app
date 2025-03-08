import { TaskStatus } from "enums/enums";

export type Task = {
  id?: number;
  tid?: string;
  lessorId: string;
  workerId?: string;
  details: string;
  notes: string;
  propertyId: number;
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  pausedAt?: Date;
  pausedReason?: string;
  failedAt?: Date;
  failedReason?: string;
  image?: string;
};

export type AssignedTask = {
  id: number;
  taskId: number;
  workerId: number;
  status: TaskStatus;
};
