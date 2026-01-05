import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Previous_Page_Provider } from './public/Home/context/Previous_Page_Context.jsx';
import Interactive_Grid_Background from './public/Home/context/Interactive_Grid_Background.jsx';
// import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
    <>
        {/* <StrictMode> */}
            {/* <HelmetProvider> */}
                <Previous_Page_Provider>
                    <>
                        <App />
                    </>
                </Previous_Page_Provider>
            {/* </HelmetProvider> */}
        {/* </StrictMode> */}
    </>
);
