import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Admin_API from "./Admin_API";
import "../assets/css/Admin_Login.css";

function Admin_Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await Admin_API.post("/api/admin-login/", { username, password });

            if (res.status === 200) {
                const { access_token } = res.data;
                localStorage.setItem("admin_token", access_token);

                // Navigate after storing token
                navigate("/Admin", { replace: true });
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                setError("Invalid credentials or not an admin.");
            } else if (err.response?.status >= 500) {
                setError("Server error. Try again later.");
            } else {
                setError(err.response?.data?.detail || "Login failed.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login d-flex justify-content-center align-items-center vh-100">
            <form className="p-4 shadow rounded bg-white" style={{ width: "350px" }} onSubmit={handleLogin}>
                <h3 className="text-center mb-4 text-primary">Admin Login</h3>

                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />

                {error && <div className="alert alert-danger">{error}</div>}

                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                    {isLoading ? "Logging In..." : "Login"}
                </button>

                <p className="mt-3 text-center">
                    Mail here to join our team &nbsp;
                    <a href="https://sujan140.vercel.app/contact/">Mail</a>
                </p>
            </form>
        </div>
    );
}

export default Admin_Login;
