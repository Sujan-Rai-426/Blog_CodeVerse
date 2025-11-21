import React from "react";
import "../assets/css/Template_Documentation.css";


const Template_Documentation = ({ template }) => {
    if (!template) return <div className="empty">Select a template to view documentation</div>;

    // Hide documentation if Premium
    if (template.user_access === "Premium") {
        return (
            <div className="premium-lock">
                <p>This template is Premium. Buy to view documentation.</p>
                <button onClick={() => alert("Redirect to purchase page!")}>Buy Premium - ${template.price}</button>
            </div>
        );
    }

    return (
        <div className="doc-wrap">
            <h3>{template.title} Documentation</h3>
            <p>{template.documentation || "No documentation available."}</p>
        </div>
    );
};

export default Template_Documentation;
