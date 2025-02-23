export type Task = {
  id: number;
  tid: string;
  ownerId: number;
  details: string;
  notes: string;
  propertyId: number;
  scheduledAt: Date;
  startedAt: Date;
  completedAt: Date;
  pausedAt: Date;
  pausedReason: string;
  failedAt: Date;
  failedReason: string;
};

export type AssignedTask = {
  id: number;
  taskId: number;
  workerId: number;
};
