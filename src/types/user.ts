import { ProfileType } from "unions/unions";

export type Profile = {
  id?: string;
  uid?: string;
  firstName: string;
  lastName: string;
  address?: string;
  profileType: ProfileType;
  username: string;
  phone: string;
  email: string;
  password?: string;
  avatar?: File | any;
};
