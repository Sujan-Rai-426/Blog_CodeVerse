import React, { useState, useRef, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "../assets/css/PlayGround.css";

/**
 * Box component: draggable & resizable (responsive)
 */
function Box({ box, index, selectedBoxId, setSelectedBoxId, boxes, setBoxes, canvasRef }) {
  const boxRef = useRef(null);
  const [hoverSide, setHoverSide] = useState(null);
  const [dragging, setDragging] = useState(false);

  // Bring selected box to front
  const bringToFront = (id) => {
    const maxZ = Math.max(...boxes.map((b) => b.z));
    setBoxes((prev) =>
      prev.map((b) => (b.id === id ? { ...b, z: maxZ + 1 } : b))
    );
  };

  // Detect which side of the box is hovered for resize
  const detectHoverSide = (x, y) => {
    const rect = boxRef.current.getBoundingClientRect();
    const offset = Math.max(12, Math.min(16, rect.width * 0.03));
    let side = null;
    const rx = x - rect.left;
    const ry = y - rect.top;

    if (rx < offset) side = "w";
    else if (rx > rect.width - offset) side = "e";
    if (ry < offset) side = side ? side + "n" : "n";
    else if (ry > rect.height - offset) side = side ? side + "s" : "s";
    return side;
  };

  // Handle drag & resize
  const startDragResize = (startEvent, isTouch = false) => {
    if (startEvent.cancelable) startEvent.preventDefault();
    bringToFront(box.id);
    setSelectedBoxId(box.id);
    setDragging(true);

    const startX = isTouch ? startEvent.touches[0].clientX : startEvent.clientX;
    const startY = isTouch ? startEvent.touches[0].clientY : startEvent.clientY;

    let startBox;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    setBoxes((prev) => {
      startBox = prev.find((b) => b.id === box.id);
      return prev;
    });

    const side = detectHoverSide(startX, startY);
    const resizing = !!side;
    const moveEvent = isTouch ? "touchmove" : "mousemove";
    const upEvent = isTouch ? "touchend" : "mouseup";

    const handleMove = (moveE) => {
      if (moveE.cancelable) moveE.preventDefault();
      const mx = isTouch ? moveE.touches[0].clientX : moveE.clientX;
      const my = isTouch ? moveE.touches[0].clientY : moveE.clientY;
      const deltaX = mx - startX;
      const deltaY = my - startY;

      setBoxes((prev) =>
        prev.map((b) => {
          if (b.id !== box.id) return b;

          let newX = startBox.x * canvasRect.width;
          let newY = startBox.y * canvasRect.height;
          let newW = startBox.w * canvasRect.width;
          let newH = startBox.h * canvasRect.height;

          if (resizing && side) {
            if (side.includes("e")) newW = Math.max(30, newW + deltaX);
            if (side.includes("s")) newH = Math.max(30, newH + deltaY);
            if (side.includes("w")) {
              newW = Math.max(30, newW - deltaX);
              newX += deltaX;
            }
            if (side.includes("n")) {
              newH = Math.max(30, newH - deltaY);
              newY += deltaY;
            }
          } else {
            newX += deltaX;
            newY += deltaY;
          }

          return {
            ...b,
            x: newX / canvasRect.width,
            y: newY / canvasRect.height,
            w: newW / canvasRect.width,
            h: newH / canvasRect.height,
          };
        })
      );
    };

    const stopMove = () => {
      setDragging(false);
      window.removeEventListener(moveEvent, handleMove);
      window.removeEventListener(upEvent, stopMove);
    };

    window.addEventListener(moveEvent, handleMove, { passive: false });
    window.addEventListener(upEvent, stopMove);
  };

  const handleMouseMoveOver = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const side = detectHoverSide(e.clientX, e.clientY);
    setHoverSide(side);
    e.currentTarget.style.cursor = side
      ? side.includes("n") && side.includes("w") || side.includes("s") && side.includes("e")
        ? "nwse-resize"
        : side.includes("n") || side.includes("s")
        ? "ns-resize"
        : "ew-resize"
      : "grab";
  };

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const touchStartHandler = (e) => startDragResize(e, true);
    el.addEventListener("touchstart", touchStartHandler, { passive: false });
    return () => el.removeEventListener("touchstart", touchStartHandler);
  }, []);

  return (
    <div
      ref={boxRef}
      className={`cv-box cv-box-${index + 1} ${dragging ? "dragging" : ""}`}
      style={{
        width: `${box.w * 100}%`,
        height: `${box.h * 100}%`,
        top: `${box.y * 100}%`,
        left: `${box.x * 100}%`,
        zIndex: box.z,
        background: box.color,
        borderRadius: box.radius,
        position: "absolute",
        transition: dragging ? "none" : "all 0.12s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: "700",
        fontSize: "14px",
      }}
      onMouseDown={(e) => startDragResize(e)}
      onMouseMove={handleMouseMoveOver}
      onMouseLeave={() => setHoverSide(null)}
    >
      {index + 1} {/* Display box number */}
    </div>
  );
}

/**
 * Main PlayGround component
 */
