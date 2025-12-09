import React, { useEffect, useState } from "react";
import UserAPIContext from "./User_API_Context";
import {
  fetchUserProfile as fetchProfileAPI,
  fetchFavorites as fetchFavoritesAPI,
  fetchPlaylists as fetchPlaylistsAPI,
} from "./User_API";

const User_API_Provider = ({ children }) => {
  // Load cached data first
  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem("user_profile");
    return cached ? JSON.parse(cached) : null;
  });
  const [favorites, setFavorites] = useState(() => {
    const cached = localStorage.getItem("user_favorites");
    return cached ? JSON.parse(cached) : [];
  });
  const [playlists, setPlaylists] = useState(() => {
    const cached = localStorage.getItem("user_playlists");
    return cached ? JSON.parse(cached) : [];
  });

  // NEW LOGIC: Only show loading = true if the profile has NOT been cached.
  const hasInitialData = !!profile; 
  const [loading, setLoading] = useState(!hasInitialData); 
  const [error, setError] = useState(null);

  // Background fetch (updates UI after mount, doesn't block initial render)
  const fetchAllData = async () => {
    // If we already have cached data, we don't need to show a loading state
    // while fetching new data in the background (SWR pattern).
    if (!hasInitialData) {
      setLoading(true); // Only set loading true if we have no initial data
    }

    try {
      const [profileData, favoritesData, playlistsData] = await Promise.all([
        fetchProfileAPI(),
        fetchFavoritesAPI(),
        fetchPlaylistsAPI()
      ]);

      // Update state
      setProfile(profileData);
      setFavorites(favoritesData);
      setPlaylists(playlistsData);

      // Update cache
      localStorage.setItem("user_profile", JSON.stringify(profileData));
      localStorage.setItem("user_favorites", JSON.stringify(favoritesData));
      localStorage.setItem("user_playlists", JSON.stringify(playlistsData));

      setError(null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.response?.data || err.message);
    } finally {
      // Always stop loading once the fetch attempt is complete.
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Refetch individual lists manually (refetch functions remain the same)
  const refetchFavorites = async () => {
    try {
      const favoritesData = await fetchFavoritesAPI();
      setFavorites(favoritesData);
      localStorage.setItem("user_favorites", JSON.stringify(favoritesData));
    } catch (err) {
      console.error(err);
    }
  };

  const refetchPlaylists = async () => {
    try {
      const playlistsData = await fetchPlaylistsAPI();
      setPlaylists(playlistsData);
      localStorage.setItem("user_playlists", JSON.stringify(playlistsData));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UserAPIContext.Provider
      value={{
        profile,
        favorites,
        playlists,
        loading,
        error,
        refetchFavorites,
        refetchPlaylists,
      }}
    >
      {children}
    </UserAPIContext.Provider>
  );
};

export default User_API_Provider;