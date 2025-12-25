import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Previous_Page_Provider } from './context/Previous_Page_Context.jsx';
// import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
    <>
        {/* <StrictMode> */}
            {/* <HelmetProvider> */}
                <Previous_Page_Provider>
                    <App />
                </Previous_Page_Provider>
            {/* </HelmetProvider> */}
        {/* </StrictMode> */}
    </>
);
