import { MethodOfPayment } from "../enums/enums";

export interface Worker {
  id?: number;
  uid?: number;
  startDate?: Date;
  endDate?: Date;
  title?: string;
  specilization?: string;
  payRate?: number;
  bossId?: string;
  paymentMethod?: MethodOfPayment;
}
