import React, { useState, useEffect, useRef } from 'react';
import '../assets/css/PlayGround_from_Code.css';

const PlayGround_from_Code = () => {
    const [activeTab, setActiveTab] = useState('html');
    const [html, setHtml] = useState('<div class="card">\n  <div class="badge">CodeVora Pro</div>\n  <h1>Interactive UI</h1>\n  <p>Modify the editors to the left and see the magic happen instantly.</p>\n  <button id="go">Click Me <i class="ri-flashlight-fill"></i></button>\n</div>');
    const [css, setCss] = useState('body { \n  background: #0f172a; \n  display: flex; justify-content: center; align-items: center; height: 100vh;\n  font-family: sans-serif; margin: 0;\n}\n.card { \n  background: #1e293b; padding: 50px; border-radius: 30px; \n  text-align: center; color: white; border: 1px solid rgba(255,255,255,0.1);\n  width: 350px;\n}\n.badge {\n  background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 5px 15px; border-radius: 20px; font-size: 0.7rem; margin-bottom: 20px;\n}\nbutton { \n  background: #6366f1; color: white; border: none; padding: 12px 25px; border-radius: 12px; cursor: pointer; \n}');
    const [js, setJs] = useState('const btn = document.getElementById("go");\nbtn.onclick = () => alert("React Logic Fired!");');
    const [copyText, setCopyText] = useState('Copy Bundle');

    const iframeRef = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            updatePreview();
        }, 400);
        return () => clearTimeout(timeout);
    }, [html, css, js]);

    const updatePreview = () => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        const content = `
            <!DOCTYPE html>
            <html>
                <head>
                    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
                    <style>
                        ${css}
                    </style>
                </head>
                <body>
                    ${html}
                    <script>
                        ${js}
                    <\/script>
                </body>
            </html>
        `;

        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        iframe.src = url;
    };

    const handleTabKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd, value } = e.target;
            const newValue = value.substring(0, selectionStart) + "  " + value.substring(selectionEnd);
            
            if (activeTab === 'html') setHtml(newValue);
            if (activeTab === 'css') setCss(newValue);
            if (activeTab === 'js') setJs(newValue);

            // Reset cursor position after state update (using a timeout to ensure DOM has updated)
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = selectionStart + 2;
            }, 0);
        }
    };

    const copyBundle = () => {
        const bundle = `\n${html}\n\n/* CSS */\n${css}\n\n// JS\n${js}`;
        navigator.clipboard.writeText(bundle);
        setCopyText('Copied!');
        setTimeout(() => setCopyText('Copy Bundle'), 2000);
    };

    return (
        <div className="codevora-container">
            <header className="cv-header">
                <div className="cv-logo"><i className="ri-code-s-slash-fill"></i> Playground</div>
                <div className="cv-actions">
                    <div className="live-badge"><div className="dot-blink"></div> LIVE PREVIEW</div>
                    <button className="cv-btn" onClick={copyBundle}><i className="ri-file-copy-2-line"></i> {copyText}</button>
                </div>
            </header>

            <main className="cv-main">
                <section className="editor-section">
                    <div className="cv-tabs">
                        <button className={`cv-tab ${activeTab === 'html' ? 'active' : ''}`} onClick={() => setActiveTab('html')}><i className="devicon-html5-plain colored" style={{color: '#e34c26'}}></i> index.html</button>
                        <button className={`cv-tab ${activeTab === 'css' ? 'active' : ''}`} onClick={() => setActiveTab('css')}><i className="devicon-css3-plain colored" style={{color: '#264de4'}}></i> style.css</button>
                        <button className={`cv-tab ${activeTab === 'js' ? 'active' : ''}`} onClick={() => setActiveTab('js')}><i className="devicon-javascript-plain colored" style={{color: '#f7df1e'}}></i> script.js</button>
                    </div>
                    <div className="editor-area">
                        {activeTab === 'html' && <textarea value={html} onChange={(e) => setHtml(e.target.value)} onKeyDown={handleTabKeyDown} spellCheck="false" />}
                        {activeTab === 'css' && <textarea value={css} onChange={(e) => setCss(e.target.value)} onKeyDown={handleTabKeyDown} spellCheck="false" />}
                        {activeTab === 'js' && <textarea value={js} onChange={(e) => setJs(e.target.value)} onKeyDown={handleTabKeyDown} spellCheck="false" />}
                    </div>
                </section>

                <section className="preview-section">
                    <div className="browser-mock">
                        <div className="browser-head">
                            <div className="circles"><span></span><span></span><span></span></div>
                            <div className="url-bar">https://codevora140.vercel.app/playground</div>
                        </div>
                        <iframe ref={iframeRef} title="preview" />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PlayGround_from_Code;