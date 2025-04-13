import { MethodOfPayment } from "../enums/enums";
import { Alessor } from "./alessor";
import { User } from "./user";

export interface MaintenanceWorker {
  id?: number;
  uid?: string;
  alessor: Alessor;
  user?: User;
  startDate?: string;
  endDate?: string;
  title?: string;
  specilization?: string;
  payRate?: number;
  lessorId?: string;
  paymentMethod?: MethodOfPayment;
}
