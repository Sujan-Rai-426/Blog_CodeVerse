import api from "../../config/api";

// This is the "Lite" fetch for the grid
export const fetchLibraryTopics = async() => {
    const res = await api.get(`/api/library/topics/`);
    return res.data;
}

export const fetchLibraryComponents = async() => {
    const res = await api.get(`/api/library/components/`);
    return res.data;
}

//Fetch "Full" data for one specific component
export const fetchComponentDetail = async(id) => {
    const res = await api.get(`/api/library/components/${id}/`);
    return res.data;
}