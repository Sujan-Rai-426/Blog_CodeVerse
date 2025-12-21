import React, { useEffect } from 'react';

const Ads_Square_Display = () => {
    useEffect(() => {
        try {
        // Small delay ensures the DOM element is fully rendered before AdSense looks for it
            const timer = setTimeout(() => {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }, 100);
            return () => clearTimeout(timer);
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <div className="ct-ad-wrapper" style={{ width: '100%', textAlign: 'center' }}>
            <ins 
                className="adsbygoogle"
                style={{ display: 'block', height: '120px' }} 
                data-ad-client="ca-pub-5604794698656933"
                data-ad-slot="4061494851"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
            <span style={{ 
                display: 'block', 
                fontSize: '12px', 
                color: '#2d2a2aff', 
                marginBottom: '5px',
                marginTop:'5px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                <b>Sponsored</b>
            </span>
        </div>
    );
};

export default Ads_Square_Display;