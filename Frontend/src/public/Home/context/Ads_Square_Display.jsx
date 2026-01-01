import React, { useEffect } from 'react';

const Ads_Square_Display = () => {
    useEffect(() => {
        try {
            const timer = setTimeout(() => {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }, 100);
            return () => clearTimeout(timer);
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <div className="ct-ad-wrapper" style={{ width: '100%', overflow: 'hidden' }}>

            {/* ========== ADS CONTAINER ========== */}
            <ins 
                className="adsbygoogle"
                style={{ 
                    display: 'block', 
                    minWidth: '250px',
                    height: '200px' // Changed from fixed 120px to better fit "Square" items
                }} 
                data-ad-client="ca-pub-5604794698656933"
                data-ad-slot="4061494851"
                data-ad-format="fluid" // "fluid" or "auto" is better for responsive grids
                data-full-width-responsive="true"
            ></ins>

            {/* ==== SPONSERED TAG ====== */}
            <span style={{ 
                display: 'block', 
                fontSize: '10px', 
                color: '#888', 
                textAlign: 'center',
                textTransform: 'uppercase',
                marginBottom: '5px' 
            }}>
                Sponsored
            </span>
        </div>
    );
};

export default Ads_Square_Display;