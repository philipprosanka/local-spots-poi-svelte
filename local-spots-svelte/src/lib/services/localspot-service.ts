import { api } from "$lib/api";
import type { LocalSpot, Category } from "$lib/types/localspot-types";

export const localSpotService = {
  // Returns only spots belonging to the logged-in user (Backend filtered via JWT)
  async getAllSpots(): Promise<LocalSpot[]> {
    return await api.get("localspots");
  },

  async getSpotById(id: string): Promise<LocalSpot> {
    return await api.get(`localspots/${id}`);
  },

  async createSpot(spot: Partial<LocalSpot>): Promise<LocalSpot> {
    return await api.post("localspots", spot);
  },

  // FIXED: Removed the duplicate deleteSpot method that was here
  async deleteSpot(id: string): Promise<boolean> {
    return await api.delete(`localspots/${id}`);
  },

  async uploadImage(spotId: string, file: File): Promise<LocalSpot> {
    const formData = new FormData();
    formData.append("imagefile", file);
    return await api.postMultipart(`localspots/${spotId}/image`, formData);
  },

  /**
   * Orchestrates spot creation and image upload.
   * This keeps the Dashboard code clean and fast.
   */
  async createSpotWithImage(spotData: Partial<LocalSpot>, file: File | null): Promise<LocalSpot> {
    const newSpot = await this.createSpot(spotData);

    if (file) {
      return await this.uploadImage(newSpot._id, file);
    }
    return newSpot;
  },

  async deleteImage(spotId: string): Promise<LocalSpot> {
    return await api.delete(`localspots/${spotId}/image`);
  },

  // Returns only categories relevant to the logged-in user
  async getCategories(): Promise<Category[]> {
    return await api.get("categories");
  }
};