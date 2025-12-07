// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import apiClient from "../config/apiClient";
// import "../assets/css/User_Profile.css"

// import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaCalendarAlt, FaUserEdit, FaSignOutAlt } from 'react-icons/fa';

// export default function User_Profile({ onEditClick }) {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await apiClient.get("/api/user-profile/");

//         if (res.status === 200) {
//           setProfile(res.data);
//         }
//       } catch (err) {
//         navigate("/User/Login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [navigate]);

//   const handleLogout = async () => {
//     await apiClient.post("/api/user-logout/");
//     navigate("/User/Login");
//   };

//   // Dummy stats for the dashboard feel
//     const dummyStats = {
//         posts: 42,
//         followers: 1200,
//         following: 150
//     };


//     // Skeleton Loader
//   // Inside your Admin_Update_User component, replace the simple loading message:
//   if (loading) {
//       return (
//           <div className="profile-container skeleton-container">
//               {/* SKELETON HEADER */}
//               <header className="profile-header skeleton-header">
//                   <div className="profile-avatar-wrapper">
//                       {/* Avatar Skeleton */}
//                       <div className="skeleton-element skeleton-avatar"></div>
//                   </div>
//                   <div className="profile-info-main">
//                       <div className="profile-name-actions">
//                           {/* Username Skeleton */}
//                           <div className="skeleton-element skeleton-line large"></div>
//                           {/* Action Button Skeletons */}
//                           <div className="skeleton-element skeleton-button"></div>
//                           <div className="skeleton-element skeleton-button"></div>
//                       </div>

//                       {/* Stats Bar Skeleton */}
//                       <div className="profile-stats">
//                           {Array.from({ length: 3 }).map((_, i) => (
//                               <div className="stat-item" key={i}>
//                                   <div className="skeleton-element skeleton-line small"></div>
//                                   <div className="skeleton-element skeleton-line tiny"></div>
//                               </div>
//                           ))}
//                       </div>
//                   </div>
//               </header>

//               {/* SKELETON DETAILS */}
//               <div className="profile-details-wrapper">
//                   {/* About/Bio Section Skeleton */}
//                   <section className="profile-about-section">
//                       <div className="skeleton-element skeleton-line medium"></div> {/* Full Name */}
//                       <div className="skeleton-element skeleton-line"></div>
//                       <div className="skeleton-element skeleton-line short"></div>
//                   </section>

//                   {/* Contact/Basic Info Section Skeleton */}
//                   <section className="profile-contact-section">
//                       <div className="skeleton-element skeleton-line small"></div> {/* Heading */}
//                       {Array.from({ length: 4 }).map((_, i) => (
//                           <div className="contact-item" key={i}>
//                               <div className="skeleton-element skeleton-icon"></div>
//                               <div className="skeleton-element skeleton-line"></div>
//                           </div>
//                       ))}
//                   </section>
//               </div>

//               {/* SKELETON CONTENT GRID */}
//               <section className="profile-content-section">
//                   <div className="skeleton-element skeleton-line medium centered"></div> {/* Content Heading */}
//                   <div className="content-grid">
//                       {Array.from({ length: 6 }).map((_, i) => (
//                           <div key={i} className="skeleton-element skeleton-post-card"></div>
//                       ))}
//                   </div>
//               </section>
//           </div>
//       );
//   }


//   return (

//     <div className="profile-container">
//       {profile ? (
//         <div className="profile-container">
//             <header className="profile-header">
//                 <div className="profile-avatar-wrapper">
//                     {/* Placeholder for Profile Picture */}
//                     <img
//                         src={profile.avatar_url || `https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D`}
//                         alt={`${profile.username}'s Avatar`}
//                         className="profile-avatar"
//                     />
//                 </div>
//                 <div className="profile-info-main">

//                   {/* ========= USERNAME + BTN ============ */}
//                     <div className="profile-name-actions">
//                         <h1 className="profile-username">{profile.username}</h1>
//                         <div className="profile-btn-grp">
//                           <button className="profile-edit-btn" onClick={onEditClick}>
//                               <FaUserEdit /> Edit Profile
//                           </button>
//                           <button className="profile-logout-btn" onClick={handleLogout}>
//                               <FaSignOutAlt /> Logout
//                           </button>
//                         </div>
//                     </div>

//                     {/* Stats Bar (Like FB/Insta) */}
//                     <div className="profile-stats">
//                         <div className="stat-item">
//                             <span className="stat-value">{dummyStats.posts}</span>
//                             <span className="stat-label">Posts</span>
//                         </div>
//                         <div className="stat-item">
//                             <span className="stat-value">{dummyStats.followers}</span>
//                             <span className="stat-label">Followers</span>
//                         </div>
//                         <div className="stat-item">
//                             <span className="stat-value">{dummyStats.following}</span>
//                             <span className="stat-label">Following</span>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//           {/* ===========  USER DETAIL BIO + ADDRESS ================ */}
//             <div className="profile-details-wrapper">
//                 {/* About/Bio Section (Full Name) */}
//                 <section className="profile-about-section">
//                     <h2 className="profile-full-name">{profile.full_name || "New User"}</h2>
//                     <p className="profile-bio">
//                         {profile.bio || "Welcome to my profile! This is a short bio."}
//                     </p>
//                 </section>

