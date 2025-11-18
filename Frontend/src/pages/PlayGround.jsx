import React, { useState, useRef, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "../assets/css/PlayGround.css";


// <------------------ Function of BOX logic -------------------->
function Box({ box, index, selectedBoxId, setSelectedBoxId, boxes, setBoxes, canvasRef }) {
  const boxRef = useRef(null);
  const [hoverSide, setHoverSide] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [showHLine, setShowHLine] = useState(false);
  const [showVLine, setShowVLine] = useState(false);

  // =======  always use latest boxes for saving latest change in box =======
  const boxesRef = useRef(boxes);
  useEffect(() => { boxesRef.current = boxes; }, [boxes]);

  const bringToFront = (id) => {
    const maxZ = Math.max(...boxesRef.current.map((b) => b.z));
    setBoxes((prev) =>
      prev.map((b) => (b.id === id ? { ...b, z: maxZ + 1 } : b))
    );
  };

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


  // =======  Drag and Resize Boc Logic  =============
  const startDragResize = (startEvent, isTouch = false) => {
    if (startEvent.cancelable) startEvent.preventDefault();
    bringToFront(box.id);
    setSelectedBoxId(box.id);
    setDragging(true);

    const startX = isTouch ? startEvent.touches[0].clientX : startEvent.clientX;
    const startY = isTouch ? startEvent.touches[0].clientY : startEvent.clientY;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    let startBox = boxesRef.current.find((b) => b.id === box.id); // <-- use ref

    const side = detectHoverSide(startX, startY);
    const resizing = !!side;
    const moveEvent = isTouch ? "touchmove" : "mousemove";
    const upEvent = isTouch ? "touchend" : "mouseup";


    // ========== Box Movement handle logic ============
    const handleMove = (moveE) => {
      if (moveE.cancelable) moveE.preventDefault();
      const mx = isTouch ? moveE.touches[0].clientX : moveE.clientX;
      const my = isTouch ? moveE.touches[0].clientY : moveE.clientY;
      const deltaX = mx - startX;
      const deltaY = my - startY;

      let newBoxes = boxesRef.current.map((b) => {
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
      });

      // ===== Alignment lines =====
      let hLine = false;
      let vLine = false;
      const movingBox = newBoxes.find((b) => b.id === box.id);

      const rad = (movingBox.rotation || 0) * (Math.PI / 180);
      const cx = movingBox.x * canvasRect.width + (movingBox.w * canvasRect.width) / 2;
      const cy = movingBox.y * canvasRect.height + (movingBox.h * canvasRect.height) / 2;
      const w2 = movingBox.w * canvasRect.width / 2;
      const h2 = movingBox.h * canvasRect.height / 2;

      const corners = [
        { x: -w2, y: -h2 },
        { x: w2, y: -h2 },
        { x: w2, y: h2 },
        { x: -w2, y: h2 },
      ].map(c => ({
        x: cx + c.x * Math.cos(rad) - c.y * Math.sin(rad),
        y: cy + c.x * Math.sin(rad) + c.y * Math.cos(rad),
      }));

      const bLeft = Math.min(...corners.map(c => c.x));
      const bRight = Math.max(...corners.map(c => c.x));
      const bTop = Math.min(...corners.map(c => c.y));
      const bBottom = Math.max(...corners.map(c => c.y));
      const bCenterX = (bLeft + bRight) / 2;
      const bCenterY = (bTop + bBottom) / 2;

      const tolerance = 8;
      const checkAlign = (p1, p2) => Math.abs(p1 - p2) < tolerance;

      if (checkAlign(bLeft, 0) || checkAlign(bRight, canvasRect.width) || checkAlign(bCenterX, canvasRect.width / 2)) vLine = true;
      if (checkAlign(bTop, 0) || checkAlign(bBottom, canvasRect.height) || checkAlign(bCenterY, canvasRect.height / 2)) hLine = true;

      newBoxes.forEach(other => {
        if (other.id === box.id) return;

        const orad = (other.rotation || 0) * (Math.PI / 180);
        const ocx = other.x * canvasRect.width + (other.w * canvasRect.width) / 2;
        const ocy = other.y * canvasRect.height + (other.h * canvasRect.height) / 2;
        const ow2 = other.w * canvasRect.width / 2;
        const oh2 = other.h * canvasRect.height / 2;

        const ocorners = [
          { x: -ow2, y: -oh2 },
          { x: ow2, y: -oh2 },
          { x: ow2, y: oh2 },
          { x: -ow2, y: oh2 },
        ].map(c => ({
          x: ocx + c.x * Math.cos(orad) - c.y * Math.sin(orad),
          y: ocy + c.x * Math.sin(orad) + c.y * Math.cos(orad),
        }));

        const oLeft = Math.min(...ocorners.map(c => c.x));
        const oRight = Math.max(...ocorners.map(c => c.x));
        const oTop = Math.min(...ocorners.map(c => c.y));
        const oBottom = Math.max(...ocorners.map(c => c.y));
        const oCenterX = (oLeft + oRight) / 2;
        const oCenterY = (oTop + oBottom) / 2;

        if (
          checkAlign(bLeft, oLeft) || checkAlign(bLeft, oRight) ||
          checkAlign(bRight, oLeft) || checkAlign(bRight, oRight) ||
          checkAlign(bCenterX, oCenterX)
        ) vLine = true;

        if (
          checkAlign(bTop, oTop) || checkAlign(bTop, oBottom) ||
          checkAlign(bBottom, oTop) || checkAlign(bBottom, oBottom) ||
          checkAlign(bCenterY, oCenterY)
        ) hLine = true;
      });

      setShowHLine(hLine);
      setShowVLine(vLine);
      setBoxes(newBoxes);
    };

    const stopMove = () => {
      setDragging(false);
      setShowHLine(false);
      setShowVLine(false);
      window.removeEventListener(moveEvent, handleMove);
      window.removeEventListener(upEvent, stopMove);
    };

    window.addEventListener(moveEvent, handleMove, { passive: false });
    window.addEventListener(upEvent, stopMove);
  };


  //  ============  Rotation of BOX Logic handel ================
  const startRotation = (e, isTouch = false) => {
    e.stopPropagation();
    bringToFront(box.id);
    setSelectedBoxId(box.id);

    const rect = boxRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;

    const startAngle = Math.atan2(startY - centerY, startX - centerX) * (180 / Math.PI);
    const initialRotation = boxesRef.current.find(b => b.id === box.id)?.rotation || 0; // <-- use ref

    let animationFrame = null;
    const snapTolerance = 10;
    const showLineThreshold = 15;

    const handleMove = (moveE) => {
      if (moveE.cancelable) moveE.preventDefault();
      const mx = isTouch ? moveE.touches[0].clientX : moveE.clientX;
      const my = isTouch ? moveE.touches[0].clientY : moveE.clientY;

      let deltaAngle = Math.atan2(my - centerY, mx - centerX) * (180 / Math.PI) - startAngle;
      if (deltaAngle > 180) deltaAngle -= 360;
      if (deltaAngle < -180) deltaAngle += 360;

      let newAngle = initialRotation + deltaAngle;
      [0, 90, 180, 270].forEach(snap => { if (Math.abs(newAngle - snap) <= snapTolerance) newAngle = snap; });

      const showHLine = Math.abs(newAngle % 180) < showLineThreshold || Math.abs(newAngle % 180 - 180) < showLineThreshold;
      const showVLine = Math.abs((newAngle - 90) % 180) < showLineThreshold || Math.abs((newAngle - 270) % 180) < showLineThreshold;

      if (!animationFrame) {
        animationFrame = requestAnimationFrame(() => {
          setBoxes(prev => prev.map(b => (b.id === box.id ? { ...b, rotation: newAngle } : b)));
          setShowHLine(showHLine);
          setShowVLine(showVLine);
          animationFrame = null;
        });
      }
    };

    const stopMove = () => {
      setShowHLine(false);
      setShowVLine(false);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener(isTouch ? "touchmove" : "mousemove", handleMove);
      window.removeEventListener(isTouch ? "touchend" : "mouseup", stopMove, { once: true });
    };

    window.addEventListener(isTouch ? "touchmove" : "mousemove", handleMove, { passive: false });
    window.addEventListener(isTouch ? "touchend" : "mouseup", stopMove, { once: true });
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
        transform: `rotate(${box.rotation || 0}deg)`,
      }}
      onMouseDown={(e) => startDragResize(e)}
      onMouseMove={handleMouseMoveOver}
      onMouseLeave={() => setHoverSide(null)}
    >
      {index + 1}
      {selectedBoxId === box.id && (
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#facc15",
            position: "absolute",
            top: "-10px",
            right: "-10px",
            cursor: "grab",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
          }}
          onMouseDown={(e) => startRotation(e)}
          onTouchStart={(e) => startRotation(e, true)}
        >
          ⟳
        </div>
      )}
      {selectedBoxId === box.id && showHLine && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: "1px",
          background: "red",
          pointerEvents: "none",
          transform: "translateY(-0.5px)",
          zIndex: 9999,
        }} />
      )}
      {selectedBoxId === box.id && showVLine && (
        <div style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: "1px",
          height: "100%",
          background: "red",
          pointerEvents: "none",
          transform: "translateX(-0.5px)",
          zIndex: 9999,
        }} />
      )}
    </div>
  );
}

