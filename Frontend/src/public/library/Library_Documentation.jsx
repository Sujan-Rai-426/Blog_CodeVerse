import React, { useEffect } from 'react';
import Prism from 'prismjs';
import "prismjs/themes/prism-tomorrow.css";
import "./assets/css/Library_Documentation.css";

const Library_Documentation = () => {
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="docs-container">
            {/* --- Left Content Area --- */}
            <main className="docs-content">
                <header className="docs-header">
                    <span className="version-tag">v1.0.5</span>
                    <h1 className="docs-title">Getting Started</h1>
                    <p className="docs-subtitle">
                        Learn how to install and integrate <strong>CodeVora UI</strong> into your React projects.
                    </p>
                </header>

                <hr className="docs-divider" />

                {/* Installation Section */}
                <section id="installation" className="docs-section">
                    <h2>Installation</h2>
                    <p>Install the core package via npm to start using the components.</p>
                    <div className="code-block-wrapper">
                        <button className="copy-btn" onClick={() => copyToClipboard("npm install codevora-ui")}>Copy</button>
                        <pre className="language-bash">
                            <code>npm install codevora-ui</code>
                        </pre>
                    </div>
                </section>

                {/* Button Component Section */}
                <section id="button" className="docs-section">
                    <h2>Button Component</h2>
                    <p>
                        The Button is the primary interaction element. In <code>v1.0.5</code>, 
                        we've added design presets for faster workflow.
                    </p>

                    <h3>Usage</h3>
                    <div className="code-block-wrapper">
                        <pre className="language-jsx">
                            <code>{`import { Button } from 'codevora-ui';

function App() {
  return (
    <div className="flex gap-4">
      <Button design="primary">Default</Button>
      <Button design="gold" padding="12px 30px">Premium</Button>
      <Button design="outline" color="#38bdf8">Sky Blue</Button>
    </div>
  );
}`}</code>
                        </pre>
                    </div>

                    <h3>API Reference (Props)</h3>
                    <div className="lib-props-table-wrapper">
                        <table className="lib-props-table">
                            <thead>
                                <tr>
                                    <th>Prop</th>
                                    <th>Type</th>
                                    <th>Default</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>design</code></td>
                                    <td><code>"primary" | "outline" | "gold"</code></td>
                                    <td><code>"primary"</code></td>
                                    <td>Pre-styled visual variants.</td>
                                </tr>
                                <tr>
                                    <td><code>color</code></td>
                                    <td><code>string</code></td>
                                    <td><code>"inherit"</code></td>
                                    <td>Hex/RGB color for backgrounds or borders.</td>
                                </tr>
                                <tr>
                                    <td><code>padding</code></td>
                                    <td><code>string</code></td>
                                    <td><code>"10px 20px"</code></td>
                                    <td>Custom CSS padding for button size.</td>
                                </tr>
                                <tr>
                                    <td><code>className</code></td>
                                    <td><code>string</code></td>
                                    <td><code>""</code></td>
                                    <td>Custom classes for manual overrides.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* --- Right Sidebar (On This Page) --- */}
            <aside className="docs-toc">
                <h4>On this page</h4>
                <ul>
                    <li><a href="#installation">Installation</a></li>
                    <li><a href="#button">Button Component</a></li>
                    <li><a href="#presets">Design Presets</a></li>
                    <li><a href="#theming">Custom Theming</a></li>
                </ul>
            </aside>
        </div>
    );
};

export default Library_Documentation;