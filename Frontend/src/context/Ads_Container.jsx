// import { useEffect, useState } from "react";

// export default function Ads_Container({ onComplete }) {
//   const [timer, setTimer] = useState(10);

//   useEffect(() => {
//     const countdown = setInterval(() => {
//       setTimer(prev => prev - 1);
//     }, 1000);

//     return () => clearInterval(countdown);
//   }, []);

//   // Safe callback when timer reaches 0
//   useEffect(() => {
//     if (timer <= 0) {
//       onComplete(); // notify parent
//     }
//   }, [timer, onComplete]);

//   return (
//     <div style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center", background: "#f7f7f7", borderRadius: "8px", minHeight: "90px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative" }}>
//         <strong>DEMO AD</strong>
//         <div>client: ca-pub-1234567890123456</div>
//         <div>slot: 9876543210</div>
//         <div style={{ position: "absolute", top: "5px", right: "10px", fontWeight: "bold" }}>
//             {timer > 0 ? `${timer}s` : "Done"}
//         </div>
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";

export default function Ads_Container({ onComplete, client, slot, style }) {
  const [timer, setTimer] = useState(10);
  const adRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  // Notify parent when timer finishes
  useEffect(() => {
    if (timer <= 0) onComplete();
  }, [timer, onComplete]);

  // Initialize AdSense after element mounts
  useEffect(() => {
    try {
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("Adsense error:", e);
    }
  }, []);

  return (
    <div
      style={{
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
        ...style
      }}
    >
      <div style={{ position: "absolute", top: "5px", right: "10px", fontWeight: "bold", color: "#111" }}>
        {timer > 0 ? `${timer}s` : "Done"}
      </div>

      <ins
        className="adsbygoogle"
        style={{ display:"block", textAlign:"center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={client || "ca-pub-6317483086789968"}
        data-ad-slot={slot || "1762434579"}
        ref={adRef}
      ></ins>
    </div>
  );
}




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