//                 {/* Contact/Basic Info Section */}
//                 <section className="profile-contact-section">
//                     <h3>Basic Information</h3>
//                     <div className="contact-item">
//                         <FaEnvelope className="contact-icon" />
//                         <p>{profile.email}</p>
//                     </div>
//                     <div className="contact-item">
//                         <FaPhone className="contact-icon" />
//                         <p>{profile.phone || "N/A"}</p>
//                     </div>
//                     <div className="contact-item">
//                         <FaMapMarkerAlt className="contact-icon" />
//                         <p>{profile.address || "Location not set"}</p>
//                     </div>
//                     <div className="contact-item">
//                         <FaCalendarAlt className="contact-icon" />
//                         <p>Joined: {new Date(profile.created_at).toDateString()}</p>
//                     </div>
//                 </section>
//             </div>
            
          
//             {/* Placeholder for Content (Gallery/Timeline) */}
//             <section className="profile-content-section">
//                 <h3>User Content (Posts/Activity)</h3>
//                 <div className="content-grid">
//                     {/* Grid items go here */}
//                     <div className="content-placeholder">Post 1</div>
//                     <div className="content-placeholder">Post 2</div>
//                     <div className="content-placeholder">Post 3</div>
//                     <div className="content-placeholder">Post 4</div>
//                     <div className="content-placeholder">Post 5</div>
//                     <div className="content-placeholder">Post 6</div>
//                 </div>
//             </section>

//         </div>
//       ) : (
//         <p>No profile found</p>
//       )}
//     </div>
//   );
// }










import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/apiClient";
import "../assets/css/User_Profile.css"

import { 
    FaMapMarkerAlt, FaEnvelope, FaPhone, FaCalendarAlt, FaUserEdit, 
    FaSignOutAlt, 
    // NEW ICONS
    FaHeart, FaShoppingBag, FaList, FaHistory 
} from 'react-icons/fa';

