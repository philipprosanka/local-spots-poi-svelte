import { api } from "$lib/api";
import type { LocalSpot, Category } from "$lib/types/localspot-types";

export const localSpotService = {
  async getAllSpots(): Promise<LocalSpot[]> {
    return await api.get("localspots");
  },

  async getSpotById(id: string): Promise<LocalSpot> {
    return await api.get(`localspots/${id}`);
  },

  async createSpot(spot: Partial<LocalSpot>): Promise<LocalSpot> {
    return await api.post("localspots", spot);
  },

  async deleteSpot(id: string): Promise<boolean> {
    return await api.delete(`localspots/${id}`);
  },

  async uploadImage(spotId: string, file: File): Promise<LocalSpot> {
    const formData = new FormData();
    formData.append("imagefile", file);
    return await api.postMultipart(`localspots/${spotId}/image`, formData);
  },

  async createSpotWithImage(spotData: Partial<LocalSpot>, file: File | null): Promise<LocalSpot> {
    // Step 1: Create the spot
    const newSpot = await this.createSpot(spotData);

    // Step 2: If there is a file, upload it immediately
    if (file) {
      // Return the updated spot (with image)
      return await this.uploadImage(newSpot._id, file);
    }

    // Otherwise, just return the basic spot
    return newSpot;
  },

  async deleteSpot(id: string): Promise<boolean> {
    return await api.delete(`localspots/${id}`);
  },

  async deleteImage(spotId: string): Promise<LocalSpot> {
    return await api.delete(`localspots/${spotId}/image`);
  },
  

  async getCategories(): Promise<Category[]> {
    return await api.get("categories");
  }
};