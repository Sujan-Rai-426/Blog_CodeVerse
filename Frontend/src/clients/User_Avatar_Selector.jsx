// src/components/User_Avatar_Selector.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRandom } from "react-icons/fa";
import "./assets/css/User_Avatar_Selector.css"


// Dynamic Avatar URL Change
const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL

const User_Avatar_Selector = ({ avatarSeed, onAvatarChange }) => {
    const [selectedAvatar, setSelectedAvatar] = useState(avatarSeed || "");

    // Generate random seed
    const generateRandomSeed = () => {
        const randomSeed = `user_${Math.floor(Math.random() * 10000)}`;
        setSelectedAvatar(randomSeed);
        onAvatarChange(randomSeed);
    };

    // Predefined avatars (optional)
    const predefinedAvatars = [
        "user_1001", "user_1002", "user_1003", "user_1004", "user_1005",
        "user_1006", "user_1007", "user_1008", "user_1009", "user_1010",
        "user_1011", "user_1012", "user_1013", "user_1014", "user_1015",
        "user_1016", "user_1017", "user_1018", "user_1019", "user_1020",
        "user_1021", "user_1022", "user_1023",
    ];

    const handleSelect = (seed) => {
        setSelectedAvatar(seed);
        onAvatarChange(seed);
    };

    return (
        <div>
            <h3>Select Avatar</h3>
            <div className="uas-avatars-container">
                {predefinedAvatars.map((seed) => (
                    <img
                        key={seed}
                        src={`${AVATAR_BASE_URL}?seed=${seed}`}
                        alt="avatar"
                        style={{
                            width: "60px",
                            height: "60px",
                            border: seed === selectedAvatar ? "3px solid green" : "1px solid #ccc",
                            borderRadius: "50%",
                            cursor: "pointer",
                        }}
                        onClick={() => handleSelect(seed)}
                    />
                ))}
                <button onClick={generateRandomSeed} className="uas-random-btn"> <FaRandom /> </button>
            </div>
            {selectedAvatar && (
                <div className="uas-select-avatars-conntainer container">
                    <h4>Preview:</h4>
                    <img
                        src={`${AVATAR_BASE_URL}?seed=${selectedAvatar}`}
                        alt="selected-avatar"
                        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                    />
                </div>
            )}
        </div>
    );
};

export default User_Avatar_Selector;
