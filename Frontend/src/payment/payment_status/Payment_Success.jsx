import React, { useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { Payment_Context } from "./Payment_Context.jsx";

const Payment_Success = () => {
  const { unlockVideo } = useContext(Payment_Context);
  const [params] = useSearchParams();

  useEffect(() => {
    const pid = params.get("pid"); // e.g., VID5
    if (pid) {
      const videoId = pid.replace("VID", "");
      unlockVideo(videoId);
    }
  }, [params, unlockVideo]);

  return (
    <div className="text-center my-5">
      <h2>✅ Payment Successful!</h2>
      <p>Your premium content is now unlocked.</p>
    </div>
  );
};

export default Payment_Success;
