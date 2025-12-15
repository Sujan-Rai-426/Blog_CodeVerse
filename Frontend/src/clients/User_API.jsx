// src/api/User_API.jsx
import apiClient from "../config/apiClient";

// ---------- Favorites ----------
export const fetchFavorites = async () => {
  const res = await apiClient.get("/api/profile/favorites/");
  return res.data;
};

export const addFavorite = async (codeId) => {
  const res = await apiClient.post("/api/profile/favorites/", { code: codeId });
  return res.data;
};

export const removeFavorite = async (codeId) => {
  const res = await apiClient.delete(`/api/profile/favorites/${codeId}/`);
  return res.data;
};

// ---------- Profile ----------
export const fetchUserProfile = async () => {
  const res = await apiClient.get("/api/user-profile/");
  return res.data;
};
