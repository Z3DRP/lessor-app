import { Address } from "./property";

export type Client = {
  id?: number;
  cid?: string;
  firstName: string;
  lastName: string;
  address: Address;
};
