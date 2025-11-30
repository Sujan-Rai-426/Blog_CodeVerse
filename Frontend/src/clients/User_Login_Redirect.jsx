import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const User_Login_Redirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            localStorage.setItem("user_token", token); // ← must match your protected route check
            navigate("/Profile", { replace: true });
        } else {
            navigate("/Login", { replace: true });
        }
    }, [navigate]);

    return <p>Logging you in...</p>;
};

export default User_Login_Redirect;
