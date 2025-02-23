import { CommunicationPreference } from "enums/enums";

export type NotificationSetting = {
  id: number;
  uid: number;
  setting: {
    method: CommunicationPreference;
  };
};
