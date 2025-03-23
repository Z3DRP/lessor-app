import { PaymentMethod, ProfileType } from "unions/unions";

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

export type SignupRequest = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  profileType: ProfileType;
  // worker specific fields
  lessorId?: string;
  startDate?: string;
  title?: string;
  payRate?: number;
  paymentMethod?: PaymentMethod;
};
