import { MethodOfPayment, PeriodType } from "enums/enums";

export interface PaymentSchedule {
  PeriodType: PeriodType;
  Method: MethodOfPayment;
}
