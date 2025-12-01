import { useEffect, useState, useRef } from "react";
import "../assets/css/Ads_Container.css";

export default function Ads_Container({
  onComplete,
  client,
  slot,
  style,
  boxType,
  adId,
  activeTab // 🔥 ADDED — tells ads to pause/resume
}) {
  const [timer, setTimer] = useState(6);
  const intervalRef = useRef(null);

  // Reset timer when adId changes OR when tab becomes Preview again
  useEffect(() => {
    if (activeTab === "code") {
      setTimer(6);
    }
  }, [adId, activeTab]);

  // Ads timer pause when not in code and switch to preview
  useEffect(() => {
    // STOP any old interval
    clearInterval(intervalRef.current);

    // If not in code → pause ads [To avoid ads run in background]
    if (activeTab !== "code") return;

    // If preview → start countdown
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [activeTab, adId]);

  // Complete callback
  useEffect(() => {
    if (timer <= 0) {
      clearInterval(intervalRef.current);
      onComplete();
    }
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
        overflow: "hi
        ...style
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
          zIndex: 2
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
        <h1>
          <b>
            Code
            <sup>
              <u>Vora💻</u>
            </sup>
          </b>
        </h1>
        <p> More Components will be uploaded on weekly basis. </p>
        <p>Visit our social site for staying updated</p>
        <p>We are here to provide you best resources for free.</p>
      </div>
    </div>
  );
}
