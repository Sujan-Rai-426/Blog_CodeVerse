import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function User_Login_Redirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            // Store token
            localStorage.setItem("user_token", token);

            // Navigate to correct protected route
            navigate("/User/Profile", { replace: true });
        } else {
            navigate("/User/Login", { replace: true });
        }
    }, [navigate]);

    return <p>Redirecting...</p>;
}
