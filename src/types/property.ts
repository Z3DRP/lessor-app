import { PropertyStatus } from "../enums/enums";

export type Address = {
  Street: string;
  City: string;
  County: string;
  State: string;
  Country: string;
  Zipcode: string;
};

export const NewAddress = (
  str: string,
  cty: string,
  county: string,
  sta: string,
  cntry: string,
  zip: string
): Address => {
  return {
    Street: str,
    City: cty,
    County: county,
    State: sta,
    Country: cntry,
    Zipcode: zip,
  };
};

export interface Property {
  id?: number;
  pid?: number;
  alessorId?: number;
  address: Address;
  bedrooms: number;
  baths: number;
  squareFootage?: number;
  isAvailable?: boolean;
  status?: PropertyStatus;
  notes?: string;
  taxRate?: number;
  taxAmountDue?: number;
  maxOccupancy?: number;
}

export const NewProperty = (
  addr: Address,
  bdrooms: number,
  bths: number,
  sqFt: number,
  isAvail: boolean,
  stat: PropertyStatus,
  notes: string,
  txRate: number,
  txAmntDue: number,
  mxOccup: number
): Property => {
  return {
    address: addr,
    bedrooms: bdrooms,
    baths: bths,
    squareFootage: sqFt,
    isAvailable: isAvail,
    status: stat,
    notes: notes,
    taxRate: txRate,
    taxAmountDue: txAmntDue,
    maxOccupancy: mxOccup,
  };
};

export type RentalProperty = {
  id?: number;
  pid?: number;
  rentalPrice?: number;
  rentDueDate?: Date;
  leaseDuration?: number;
  petFriendly?: boolean;
};

export const NewRentalProperty = (
  price: number,
  rentDue: Date,
  leaseDur: number,
  pets: boolean
): RentalProperty => {
  return {
    rentalPrice: price,
    rentDueDate: rentDue,
    leaseDuration: leaseDur,
    petFriendly: pets,
  };
};

export type SaleProperty = {
  id?: number;
  pid?: number;
  listingPrice?: number;
  appraisedPrice?: number;
  offerPrice?: number;
  finalPrice?: number;
  soldOn?: Date;
};

export const NewSaleProperty = (
  listPrice: number,
  appPrice: number,
  offrPrice: number,
  fnPrice: number
): SaleProperty => {
  return {
    listingPrice: listPrice,
    appraisedPrice: appPrice,
    offerPrice: offrPrice,
    finalPrice: fnPrice,
  };
};
