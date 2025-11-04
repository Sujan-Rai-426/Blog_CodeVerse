import { createContext, useState } from "react";

export const Payment_Context = createContext();

export const Payment_Provider = ({ children }) => {
    const [unlockedVideos, setUnlockedVideos] = useState([]); // track unlocked video IDs

    const unlockVideo = (videoId) => {
        setUnlockedVideos((prev) => [...prev, videoId]);
    };

    const isUnlocked = (videoId) => unlockedVideos.includes(videoId);

    return (
        <Payment_Context.Provider value={{ unlockVideo, isUnlocked }}>
        {children}
        </Payment_Context.Provider>
    );
};
