import axiosInstance from "@/utils/axios";
import { Address, Property } from "@/types/property";
import { PropertyStatus } from "enums/enums";

const propertyEp = import.meta.env.VITE_PROPERTY_EP;
const tempPropertiesEP = import.meta.env.VITE_TEMP_PROPERTIES_EP;

export const propertyApi = {
  async getProperty(pid: string) {
    const res = await axiosInstance.get(`${propertyEp}/${pid}`).catch((err) => {
      console.log("error fetching property: ", err);
      throw err;
    });
    return res?.data;
  },

  async getProperties(alsrId: string, page: number) {
    const res = await axiosInstance
      .get(`${tempPropertiesEP}/${alsrId}`, {
        params: { page },
      })
      .catch((err) => {
        console.log("eror fetching properties: ", err);
        throw err;
      });

    if (res?.data == undefined) {
      throw new Error("fetch properties response was undefined");
    }

    const { properties, success } = res.data;
    if (!success) {
      throw new Error("unknown error fetching properties");
    }

    return properties;
  },

  async createProperty(data: Partial<Property>) {
    const res = await axiosInstance.post(propertyEp, data).catch((err) => {
      console.log("error saving property: ", err);
      throw err;
    });

    return res?.data;
  },

  async createPropertyWithImage(
    data: Partial<Property>,
    addrs: Address,
    file?: File
  ) {
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, value.toString());
      }
    });

    formData.append("address", JSON.stringify(addrs));

    try {
      const res = await axiosInstance.post(propertyEp, formData, {
        headers: {
          // set it to undefined bc axios will pickup its formdata
          "Content-Type": undefined,
        },
      });

      return res?.data;
    } catch (err) {
      console.log("api error uploding property");
      throw err;
    }
  },

  async updateProperty(data: Partial<Property>, file?: File | undefined) {
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, value.toString());
      }
    });

    try {
      const res = await axiosInstance.post(
        `${propertyEp}/${data.alessorId}`,
        formData,
        {
          headers: {
            // set it to undefined to remove application/json headers from other requests
            "Content-Type": undefined,
          },
        }
      );

      if (res?.data == undefined) {
        throw new Error("unexpected error");
      }

      const { property } = res.data;
      return property;
    } catch (err) {
      console.log(err);
      throw err;
    }
    // const res = await axiosInstance
    //   .put(`${propertyEp}/${data.alessorId}`, data)
    //   .catch((err) => {
    //     console.log("error updating property: ", err);
    //     throw err;
    //   });

    // if (res?.data == undefined) {
    //   throw new Error("an unexpected error occurred updating property");
    // }

    // const { property, success } = res.data;

    // return { property, success };
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
