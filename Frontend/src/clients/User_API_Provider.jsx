import React, { useEffect, useState, useCallback } from "react";
import UserAPIContext from "./User_API_Context";
import apiClient from "../config/apiClient";
import { fetchUserProfile, fetchFavorites } from "./User_API";

const User_API_Provider = ({ children }) => {

  // ---------------- CACHE INIT ----------------
  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem("user_profile");
    return cached ? JSON.parse(cached) : null;
  });

  const [favorites, setFavorites] = useState(() => {
    const cached = localStorage.getItem("user_favorites");
    return cached ? JSON.parse(cached) : null; // null = not loaded yet
  });

  // ---------------- LOADING STATES ----------------
  const [profileLoading, setProfileLoading] = useState(!profile);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------------- PROFILE (CRITICAL) ----------------
  const loadProfile = useCallback(async () => {
    try {
      await apiClient.get("/api/user-profile/"); // session check

      const data = await fetchUserProfile();
      setProfile(data);
      localStorage.setItem("user_profile", JSON.stringify(data));
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(err.response?.data || err.message);
      }
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // ---------------- FAVORITES (LAZY) ----------------
  const loadFavorites = useCallback(async () => {
    if (favorites !== null) return; // already loaded

    setFavoritesLoading(true);
    try {
      const data = await fetchFavorites();
      setFavorites(data);
      localStorage.setItem("user_favorites", JSON.stringify(data));
    } catch (err) {
      console.error(err);
    } finally {
      setFavoritesLoading(false);
    }
  }, [favorites]);

  // ---------------- INIT ----------------
  useEffect(() => {
    loadProfile(); // critical only
  }, [loadProfile]);

  return (
    <UserAPIContext.Provider
      value={{
        profile,
        favorites,
        profileLoading,
        favoritesLoading,
        error,
        loadFavorites, // 👈 lazy trigger
      }}
    >
      {children}
    </UserAPIContext.Provider>
  );
};

export default User_API_Provider;
