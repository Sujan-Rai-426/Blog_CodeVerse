import React, { useState, useEffect } from 'react';
import * as Babel from '@babel/standalone';
import Utility_Preview from './Utility_Preview';

function Utility_Code() {
    const [code, setCode] = useState('');
    const [compiledCode, setCompiledCode] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Demo API Fetch Simulation
    useEffect(() => {
        const fetchInitialCode = async () => {
            setLoading(true);
            try {
                // In a real app, use: const response = await api.get("/api/get-template/1");
                // Here we simulate a 1-second network delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
const demoData = `
function App() {
  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body text-center">
          <h1 className="text-primary mb-3">Hello Bootstrap 👋</h1>

          <p className="text-muted">
            This is a simple React JSX page using Bootstrap.
          </p>

          <button className="btn btn-success">
            Click Me
          </button>
        </div>
      </div>
    </div>
  );
}
`;

                setCode(demoData);
            } catch (err) {
                console.error("API Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialCode();
    }, []);

    // 2. Compilation Logic
    useEffect(() => {
        if (!code) return;
        
        try {
            const transformed = Babel.transform(code, {
                presets: ['react'],
            }).code;
            setCompiledCode(transformed);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    }, [code]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Editor and Demo Data...</div>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <h1 style={{ marginBottom: '20px' }}>JSX Codeverse Compiler</h1>
            
            <div style={{ display: 'flex', gap: '20px', height: '70vh' }}>
                {/* Editor Panel */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ backgroundColor: '#333', color: '#fff', padding: '10px', borderRadius: '8px 8px 0 0', fontSize: '12px' }}>
                        index.jsx
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck="false"
                        style={{
                            flex: 1,
                            padding: '15px',
                            fontFamily: '"Fira Code", "Courier New", monospace',
                            fontSize: '14px',
                            backgroundColor: '#1e1e1e',
                            color: '#abb2bf',
                            border: 'none',
                            borderRadius: '0 0 8px 8px',
                            outline: 'none',
                            resize: 'none',
                            lineHeight: '1.5'
                        }}
                    />
                    {error && (
                        <div style={{ 
                            marginTop: '10px', 
                            padding: '10px', 
                            background: '#ffeded', 
                            color: '#d32f2f', 
                            borderRadius: '5px',
                            fontSize: '13px',
                            borderLeft: '5px solid #d32f2f'
                        }}>
                            <strong>Babel Compilation Error:</strong>
                            <pre style={{ whiteSpace: 'pre-wrap', margin: '5px 0 0' }}>{error}</pre>
                        </div>
                    )}
                </div>

                {/* Preview Panel */}
                <div style={{ flex: 1 }}>
                    <Utility_Preview compiledCode={compiledCode} />
                </div>
            </div>
        </div>
    );
}

export default Utility_Code;