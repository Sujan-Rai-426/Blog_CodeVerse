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

// ---------- Playlists ----------
export const fetchPlaylists = async () => {
  const res = await apiClient.get("/api/profile/playlists/");
  return res.data;
};

export const createPlaylist = async (name) => {
  const res = await apiClient.post("/api/profile/playlists/", { name });
  return res.data;
};

export const addToPlaylist = async (playlistId, codeId) => {
  const res = await apiClient.post(`/api/profile/playlists/${playlistId}/items/`, { code: codeId });
  return res.data;
};

// ---------- Profile ----------
export const fetchUserProfile = async () => {
  const res = await apiClient.get("/api/user-profile/");
  return res.data;
};
