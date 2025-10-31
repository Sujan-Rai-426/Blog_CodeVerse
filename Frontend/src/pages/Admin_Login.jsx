import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "../assets/css/Admin_Login.css";

function Admin_Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsUploading(true); // Start loading when login starts

        try {
            const response = await api.post('/api/admin-login/', {
                username,
                password
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('loggedIn', 'true');

                console.log('Login successful!');
                navigate('/Admin_Dashboard');
            }
        } catch (err) {
            setError('Invalid credentials or user is not admin.');
        } finally {
            setIsUploading(false); // Always stop loading
        }
    };

    return (
        <div className="admin-login d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handleLogin} className="p-4 shadow rounded bg-white" style={{ width: "350px" }} >
                <h3 className="text-center mb-4 text-primary">Admin Login</h3>

                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isUploading} placeholder="Enter your username" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isUploading} placeholder="Enter your password" />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button type="submit" className="btn btn-primary w-100 d-flex justify-content-center align-items-center" disabled={isUploading} style={{ height: "45px" }} >
                    {isUploading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" ></span>
                            Logging In...
                        </>
                    ) : (
                        "Login"
                    )}
                </button>
                <div className="text-center">
                    <p className="my-1">Mail developer for password: <Link to='https://www.sujan140.com.np/contact'> Mail </Link></p> 
                </div>
            </form>
        </div>
    );
}

export default Admin_Login;