// <----------------------- PlayGround component ----------------------->
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



  // ============= Generate CODE Logic ===================
const generatedCode = (() => {
  const html = boxes
    .map((b, i) => `<div class="cv-box cv-box-${i + 1}"></div>`)
    .join("\n");

  const css = [
    `.cv-container {
    position: relative;
    width: 45%;
    max-width: 100vw;
    aspect-ratio: 1/1;
    background: #f9fafb;
    border: 1px solid black;
    border-radius: 20px;
    overflow: hidden;
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
}
    /* Portrait mode: Mobile & Tablet */
@media (max-width: 980px), (orientation: portrait) {
    .cv-container {
        width: 100%;
    }
}`
  ].concat(
    boxes.map((b, i) => `.cv-box-${i + 1} {
    width: ${b.w * 100}%;
    height: ${b.h * 100}%;
    position: absolute;
    left: ${b.x * 100}%;
    top: ${b.y * 100}%;
    z-index: ${b.z};
    background: ${b.color};
    border-radius: ${b.radius}px;
    transition: all 0.2s ease;
    transform: rotate(${b.rotation || 0}deg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem; /* scales for responsiveness */
}`)
  ).join("\n");

  return { html, css };
})();



  //========== Copy CODE [ HTML + CSS ] Logic==============
  const copyHTML = async () => {
    await navigator.clipboard.writeText(`<div class="cv-container">\n${generatedCode.html}\n</div>`);
    setCopied(prev => ({ ...prev, html: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, html: false })), 1500);
  };
  const copyCSS = async () => {
    await navigator.clipboard.writeText(generatedCode.css);
    setCopied(prev => ({ ...prev, css: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, css: false })), 1500);
  };


  // =======ADD Normal BOX logic =============
  const addBox = () => {
    setBoxes(prev => {
      const maxZ = prev.length > 0 ? Math.max(...prev.map(b => b.z)) : 0;
      return [...prev, { id: Date.now(), w: 0.2, h: 0.2, x: 0.4, y: 0.4, z: maxZ + 1, color: "#10b981", radius: 12 }];
    });
  };

  const updateColor = color => setBoxes(prev => prev.map(b => b.id === selectedBoxId ? { ...b, color } : b));
  const updateRadius = radius => setBoxes(prev => prev.map(b => b.id === selectedBoxId ? { ...b, radius } : b));
  const deleteBox = () => { setBoxes(prev => prev.filter(b => b.id !== selectedBoxId)); setSelectedBoxId(null); };

  return (
    <div className="main-PlayGround-body">
      <h4 className="text-center py-0 mt-3 mb-0">Generate live code using canvas</h4>
      <div className="cv-wrapper cv-codevora">

        {/* <=======  CONTROL Section ==========> */}
        <aside className="cv-sidebar">
          <h2 className="cv-sidebar-title">Controls</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="cv-btn-primary" onClick={addBox}>+ Add Box</button>
            <button className="cv-btn-viewcode" onClick={() => {
              const codeSection = document.getElementById("CODE");
              if (codeSection) codeSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }}>View Code</button>
          </div>
          {selectedBoxId && <>
            <div className="cv-control-container">
              <div className="cv-control">
                <label>Box Color</label>
                <input type="color" value={boxes.find(b => b.id === selectedBoxId)?.color} onChange={e => updateColor(e.target.value)} />
              </div>
              <div className="cv-control">
                <label>Border Radius</label>
                <input type="range" min="0" max="50" value={boxes.find(b => b.id === selectedBoxId)?.radius || 0} onChange={e => updateRadius(parseInt(e.target.value))} />
              </div>
            </div>
            <div className="cv-control" style={{ display: 'flex', justifyContent: 'space-between'}}>
              <button className="cv-btn-deleteBOX" onClick={deleteBox}>🗑 Delete Box</button>
              <button className="cv-btn-copyBOX" onClick={() => {
                const boxToCopy = boxes.find(b => b.id === selectedBoxId);
                if (boxToCopy) {
                  const maxZ = boxes.length > 0 ? Math.max(...boxes.map(b => b.z)) : 0;
                  const canvasRect = canvasRef.current.getBoundingClientRect();
                  const offsetX = 15 / canvasRect.width;
                  const offsetY = -15 / canvasRect.height;
                  setBoxes(prev => [...prev, { ...boxToCopy, id: Date.now(), z: maxZ + 1, x: Math.min(Math.max(boxToCopy.x + offsetX, 0), 1 - boxToCopy.w), y: Math.min(Math.max(boxToCopy.y + offsetY, 0), 1 - boxToCopy.h) }]);
                }
              }}>📄 Copy Box</button>
            </div>
          </>}
        </aside>


        {/* <======== CANVAS ART Section =========> */}
        <main className="cv-content">
          <section className="cv-canvas">
            <div className="cv-canvas-inner" ref={canvasRef}>
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
            </div>
          </section>
        </main>
      </div>


        {/* <========= CODE Generator Section ========> */}
      <section id="CODE" className="cv-code-wrapper">
        <div className="cv-code-card">
          <div className="cv-code-top codevora-top">
            <div className="cv-code-title">HTML</div>
            <div className="cv-code-actions">
              <button className="cv-copy-btn-small" onClick={copyHTML}>📋</button>
              {copied.html && <span className="cv-copied-badge">Copied!</span>}
            </div>
          </div>
          <pre className="cv-code-area"><code className="language-markup">{`<div class="cv-container">\n${generatedCode.html}\n</div>`}</code></pre>
        </div>
        <div className="cv-code-card">
          <div className="cv-code-top codevora-top">
            <div className="cv-code-title">CSS</div>
            <div className="cv-code-actions">
              <button className="cv-copy-btn-small" onClick={copyCSS}>📋</button>
              {copied.css && <span className="cv-copied-badge">Copied!</span>}
            </div>
          </div>
          <pre className="cv-code-area"><code className="language-css">{generatedCode.css}</code></pre>
        </div>
      </section>
    </div>
  );
}
