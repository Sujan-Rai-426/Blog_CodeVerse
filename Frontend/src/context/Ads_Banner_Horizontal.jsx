import React, { useEffect } from 'react';
import "../assets/css/Ads_Container.css"

const Ads_Banner_Horizontal = () => {
    useEffect(() => {
        try {
            const timer = setTimeout(() => {
                if (window.adsbygoogle) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }
            }, 150);
            return () => clearTimeout(timer);
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <div className="ct-ad-banner-wrapper" style={{ 
            width: '100%', 
            margin: '20px auto', 
            textAlign: 'center',
            overflow: 'hidden' // Prevents layout shifting
        }}>
            <span style={{ 
                display: 'block', 
                fontSize: '10px', 
                color: '#888', 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '2px'
            }}>
                Sponsored Content
            </span>
            
            <ins 
                className="adsbygoogle"
                style={{ 
                    display: 'block', // Changed from inline-block to block
                    width: '100%', 
                    aspectRatio: 8 / 1,
                    minHeight: '50px', // Minimum height for mobile
                    maxHeight: '280px' // Maximum height for large tablets/desktop
                }} 
                data-ad-client="ca-pub-5604794698656933"
                data-ad-slot="4061494851"
                data-ad-format="banner"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};

export default Ads_Banner_Horizontal;