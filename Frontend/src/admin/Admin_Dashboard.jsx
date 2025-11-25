
import React from "react";
import "../assets/css/Admin_Home.css";

export default function Admin_Dashboard() {
    return (
        <div className="home-wrapper">
            <h2>Welcome Admin 👋</h2>
            <p>Manage CodeVora data from here. You can add, view, and update data.</p>

            <div className="dashboard-cards">
                <div className="dash-card">
                    <h3>Total Components</h3>
                    <p>120</p>
                </div>

                <div className="dash-card">
                    <h3>New Submissions</h3>
                    <p>8</p>
                </div>

                <div className="dash-card">
                    <h3>Pending Updates</h3>
                    <p>5</p>
                </div>
            </div>
        </div>
    );
}
