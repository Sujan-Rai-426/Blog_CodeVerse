import React, { useState, useRef } from "react";
import "../assets/css/Interactive_Grid_Background.css";

const Interactive_Grid_Background = ({ children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div 
      className="interactive-grid-container" 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
    >
      {/* The Actual Content */}
      <div className="main-content-wrapper">
        {children}
      </div>

      {/* The Animated Grid Layer */}
      <div 
        className="grid-overlay" 
        style={{
          "--mouse-x": `${mousePos.x}px`,
          "--mouse-y": `${mousePos.y}px`,
        }}
      >
        <div className="scanline" />
      </div>
    </div>
  );
};

export default Interactive_Grid_Background;
