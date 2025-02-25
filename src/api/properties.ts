import axiosInstance from "@/utils/axios";
import { Address, Property } from "@/types/property";
import { PropertyStatus } from "enums/enums";

const propertyEp = import.meta.env.VITE_PROPERTY_EP;

export const propertyApi = {
  async getProperty(pid: string) {
    const res = await axiosInstance.get(`${propertyEp}/${pid}`).catch((err) => {
      console.log("error fetching property: ", err);
      throw err;
    });
    return res?.data;
  },

  async getProperties(alsrId: string) {
    const res = await axiosInstance
      .get(`${propertyEp}/${alsrId}`)
      .catch((err) => {
        console.log("eror fetching properties: ", err);
        throw err;
      });

    return res?.data;
  },

  async createProperty(
    alsrId: string,
    address: Address,
    beds: number,
    baths: number,
    sqFt: number,
    isAvailable: boolean,
    status: PropertyStatus = PropertyStatus.Unknown,
    notes: string | undefined,
    txRate: number | undefined,
    taxAmountDue: number | undefined,
    maxOccupancy: number | undefined
  ) {
    const nwProperty: Property = {
      alessorId: alsrId,
      address: address,
      bedrooms: beds,
      baths: baths,
      squareFootage: sqFt,
      isAvailable,
      ...(status !== undefined && { status }),
      ...(notes !== undefined && { notes }),
      ...(taxAmountDue !== undefined && { taxAmountDue }),
      ...(txRate !== undefined && { taxRate: txRate }),
      ...(maxOccupancy !== undefined && { maxOccupancy }),
    };

    const res = await axiosInstance
      .post(propertyEp, nwProperty)
      .catch((err) => {
        console.log("error saving property: ", err);
        throw err;
      });

    return res?.data;
  },

  async addProperty(data: Partial<Property>) {
    const res = await axiosInstance.post(propertyEp, data).catch((err) => {
      console.log("api error: ", err);
      throw err;
    });
    return res?.data;
  },

  async updateProperty(pid: string, data: Partial<Property>) {
    const res = await axiosInstance
      .put(`${propertyEp}/${pid}`, data)
      .catch((err) => {
        console.log("error updating property: ", err);
        throw err;
      });

    return res?.data;
  },

  async deleteProeprty(pid: string) {
    const res = await axiosInstance
      .delete(`${propertyEp}/${pid}`)
      .catch((err) => {
        console.log("error deleting property: ", err);
        throw err;
      });

    return res?.data;
  },
};
