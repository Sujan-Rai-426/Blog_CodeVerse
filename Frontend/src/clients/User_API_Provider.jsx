import React, { useEffect, useState } from "react";
import UserAPIContext from "./User_API_Context";
import apiClient from "../config/apiClient";
import {
    fetchUserProfile,
    fetchFavorites,
} from "./User_API";

const User_API_Provider = ({ children }) => {

    const [profile, setProfile] = useState(() => {
        const cached = localStorage.getItem("user_profile");
        return cached ? JSON.parse(cached) : null;
    });

    const [favorites, setFavorites] = useState(() => {
        const cached = localStorage.getItem("user_favorites");
        return cached ? JSON.parse(cached) : [];
    });

    const [loading, setLoading] = useState(!profile);
    const [error, setError] = useState(null);

    const fetchAllData = async () => {
        try {
        // ✅ IMPORTANT: Ensure auth cookie/session exists
            await apiClient.get("/api/user-profile/");

            const [profileData, favoritesData] = await Promise.all([
                fetchUserProfile(),
                fetchFavorites(),
            ]);

            setProfile(profileData);
            setFavorites(favoritesData);

            localStorage.setItem("user_profile", JSON.stringify(profileData));
            localStorage.setItem("user_favorites", JSON.stringify(favoritesData));

            setError(null);
        } catch (err) {
            if (err.response?.status !== 401) {
                setError(err.response?.data || err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return (
        <UserAPIContext.Provider
            value={{
                profile,
                favorites,
                loading,
                error,
            }}
        >
            {children}
        </UserAPIContext.Provider>
    );
};

export default User_API_Provider;
