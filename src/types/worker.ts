import { MethodOfPayment } from "../enums/enums";
import { User } from "./user";

export interface Worker {
  id?: number;
  uid?: number;
  user?: User;
  startDate?: Date;
  endDate?: Date;
  title?: string;
  specilization?: string;
  payRate?: number;
  bossId?: string;
  paymentMethod?: MethodOfPayment;
}
