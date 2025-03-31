import { PropertyStatus } from "../enums/enums";

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  lat: number;
  lng: number;
};

export const NewAddress = (
  str: string,
  cty: string,
  sta: string,
  cntry: string,
  zip: string,
  lat: number,
  lng: number
): Address => {
  return {
    street: str,
    city: cty,
    state: sta,
    country: cntry,
    zipcode: zip,
    lat: lat,
    lng: lng,
  };
};

export type Property = {
  id?: number;
  pid?: string;
  alessorId?: string;
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
  image?: string;
  imageUrl?: string;
};

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

export const formattedAddress = (property: Property) => {
  return `${property?.address?.street}, ${property?.address?.city}, ${property?.address?.state}`;
};
