import React, { useState, useEffect, useRef } from 'react';
import './assets/css/PlayGround_Code_Compiler.css';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';

const PlayGround_Code_Compiler = () => {
    const [activeTab, setActiveTab] = useState('html');
    const defaultHtml = '<div class="card">\n  <div class="badge">CodeVora Pro</div>\n  <h1>Interactive UI</h1>\n  <p>Modify the editors to the left and see the magic happen instantly.</p>\n  <button id="go">Click Me <i class="ri-flashlight-fill"></i></button>\n</div>';
    const defaultCss = 'html,body { \n  background: #161616ff;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  font-family: sans-serif;\n  margin: 0;\n  padding: 0;\n}\n.card { \n  background: #1e293b;\n  padding: 50px;\n  border-radius: 30px;\n  text-align: center;\n  color: white;\n  border: 1px solid rgba(255,255,255,0.1);\n  width: 350px;\n}\n.badge {\n  background: rgba(99, 102, 241, 0.2);\n  color: #818cf8;\n  padding: 5px 15px;\n  border-radius: 20px;\n  font-size: 0.7rem;\n  margin-bottom: 20px;\n}\nbutton { \n  background: #6366f1;\n  color: white;\n  border: none;\n  padding: 12px 25px;\n  border-radius: 12px;\n  cursor: pointer; \n}';
    const defaultJs = 'const btn = document.getElementById("go");\nbtn.onclick = () => alert("React Logic Fired!");';

    const [html, setHtml] = useState(() => localStorage.getItem('pg_html') || defaultHtml);
    const [css, setCss] = useState(() => localStorage.getItem('pg_css') || defaultCss);
    const [js, setJs] = useState(() => localStorage.getItem('pg_js') || defaultJs);
    const [copyStatus, setCopyStatus] = useState({ bundle: 'Copy Bundle', individual: 'Copy' });

    const iframeRef = useRef(null);
    const textareaRef = useRef(null);
    const preRef = useRef(null);

    // Sync scrolling between textarea and highlight layer
    const handleScroll = (e) => {
        if (preRef.current) {
            preRef.current.scrollTop = e.target.scrollTop;
            preRef.current.scrollLeft = e.target.scrollLeft;
        }
    };

    useEffect(() => {
        Prism.highlightAll();
    }, [html, css, js, activeTab]);

    useEffect(() => {
        localStorage.setItem('pg_html', html);
        localStorage.setItem('pg_css', css);
        localStorage.setItem('pg_js', js);
        const timeout = setTimeout(() => updatePreview(), 400);
        return () => clearTimeout(timeout);
    }, [html, css, js]);

    const updatePreview = () => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        const content = `<!DOCTYPE html><html><head><link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet"><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
        const blob = new Blob([content], { type: 'text/html' });
        iframe.src = URL.createObjectURL(blob);
    };

    const handleTabKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd, value } = e.target;
            const newValue = value.substring(0, selectionStart) + "  " + value.substring(selectionEnd);
            if (activeTab === 'html') setHtml(newValue);
            else if (activeTab === 'css') setCss(newValue);
            else setJs(newValue);
            setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = selectionStart + 2; }, 0);
        }
    };

    const copyIndividual = () => {
        const text = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
        navigator.clipboard.writeText(text);
        setCopyStatus(prev => ({ ...prev, individual: 'Copied!' }));
        setTimeout(() => setCopyStatus(prev => ({ ...prev, individual: 'Copy' })), 2000);
    };

    // Helper to get current text for the active tab
    const getActiveCode = () => {
        if (activeTab === 'html') return html;
        if (activeTab === 'css') return css;
        return js;
    };

    return (
        <div className="codevora-container">
            <header className="pcc-header">
                <div className="pcc-logo"><i className="ri-code-s-slash-fill"></i> Playground</div>
                <div className="pcc-actions">
                    <div className="pcc-live-badge"><div className="dot-blink"></div> LIVE PREVIEW</div>
                </div>
            </header>

            <main className="pcc-main">
                <section className="editor-section">
                    <div className="pcc-tabs-wrapper">
                        <div className="pcc-tabs">
                            <button className={`pcc-tab ${activeTab === 'html' ? 'active' : ''}`} onClick={() => setActiveTab('html')} style={{color: 'rgb(196 108 72)'}}>
                                <i className="devicon-html5-plain colored" ></i> index.html
                            </button>
                            <button className={`pcc-tab ${activeTab === 'css' ? 'active' : ''}`} onClick={() => setActiveTab('css')} style={{color: 'rgb(90 130 224)'}}>
                                <i className="devicon-css3-plain colored" ></i> style.css
                            </button>
                            <button className={`pcc-tab ${activeTab === 'js' ? 'active' : ''}`} onClick={() => setActiveTab('js')} style={{color: '#949454'}}>
                                <i className="devicon-javascript-plain colored"></i> script.js
                            </button>
                        </div>
                        <button className="individual-copy-btn" onClick={copyIndividual}>
                            <i className="ri-clipboard-line"></i> {copyStatus.individual}
                        </button>
                    </div>

                    <div className="editor-area">
                        <div className="code-editor-container">
                            <textarea 
                                ref={textareaRef}
                                value={getActiveCode()} 
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if(activeTab === 'html') setHtml(val);
                                    else if(activeTab === 'css') setCss(val);
                                    else setJs(val);
                                }} 
                                onScroll={handleScroll}
                                onKeyDown={handleTabKeyDown} 
                                spellCheck="false" 
                                className="pcc-textarea"
                            />
                            <pre ref={preRef} className="pcc-highlight-layer" aria-hidden="true">
                                <code className={`language-${activeTab === 'js' ? 'javascript' : activeTab}`}>
                                    {getActiveCode()}
                                </code>
                            </pre>
                        </div>
                    </div>
                </section>

                <section className="preview-section">
                    <div className="browser-mock">
                        <div className="browser-head">
                            <div className="pcc-circles">
                                <span className='pcc-circle-1'></span>
                                <span className='pcc-circle-2'></span>
                                <span className='pcc-circle-3'></span>
                            </div>
                            <div className="pcc-url-bar">https://codevora140.vercel.app/PlayGround/Code-Compiler</div>
                        </div>
                        <iframe ref={iframeRef} title="preview" />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PlayGround_Code_Compiler;