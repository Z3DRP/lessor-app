import { CommunicationPreference } from "enums/enums";
import { PaymentSchedule } from "./paymentSchedule";
import { User } from "./user";

export interface Alessor {
  id?: number;
  uid?: number;
  User?: User;
  bid?: string;
  totalProperties?: number;
  squareAccount?: string;
  paymentIntegrationEnabled?: boolean;
  paymentSchedule?: PaymentSchedule;
  communicationPreference?: CommunicationPreference;
}

export const NewAlessor = (
  properties: number,
  sqAcc: string | undefined,
  pymntIntegration: boolean | undefined,
  pymntSched: PaymentSchedule | undefined,
  comPref: CommunicationPreference | undefined
): Alessor => {
  return {
    totalProperties: properties,
    ...(sqAcc !== undefined ? { squareAccount: sqAcc } : {}),
    ...(pymntIntegration !== undefined
      ? { paymentIntegrationEnabled: pymntIntegration }
      : {}),
    ...(pymntSched !== undefined ? { paymentSchedule: pymntSched } : {}),
    ...(comPref !== undefined ? { communicationPreference: comPref } : {}),
  };
};