export default function PlayGround() {
  const [boxes, setBoxes] = useState([
    { id: 1, w: 0.2, h: 0.2, x: 0.4, y: 0.4, z: 1, color: "#2563eb", radius: 12 },
  ]);
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const [copied, setCopied] = useState({ html: false, css: false });
  const canvasRef = useRef(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [boxes]);

  /** Generate responsive HTML & CSS */
  const generatedCode = (() => {
    const html = boxes.map((b, i) => `   <div class="cv-box cv-box-${i + 1}"></div>`).join("\n");

    const css = [
      `.cv-container { 
      position: relative; 
      width: 100%; 
      max-width: 600px; 
      aspect-ratio: 1/1; 
      background: #f9fafb; 
      border-radius: 20px; 
      overflow: hidden; 
      border: 2px solid #e5e7eb; 
    }`,
    ].concat(
      boxes.map((b, i) => {
        return `.cv-box-${i + 1} {
      width: ${b.w * 100}%;
      height: ${b.h * 100}%;
      position: absolute;
      left: ${b.x * 100}%;
      top: ${b.y * 100}%;
      z-index: ${b.z};
      background: ${b.color};
      border-radius: ${b.radius}px;
      border: 2px solid #374151;
      transition: all 0.2s ease;
    }`;
      })
    ).join("\n");

    return { html, css };
  })();

  // Copy HTML & CSS
  const copyHTML = async () => {
    await navigator.clipboard.writeText(`<div class="cv-container">\n${generatedCode.html}\n</div>`);
    setCopied((prev) => ({ ...prev, html: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, html: false })), 1500);
  };
  const copyCSS = async () => {
    await navigator.clipboard.writeText(generatedCode.css);
    setCopied((prev) => ({ ...prev, css: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, css: false })), 1500);
  };

  // ===== Add Box with higher Z-index =====
  const addBox = () => {
    setBoxes((prev) => {
      const maxZ = prev.length > 0 ? Math.max(...prev.map((b) => b.z)) : 0;
      return [
        ...prev,
        {
          id: Date.now(),
          w: 0.2,
          h: 0.2,
          x: 0.4,
          y: 0.4,
          z: maxZ + 1, // New box on top
          color: "#10b981",
          radius: 12,
        },
      ];
    });
  };

  const updateColor = (color) =>
    setBoxes((prev) =>
      prev.map((b) => (b.id === selectedBoxId ? { ...b, color } : b))
    );

  const updateRadius = (radius) =>
    setBoxes((prev) =>
      prev.map((b) => (b.id === selectedBoxId ? { ...b, radius } : b))
    );

  // ===== Delete selected box =====
  const deleteBox = () => {
    setBoxes((prev) => prev.filter(b => b.id !== selectedBoxId));
    setSelectedBoxId(null);
  };

  return (
    <div className="cv-wrapper cv-codevora">
      <aside className="cv-sidebar">
        <h2 className="cv-sidebar-title">Controls</h2>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* Add Box */}
          <button className="cv-btn-primary" onClick={addBox}>+ Add Box</button>
          {/* View Code */}
          <button
            className="cv-btn-viewcode"
            onClick={() => {
              const codeSection = document.getElementById("CODE");
              if (codeSection) {
                codeSection.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          >
            View Code
          </button>
        </div>

        {selectedBoxId && (
            <>
              <div className="cv-control-container">
                  {/* Color */}
                  <div className="cv-control">
                    <label>Box Color</label>
                    <input type="color" value={boxes.find((b) => b.id === selectedBoxId)?.color} onChange={(e) => updateColor(e.target.value)} />
                  </div>
                  {/* Border Radius */}
                  <div className="cv-control">
                    <label>Border Radius</label>
                    <input type="range" min="0" max="50" value={boxes.find((b) => b.id === selectedBoxId)?.radius || 0} onChange={(e) => updateRadius(parseInt(e.target.value))} />
                  </div>
            </div>
              {/* Delete Box */}
              <div className="cv-control">
                <button className="cv-btn-deleteBOX" onClick={deleteBox}>🗑 Delete Box</button>
              </div>
            </>
        )}
      </aside>

      <main className="cv-content">
        <section className="cv-canvas" ref={canvasRef}>
          <p>CodeVora Canvas</p>
          {boxes.map((box, i) => (
            <Box
              key={box.id}
              box={box}
              index={i}
              selectedBoxId={selectedBoxId}
              setSelectedBoxId={setSelectedBoxId}
              boxes={boxes}
              setBoxes={setBoxes}
              canvasRef={canvasRef}
            />
          ))}
        </section>

        <section id="CODE" className="cv-code-wrapper">
          <div className="cv-code-card">
            <div className="cv-code-top codevora-top">
              <div className="cv-code-title">HTML</div>
              <div className="cv-code-actions">
                <button className="cv-copy-btn-small" onClick={copyHTML}>📋</button>
                {copied.html && <span className="cv-copied-badge">Copied!</span>}
              </div>
            </div>
            <pre className="cv-code-area">
              <code className="language-markup">{`<div class="cv-container">\n${generatedCode.html}\n</div>`}</code>
            </pre>
          </div>

          <div className="cv-code-card">
            <div className="cv-code-top codevora-top">
              <div className="cv-code-title">CSS</div>
              <div className="cv-code-actions">
                <button className="cv-copy-btn-small" onClick={copyCSS}>📋</button>
                {copied.css && <span className="cv-copied-badge">Copied!</span>}
              </div>
            </div>
            <pre className="cv-code-area">
              <code className="language-css">{generatedCode.css}</code>
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
}
