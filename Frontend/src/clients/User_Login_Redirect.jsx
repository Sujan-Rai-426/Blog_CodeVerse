// pages/User_Login_Redirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TokenService } from "../utils/token";

export default function User_Login_Redirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Your backend should send 'access' and 'refresh' tokens
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (access && refresh) {
      // Save user tokens
      TokenService.saveUserTokens(access, refresh);

      // Navigate to profile page
      navigate("/User/Profile", { replace: true });
    } else {
      // If no tokens, go back to login
      navigate("/User/Login", { replace: true });
    }
  }, [navigate]);

  return <p>Redirecting...</p>;
}
