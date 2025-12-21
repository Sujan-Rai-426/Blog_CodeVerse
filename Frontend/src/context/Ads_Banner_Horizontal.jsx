import React, { useEffect } from 'react';

const Ads_Banner_Horizontal = () => {
    useEffect(() => {
        try {
            const timer = setTimeout(() => {
                // Check if adsbygoogle is available and hasn't been pushed already
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
            margin: '30px 0 10px 0', 
            textAlign: 'center' 
        }}>
            <span style={{ 
                display: 'block', 
                fontSize: '10px', 
                color: '#888', 
                marginBottom: '5px',
                textTransform: 'uppercase',
                letterSpacing: '2px'
            }}>
                Sponsored Content
            </span>
            
            <ins 
                className="adsbygoogle"
                style={{ 
                    display: 'inline-block', 
                    width: '100%', 
                    height: '90px' // Standard X-axis banner height
                }} 
                data-ad-client="ca-pub-5604794698656933"
                data-ad-slot="4061494851"
                data-ad-format="horizontal" 
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};

export default Ads_Banner_Horizontal;