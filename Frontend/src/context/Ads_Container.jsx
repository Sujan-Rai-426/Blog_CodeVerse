// <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6317483086789968"
//      crossorigin="anonymous"></script>
// <ins class="adsbygoogle"
//      style="display:block; text-align:center;"
//      data-ad-layout="in-article"
//      data-ad-format="fluid"
//      data-ad-client="ca-pub-6317483086789968"
//      data-ad-slot="1762434579"></ins>
// <script>
//      (adsbygoogle = window.adsbygoogle || []).push({});
// </script>

import { useEffect, useState, useRef } from "react";
import '../assets/css/Ads_Container.css'

export default function Ads_Container({ onComplete, client, slot, style, boxType }) {
  const [timer, setTimer] = useState(5);
  const [adLoaded, setAdLoaded] = useState(false);
  const adRef = useRef(null);

  useEffect(() => {
    const countdown = setInterval(() => setTimer(prev => prev - 1), 1000); //timer count in ms [ i.e 500ms = 5s ]
    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    if (timer <= 0) onComplete();
  }, [timer, onComplete]);

  useEffect(() => {
    const tryPushAd = () => {
      if (window.adsbygoogle && adRef.current) {
        try {
          window.adsbygoogle.push({});
        } catch (e) {
          console.warn("AdSense push error:", e);
        }
      }
    };
    tryPushAd();

    const checkAd = setInterval(() => {
      if (adRef.current && adRef.current.children.length > 0) {
        setAdLoaded(true);
        clearInterval(checkAd);
      }
    }, 500);

    return () => clearInterval(checkAd);
  }, []);

  if (boxType === "html") return null;

  return (
    <div
      className="Ads-Wrapper"
      style={{
        width: "100%",
        border: "1px solid #ccc",
        padding: "0",
        textAlign: "center",
        background: "#f7f7f7",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",              // 🚫 Prevent any overflow
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "5px",
          right: "10px",
          fontWeight: "bold",
          color: "#111",
          fontSize: "0.8rem",
          zIndex: 2,
        }}
      >
        {timer > 0 ? `${timer}s` : "Done"}
      </div>


{/* Uncomment after Adsence Site Verification and also script in index.html should be uncommented */}
      {/* {adLoaded ? (
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            textAlign: "center",
            width: "100%",
            height: "100%",
          }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={client || "ca-pub-6317483086789968"}
          data-ad-slot={slot || "1762434579"}
          ref={adRef}
        ></ins>
      ) : (
        <div className="CodeBox-Ads-Placeholder">
          <h1>
            <b>
              Code<sup><u>Verse💻</u></sup>
            </b>
          </h1>
          <p>Visit our social site for more updates</p>
          <p>We are here to provide you best resources for free.</p>
        </div>
      )} */}


{/* Remove it after adsense site verifiaction */}
        <div className="CodeBox-Ads-Placeholder">
          <h1>
            <b>
              Code<sup><u>Verse💻</u></sup>
            </b>
          </h1>
          <p>Visit our social site for more updates</p>
          <p>We are here to provide you best resources for free.</p>
        </div>

    </div>
  );
}
