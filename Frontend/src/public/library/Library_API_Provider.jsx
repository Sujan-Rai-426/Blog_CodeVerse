import React, { useCallback, useEffect, useState } from 'react'
import { Library_API_Context } from './Library_API_Context'
import { fetchLibraryTopics, fetchLibraryComponents } from './Library_API_Fetch';

const Library_API_Provider = ( {children} ) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ data, setData ] = useState({libraryTopics: [], libraryComponents: []})


    const CACHE_KEY = "react-library-api-cache";
    const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

    const loadAllData = useCallback( async() => {
        try{
            setLoading(true);

                // 🔹 Try to use localStorage cache if avaibale
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Date.now() - parsed.timestamp < CACHE_TTL) {
                    setData(parsed.data);
                    setLoading(false);
                    return;
                }
            }

            // 🔹 Fetch from API
            const[libraryTopics, libraryComponents] = await Promise.all([fetchLibraryTopics(), fetchLibraryComponents()]);
            const newData = {libraryTopics, libraryComponents};
            setData(newData);
            
            
            // 🔹 Set fresh Cache if old one expired
            localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({
                    timestamp: Date.now(),
                    data: newData,
                })
            );


        } catch(err) {
            setError("Error:",err);
        } finally {
            setLoading(false);
        }
    }, [] )


    useEffect(() => {
        loadAllData();
    }, [loadAllData]);


    return (
        <Library_API_Context.Provider value={{...data, error, loading, reload: loadAllData }}>
            {children}
        </Library_API_Context.Provider>
    )
}

export default Library_API_Provider