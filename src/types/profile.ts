import { Address } from "./property";

export interface Profile {
  id?: number;
  uid?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  address: Address;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const NewProfile = (
  fname: string,
  lname: string,
  eml: string,
  phn: string,
  usrnm: string,
  pwd: string,
  addr: Address
): Profile => {
  return {
    firstName: fname,
    lastName: lname,
    email: eml,
    phone: phn,
    username: usrnm,
    password: pwd,
    address: addr,
  };
};
