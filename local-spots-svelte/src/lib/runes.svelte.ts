import type { LocalSpot, Category } from "./types/localspot-types";


class UserDataStore {
  // Generics for type safety
  spots = $state<LocalSpot[]>([]);
  categories = $state<Category[]>([]);

 
}

export const userState = new UserDataStore();