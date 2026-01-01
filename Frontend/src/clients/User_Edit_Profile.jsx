// src/pages/User_Edit_Profile.jsx

import React, { useState, useEffect } from "react"; // IMPORTED useEffect
import { useNavigate } from "react-router-dom";
// Assuming these are accessible via the same context/imports as User_Profile
import { useUserAPI } from "./User_API_Context";
import apiClient from "../config/apiClient";
import User_Avatar_Selector from "./User_Avatar_Selector";

import "./assets/css/User_Edit_Profile.css";
// IMPORTED FaTimes for close button
import { FaUserEdit, FaLock, FaImage, FaChevronLeft, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';

// Dynamic Avatar URL Change (read from environment, assumed to be available)
const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL || "https://api.dicebear.com/9.x/open-peeps/svg";
const AUTO_CLOSE_DURATION = 5000; // 5000ms = 5 seconds

export default function User_Edit_Profile() {
    const navigate = useNavigate();
    const { profile } = useUserAPI();

    // Initial State: Use current profile data as default
    const [username, setUsername] = useState(profile?.username || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatarSeed, setAvatarSeed] = useState(profile?.avatar_seed || "");
    
    const [activeSection, setActiveSection] = useState("profile"); // 'profile', 'avatar', 'password'
    const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
    
    // NEW STATE: Loading indicator for button disabling
    const [isLoading, setIsLoading] = useState(false);

    // NEW STATE FOR PASSWORD VISIBILITY
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); 

    // Toggle function
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prev => !prev);
    };

    // NEW FUNCTION: Dismiss message
    const handleDismissMessage = () => {
        setStatusMessage({ type: '', message: '' });
    };

    // NEW HOOK: Auto-close functionality
    useEffect(() => {
        if (statusMessage.message) {
            const timer = setTimeout(() => {
                // Only auto-dismiss if the message hasn't been manually dismissed
                setStatusMessage((current) => current.message ? { type: '', message: '' } : current);
            }, AUTO_CLOSE_DURATION);
            return () => clearTimeout(timer); // Cleanup on component unmount or message change
        }
    }, [statusMessage]);



    // ************ Update Profile Detail handler ***************
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: '', message: '' });
        setIsLoading(true); // Disable button
        try {
            await apiClient.patch("/api/user-profile/", { username });
            setStatusMessage({ type: 'success', message: "✔ Username updated successfully!" });
        } catch (error) {
            setStatusMessage({ type: 'error', message: error.response?.data?.username || "❌ Failed to update username." });
        } finally {
            setIsLoading(false); // Enable button
        }
    };

    // ************* Update Profile Password handler ***************
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: '', message: '' });
        if (newPassword !== confirmPassword) {
            setStatusMessage({ type: 'error', message: "❌ New passwords do not match." });
            return;
        }
        if (newPassword.length < 8) {
            setStatusMessage({ type: 'error', message: "❌ Password must be at least 8 characters." });
            return;
        }
        setIsLoading(true); // Disable button
        try {
            await apiClient.post("/api/user/change-password/", { 
                old_password: oldPassword, 
                new_password: newPassword ,
                confirm_password: confirmPassword,
            });
            setStatusMessage({ type: 'success', message: "✔ Password updated successfully!" });
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setStatusMessage({ type: 'error', message: error.response?.data?.detail || "❌ Failed to change password. Check old password." });
        } finally {
            setIsLoading(false); // Enable button
        }
    };

    // ************* Update Profile Avatar handler *******************
    const handleSaveAvatar = async () => {
        setStatusMessage({ type: '', message: '' });
        setIsLoading(true); // Disable button
        try {
            await apiClient.patch("/api/user/avatar/", { avatar_seed: avatarSeed });
            setStatusMessage({ type: 'success', message: "✔ Avatar updated and saved!" });
            setActiveSection('profile'); // Switch back after saving
        } catch (err) {
            setStatusMessage({ type: 'error', message: "❌ Failed to save avatar." });
        } finally {
            setIsLoading(false); // Enable button
        }
    };

    // --- Render Functions ---

    const renderFormSection = () => {
        // Determine the input type based on visibility state
        const passwordInputType = isPasswordVisible ? "text" : "password";
        const ToggleIcon = isPasswordVisible ? FaEyeSlash : FaEye;

        switch (activeSection) {
            case 'avatar':
                return (
                    <div className="uep-form-section uep-avatar-section">
                        <h2><FaImage /> Edit Avatar</h2>
                        <p className="uep-hint">Select a seed to generate a new avatar. Don't forget to save!</p>
                        
                        <div className="uep-current-avatar-preview">
                            <img
                                src={`${AVATAR_BASE_URL}?seed=${avatarSeed}`}
                                alt={`${profile.username}'s Avatar`}
                                className="uep-avatar-selected"
                            />
                        </div>
                        
                        <User_Avatar_Selector
                            avatarSeed={avatarSeed}
                            onAvatarChange={setAvatarSeed}
                        />
                        <button 
                            onClick={handleSaveAvatar} 
                            className="uep-save-btn uep-mt-20"
                            disabled={isLoading} // Added disabling
                        >
                            {isLoading ? 'Saving...' : 'Save New Avatar'}
                        </button>
                    </div>
                );

            case 'password':
                return (
                    <form onSubmit={handleUpdatePassword} className="uep-form-section">
                        <h2><FaLock /> Change Password</h2>
                        
                        {/* Old Password Field */}
                        <div className="uep-form-group">
                            <label htmlFor="old_password">Old Password</label>
                            <div className="uep-password-input-wrapper">
                                <input 
                                    type="password" 
                                    id="old_password" 
                                    value={oldPassword} 
                                    onChange={(e) => setOldPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        {/* New Password Field */}
                        <div className="uep-form-group">
                            <label htmlFor="new_password">New Password</label>
                            <div className="uep-password-input-wrapper">
                                <input 
                                    type={passwordInputType} 
                                    id="new_password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    required 
                                />
                                <button type="button" onClick={togglePasswordVisibility} className="uep-password-toggle">
                                    <ToggleIcon />
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="uep-form-group">
                            <label htmlFor="confirm_password">Confirm New Password</label>
                            <div className="uep-password-input-wrapper">
                                <input 
                                    type={passwordInputType} 
                                    id="confirm_password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required 
                                />
                                <button type="button" onClick={togglePasswordVisibility} className="uep-password-toggle">
                                    <ToggleIcon />
                                </button>
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="uep-save-btn"
                            disabled={isLoading} // Added disabling
                        >
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                );

            case 'profile':
            default:
                return (
                    <form onSubmit={handleUpdateProfile} className="uep-form-section">
                        <h2><FaUserEdit /> Edit Profile Details</h2>
                        <div className="uep-form-group">
                            <label htmlFor="username">Username</label>
                            <input 
                                type="text" 
                                id="username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                                placeholder="Enter new username"
                            />
                        </div>
                        <div className="uep-form-group">
                            <label>Email (Read-only)</label>
                            <input 
                                type="email" 
                                value={profile?.email || ''} 
                                readOnly 
                                disabled
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="uep-save-btn"
                            disabled={isLoading} // Added disabling
                        >
                            {isLoading ? 'Saving...' : 'Save Username'}
                        </button>
                    </form>
                );
        }
    };

    return (
        <div className="uep-page-container">
            <header className="uep-header">
                <button className="uep-back-btn" onClick={() => navigate(-1)}>
                    <FaChevronLeft /> Back to Profile
                </button>
                <h1>Edit User Profile</h1>
            </header>

            {/* Status Message Display (UPDATED) */}
            {statusMessage.message && (
                <div className={`uep-status-message uep-status-${statusMessage.type}`}>
                    <p className="uep-status-text">{statusMessage.message}</p>
                    <button onClick={handleDismissMessage} className="uep-status-close">
                        <FaTimes />
                    </button>
                </div>
            )}

            <div className="uep-content-wrapper">
                {/* Sidebar Navigation */}
                <nav className="uep-sidebar">
                    <button 
                        className={`uep-nav-btn ${activeSection === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveSection('profile')}
                        disabled={isLoading}
                    >
                        <FaUserEdit /> Profile Details
                    </button>
                    <button 
                        className={`uep-nav-btn ${activeSection === 'avatar' ? 'active' : ''}`}
                        onClick={() => setActiveSection('avatar')}
                        disabled={isLoading}
                    >
                        <FaImage /> Change Avatar
                    </button>
                    <button 
                        className={`uep-nav-btn ${activeSection === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveSection('password')}
                        disabled={isLoading}
                    >
                        <FaLock /> Change Password
                    </button>
                </nav>

                {/* Main Form Content */}
                <main className="uep-main-content">
                    {renderFormSection()}
                </main>
            </div>
        </div>
    );
}