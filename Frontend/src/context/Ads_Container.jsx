import { useEffect, useState, useRef } from "react";
import '../assets/css/Ads_Container.css'

export default function Ads_Container({ onComplete, client, slot, style, boxType, adId }) {
  const [timer, setTimer] = useState(6);
  const adRef = useRef(null);

  // Reset timer on adId change
  useEffect(() => setTimer(8), [adId]);

  // Countdown
  useEffect(() => {
    const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [adId]);

  // Complete callback
  useEffect(() => {
    if (timer <= 0) onComplete();
  }, [timer, onComplete]);

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
        overflow: "hidden",
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

      {/* AdSense commented for later verification */}
      {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6317483086789968" crossorigin="anonymous"></script>
          <ins class="adsbygoogle" style="display:block; text-align:center;" data-ad-layout="in-article"
               data-ad-format="fluid" data-ad-client="ca-pub-6317483086789968" data-ad-slot="1762434579" ref={adRef}></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script> */}

      <div className="CodeBox-Ads-Placeholder">
        <h1><b>Code<sup><u>Vora💻</u></sup></b></h1>
        <p>Visit our social site for more updates</p>
        <p>We are here to provide you best resources for free.</p>
      </div>
    </div>
  );
}
