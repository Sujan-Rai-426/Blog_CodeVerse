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

export default function Ads_Container({ onComplete, client, slot, style, boxType }) {
  const [timer, setTimer] = useState(10);
  const adRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, []);

  // Notify parent when timer finishes
  useEffect(() => {
    if (timer <= 0) onComplete();
  }, [timer, onComplete]);

  // Function to safely push ad
  const pushAd = () => {
    if (window.adsbygoogle && adRef.current && adRef.current.offsetWidth > 0) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error("Adsense error:", e);
      }
    }
  };

  // Push ad on mount and resize
  useEffect(() => {
    const handleResize = () => pushAd();
    const interval = setInterval(() => {
      if (adRef.current && adRef.current.offsetWidth > 0) {
        pushAd();
        clearInterval(interval);
      }
    }, 200);
    window.addEventListener("resize", handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 🔥 Skip rendering if boxType is "html"
  if (boxType === "html") return null;

  return (
    <div
      style={{
        width: "100%",
        minWidth: "300px",
        border: "1px solid #ccc",
        padding: "12px",
        textAlign: "center",
        background: "#f7f7f7",
        borderRadius: "8px",
        minHeight: "90px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
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
        }}
      >
        {timer > 0 ? `${timer}s` : "Done"}
      </div>

      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={client || "ca-pub-6317483086789968"}
        data-ad-slot={slot || "1762434579"}
        ref={adRef}
      ></ins>
    </div>
  );
}
