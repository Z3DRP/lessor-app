import {
  House,
  Megaphone,
  PencilRulerIcon,
  PersonStanding,
  UserRound,
} from "lucide-react";

export enum NotificationType {
  TASK = "task",
  PROPERTY = "property",
  USER = "user",
  WORKER = "worker",
  TENANT = "tenant",
  GENERAL = "general",
}

export type Notification = {
  id?: number;
  title: string;
  message: string;
  lessorId?: string;
  taskId?: string;
  userId?: string; // can be lessor, tenant, worker uid
  propertyId?: string;
  category: NotificationType;
  viewed: boolean;
  createdAt: string;
};

export const notificationIconFactory = (notiType: NotificationType) => {
  switch (notiType) {
    case NotificationType.TASK:
      return PencilRulerIcon;
    case NotificationType.PROPERTY:
      return House;
    case NotificationType.USER:
      return UserRound;
    case NotificationType.TENANT:
      return PersonStanding;
    default: //NotificationType.GENERAL:
      return Megaphone;
  }
};
