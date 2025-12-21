import React, { useMemo } from 'react';

function Utility_Preview({ compiledCode }) {
    const generatedSrcDoc = useMemo(() => {
        // If there's no code yet, show a placeholder instead of an empty white screen
        const codeToRun = compiledCode || "";

        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                    <style>
                        body { margin: 0; padding: 15px; font-family: sans-serif; background: white !important; }
                        #root { min-height: 100vh; display: block; }
                    </style>
                </head>
                <body>
                    <div id="root"></div>
                    <script>
                        window.onerror = function(msg) {
                            document.getElementById('root').innerHTML = '<div style="color:red">Runtime Error: ' + msg + '</div>';
                        };

                        try {
                            ${codeToRun}
                            
                            if (typeof App !== 'undefined') {
                                const root = ReactDOM.createRoot(document.getElementById('root'));
                                root.render(React.createElement(App));
                            } else {
                                document.getElementById('root').innerHTML = '<div style="color: #856404; background: #fff3cd; padding: 15px;">Waiting for "function App()"...</div>';
                            }
                        } catch (err) {
                            document.getElementById('root').innerHTML = '<div style="color:red">Render Error: ' + err.message + '</div>';
                        }
                    </script>
                </body>
            </html>
        `;
    }, [compiledCode]);

    return (
        <iframe
            title="preview"
            srcDoc={generatedSrcDoc}
            sandbox="allow-scripts" 
            style={{ 
                width: '100%', 
                height: '100%', 
                minHeight: '400px',
                border: '2px solid #333', // Changed to dark so you can see it
                borderRadius: '8px', 
                background: 'white' // Set to white to ensure visibility
            }}
        />
    );
}

export default Utility_Preview;