import { MethodOfPayment } from "../enums/enums";
import { User } from "./user";

export interface MaintenanceWorker {
  id?: number;
  uid?: string;
  user?: User;
  startDate?: Date;
  endDate?: Date;
  title?: string;
  specilization?: string;
  payRate?: number;
  lessorId?: string;
  paymentMethod?: MethodOfPayment;
}
