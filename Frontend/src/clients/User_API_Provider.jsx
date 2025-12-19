import React, { useEffect, useState, useCallback, useRef } from "react";
import UserAPIContext from "./User_API_Context";
import { fetchUserProfile, fetchFavorites } from "./User_API";

const CACHE_PROFILE_KEY = "user_profile";
const CACHE_FAVORITES_KEY = "user_favorites";

const User_API_Provider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem(CACHE_PROFILE_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [favorites, setFavorites] = useState(() => {
    const cached = localStorage.getItem(CACHE_FAVORITES_KEY);
    return cached ? JSON.parse(cached) : null;
  });

  const [profileLoading, setProfileLoading] = useState(!profile);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------------- SINGLETON GUARDS ----------------
  const isFetchingProfile = useRef(false);
  const isFetchingFavorites = useRef(false);

  // ---------------- PROFILE ----------------
  const loadProfile = useCallback(async () => {
    if (profile || isFetchingProfile.current) return;
    isFetchingProfile.current = true;
    setProfileLoading(true);

    try {
      // Load from cache if available
      const cached = localStorage.getItem(CACHE_PROFILE_KEY);
      if (cached) {
        setProfile(JSON.parse(cached));
        setProfileLoading(false);
        isFetchingProfile.current = false;
        return;
      }

      // Fetch from API
      const data = await fetchUserProfile();
      setProfile(data);
      localStorage.setItem(CACHE_PROFILE_KEY, JSON.stringify(data));
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(err.response?.data || err.message);
      }
    } finally {
      setProfileLoading(false);
      isFetchingProfile.current = false;
    }
  }, [profile]);

  // ---------------- FAVORITES ----------------
  const loadFavorites = useCallback(async () => {
    if (favorites || isFetchingFavorites.current) return;
    isFetchingFavorites.current = true;
    setFavoritesLoading(true);

    try {
      const cached = localStorage.getItem(CACHE_FAVORITES_KEY);
      if (cached) {
        setFavorites(JSON.parse(cached));
        setFavoritesLoading(false);
        isFetchingFavorites.current = false;
        return;
      }

      const data = await fetchFavorites();
      setFavorites(data);
      localStorage.setItem(CACHE_FAVORITES_KEY, JSON.stringify(data));
    } catch (err) {
      console.error(err);
    } finally {
      setFavoritesLoading(false);
      isFetchingFavorites.current = false;
    }
  }, [favorites]);

  // ---------------- EFFECT ----------------
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <UserAPIContext.Provider
      value={{
        profile,
        favorites,
        profileLoading,
        favoritesLoading,
        error,
        loadFavorites,
      }}
    >
      {children}
    </UserAPIContext.Provider>
  );
};

export default User_API_Provider;
