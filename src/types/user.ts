import { ProfileType } from "unions/unions";

export type User = {
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

export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName[0]}${lastName[0]}`;
};
