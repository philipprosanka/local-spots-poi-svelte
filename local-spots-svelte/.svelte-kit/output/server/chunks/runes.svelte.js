import { Y as derived } from "./index2.js";
import { jwtDecode } from "jwt-decode";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "./state.svelte.js";
const PUBLIC_API_URL = "https://local-spots-poi.onrender.com";
const BASE_URL = PUBLIC_API_URL;
async function send(method, path, data, isMultipart = false) {
  const headers = {};
  const token = auth.token;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  const opts = {
    method,
    headers,
    credentials: "include"
  };
  if (data) {
    opts.body = isMultipart ? data : JSON.stringify(data);
  }
  const res = await fetch(`${BASE_URL}/${path}`, opts);
  if (!res.ok) {
    const errText = await res.text();
    console.error("API Error Body:", errText);
    if (res.status === 401) {
      auth.logout();
    }
    throw new Error(`API Error: ${res.statusText} (${res.status})`);
  }
  if (res.status === 204) return true;
  return res.json();
}
const api = {
  get: (path) => send("GET", path),
  post: (path, data) => send("POST", path, data),
  postMultipart: (path, formData) => send("POST", path, formData, true),
  delete: (path) => send("DELETE", path)
};
const localSpotService = {
  // Returns only spots belonging to the logged-in user (Backend filtered via JWT)
  async getAllSpots() {
    return await api.get("localspots");
  },
  async getSpotById(id) {
    return await api.get(`localspots/${id}`);
  },
  async createSpot(spot) {
    return await api.post("localspots", spot);
  },
  // FIXED: Removed the duplicate deleteSpot method that was here
  async deleteSpot(id) {
    return await api.delete(`localspots/${id}`);
  },
  async uploadImage(spotId, file) {
    const formData = new FormData();
    formData.append("imagefile", file);
    return await api.postMultipart(`localspots/${spotId}/image`, formData);
  },
  async createSpotWithImage(spotData, file) {
    const newSpot = await this.createSpot(spotData);
    if (file) {
      return await this.uploadImage(newSpot._id, file);
    }
    return newSpot;
  },
  async deleteImage(spotId) {
    return await api.delete(`localspots/${spotId}/image`);
  },
  // Returns only categories relevant to the logged-in user
  async getCategories() {
    return await api.get("categories");
  }
};
class AuthStore {
  token = null;
  user = null;
  #isAuthenticated = derived(() => this.token !== null);
  get isAuthenticated() {
    return this.#isAuthenticated();
  }
  set isAuthenticated($$value) {
    return this.#isAuthenticated($$value);
  }
  #isAdmin = derived(() => this.user?.isAdmin ?? false);
  get isAdmin() {
    return this.#isAdmin();
  }
  set isAdmin($$value) {
    return this.#isAdmin($$value);
  }
  constructor() {
  }
  login(tokenValue) {
    this.token = tokenValue;
    try {
      const decoded = jwtDecode(tokenValue);
      this.user = {
        _id: decoded.id || decoded._id || "",
        email: decoded.email,
        isAdmin: decoded.isAdmin || false,
        firstName: decoded.firstName || "",
        lastName: decoded.lastName || ""
      };
      userState.refresh();
    } catch (e) {
      console.error("Token Decode Error", e);
      this.logout();
    }
  }
  async logout() {
    this.token = null;
    this.user = null;
  }
}
const auth = new AuthStore();
class UserDataStore {
  // Use the generic syntax to strictly define the types
  spots = [];
  categories = [];
  async refresh() {
    if (!auth.token) return;
    try {
      const [s, c] = await Promise.all([
        localSpotService.getAllSpots(),
        localSpotService.getCategories()
      ]);
      this.spots = s;
      this.categories = c;
    } catch (e) {
      console.error("Data fetch failed", e);
    }
  }
}
const userState = new UserDataStore();
export {
  auth as a,
  userState as u
};
