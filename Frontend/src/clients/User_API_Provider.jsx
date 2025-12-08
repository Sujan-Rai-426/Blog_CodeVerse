// src/context/User_API_Provider.jsx
import React, { useEffect, useState } from "react";
import UserAPIContext from "./User_API_Context";
import {
  fetchUserProfile as fetchProfileAPI,
  fetchFavorites as fetchFavoritesAPI,
  fetchPlaylists as fetchPlaylistsAPI,
} from "./User_API";

const User_API_Provider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const profileData = await fetchProfileAPI();
      const favoritesData = await fetchFavoritesAPI();
      const playlistsData = await fetchPlaylistsAPI();

      setProfile(profileData);
      setFavorites(favoritesData);
      setPlaylists(playlistsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refetchFavorites = async () => {
    try {
      const favoritesData = await fetchFavoritesAPI();
      setFavorites(favoritesData);
    } catch (err) {
      console.error(err);
    }
  };

  const refetchPlaylists = async () => {
    try {
      const playlistsData = await fetchPlaylistsAPI();
      setPlaylists(playlistsData);
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