export default function User_Profile({ onEditClick }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    // 1. NEW STATE: To track the active tab
    const [activeTab, setActiveTab] = useState('Favourite'); 

    const navigate = useNavigate();

    // ... (Your useEffect, handleLogout, and dummyStats functions remain the same) ...

    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const res = await apiClient.get("/api/user-profile/");
    
            if (res.status === 200) {
              setProfile(res.data);
            }
          } catch (err) {
            navigate("/User/Login");
          } finally {
            setLoading(false);
          }
        };
    
        fetchProfile();
      }, [navigate]);
    
      const handleLogout = async () => {
        await apiClient.post("/api/user-logout/");
        navigate("/User/Login");
      };
    
      // Dummy stats for the dashboard feel
        const dummyStats = {
            posts: 42,
            followers: 1200,
            following: 150
        };


    // ... (Your Skeleton Loader JSX remains the same) ...
    if (loading) {
        // ... (Skeleton Loader JSX) ...a
    }


    // Content tab configuration
    const contentTabs = [
        { name: 'Favourite', icon: FaHeart },
        { name: 'Purchased', icon: FaShoppingBag },
        { name: 'Play List', icon: FaList },
        { name: 'History', icon: FaHistory },
    ];


    // Function to render content based on the active tab (Example logic)
    const renderContent = () => {
        // You would replace this with actual logic to fetch/filter content data
        switch (activeTab) {
            case 'Favourite':
                return Array.from({ length: 6 }).map((_, i) => (
                    <div className="content-placeholder" key={i}>Favourite Item {i + 1}</div>
                ));
            case 'Purchased':
                return Array.from({ length: 4 }).map((_, i) => (
                    <div className="content-placeholder" key={i}>Purchase Rec {i + 1}</div>
                ));
            case 'Play List':
                return Array.from({ length: 9 }).map((_, i) => (
                    <div className="content-placeholder" key={i}>Playlist Video {i + 1}</div>
                ));
            case 'History':
                return Array.from({ length: 3 }).map((_, i) => (
                    <div className="content-placeholder" key={i}>History Item {i + 1}</div>
                ));
            default:
                return null;
        }
    };


    return (
        <div className="profile-container">
            {profile ? (

            // ======================= PROFILE CONTANER ===========================
                <div className="profile-container">
                    {/* ... (Your Header, Avatar, Stats, Details, Contact sections here) ... */}
                    
                    <header className="profile-header">
                        <div className="profile-avatar-wrapper">
                            <img
                                src={profile.avatar_url || `https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D`}
                                alt={`${profile.username}'s Avatar`}
                                className="profile-avatar"
                            />
                        </div>
                        <div className="profile-info-main">
                            <div className="profile-name-actions">
                                <h1 className="profile-username">{profile.username}</h1>
                                <div className="profile-btn-grp">
                                    <button className="profile-edit-btn" onClick={onEditClick}>
                                        <FaUserEdit /> Edit Profile
                                    </button>
                                    <button className="profile-logout-btn" onClick={handleLogout}>
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            </div>
                                <p> {profile.email} </p>
                            <div className="profile-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{dummyStats.posts}</span>
                                    <span className="stat-label">Posts</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{dummyStats.followers}</span>
                                    <span className="stat-label">Followers</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{dummyStats.following}</span>
                                    <span className="stat-label">Following</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* <div className="profile-details-wrapper">
                        <section className="profile-about-section">
                            <h2 className="profile-full-name">{profile.full_name || "New User"}</h2>
                            <p className="profile-bio">
                                {profile.bio || "Welcome to my profile! This is a short bio."}
                            </p>
                        </section>

                        <section className="profile-contact-section">
                            <h3>Basic Information</h3>
                            <div className="contact-item">
                                <FaEnvelope className="contact-icon" /><p>{profile.email}</p>
                            </div>
                            <div className="contact-item">
                                <FaPhone className="contact-icon" /><p>{profile.phone || "N/A"}</p>
                            </div>
                            <div className="contact-item">
                                <FaMapMarkerAlt className="contact-icon" /><p>{profile.address || "Location not set"}</p>
                            </div>
                            <div className="contact-item">
                                <FaCalendarAlt className="contact-icon" /><p>Joined: {new Date(profile.created_at).toDateString()}</p>
                            </div>
                        </section>
                    </div> */}
                    
                    
                    {/* ========== CONTENT TABS GO HERE ========== */}
                    <section className="profile-content-section">
                        {/* 2. THE TAB BAR */}
                        <div className="profile-tab-bar">
                            {contentTabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.name}
                                        className={`profile-tab-button ${activeTab === tab.name ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab.name)}
                                        aria-label={`View ${tab.name} content`}
                                    >
                                        <IconComponent className="tab-icon" />
                                        <span className="tab-label">{tab.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Optionally display the active content heading */}
                        <h3 className="tab-content-heading">{activeTab} Content</h3>

                        {/* 3. THE DYNAMIC CONTENT GRID */}
                        <div className="content-grid">
                            {renderContent()}
                        </div>
                    </section>
                    
                </div>
            
            ) : (
                
          // ================================== SKELETON LOADER ======================
            <div className="profile-container skeleton-active">
                
                {/* 1. PROFILE HEADER SKELETON */}
                <header className="profile-header">
                    
                    {/* Avatar */}
                    <div className="profile-avatar-wrapper">
                        <div className="skeleton-element skeleton-avatar"></div>
                    </div>
                    
                    <div className="profile-info-main">
                        <div className="profile-name-actions">
                            {/* Username */}
                            <div className="skeleton-element skeleton-line large"></div>
                            
                            {/* Buttons Group */}
                            <div className="profile-btn-grp">
                                <div className="skeleton-element skeleton-button"></div>
                                <div className="skeleton-element skeleton-button"></div>
                            </div>
                        </div>
                        
                        {/* Stats Bar */}
                        <div className="profile-stats">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div className="stat-item" key={i}>
                                    <div className="skeleton-element skeleton-line small-value"></div>
                                    <div className="skeleton-element skeleton-line smallest"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>

                {/* 2. PROFILE DETAILS SKELETON (Uncommented in actual JSX to include in skeleton) */}
                <div className="profile-details-wrapper">
                    
                    {/* About Section */}
                    <section className="profile-about-section">
                        <div className="skeleton-element skeleton-line medium-title"></div>
                        <div className="skeleton-element skeleton-line full"></div>
                        <div className="skeleton-element skeleton-line full"></div>
                        <div className="skeleton-element skeleton-line medium"></div>
                    </section>

                    {/* Contact/Info Section */}
                    <section className="profile-contact-section">
                        <div className="skeleton-element skeleton-line medium-title"></div>
                        {/* Contact Items (4 items in original) */}
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div className="contact-item" key={i}>
                                <div className="skeleton-element skeleton-icon"></div>
                                <div className="skeleton-element skeleton-line contact"></div>
                            </div>
                        ))}
                    </section>
                </div>
                
                {/* 3. PROFILE CONTENT/TAB SECTION SKELETON */}
                <section className="profile-content-section">
                    
                    {/* TAB BAR SKELETON */}
                    <div className="profile-tab-bar skeleton-tab-bar">
                        {/* Assuming 4 tabs */}
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="skeleton-tab-button">
                                <div className="skeleton-element skeleton-icon-large"></div>
                                <div className="skeleton-element skeleton-line-tab-label"></div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Content Heading Skeleton */}
                    <div className="skeleton-element skeleton-line medium centered" style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}></div> 

                    {/* CONTENT GRID SKELETON */}
                    <div className="content-grid">
                        {/* Assuming 6 posts for initial load */}
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="skeleton-element skeleton-post-card"></div>
                        ))}
                    </div>
                </section>

            </div>
          )}
        </div>
    );
}