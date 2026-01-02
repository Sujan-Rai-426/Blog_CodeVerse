
import api from "../../config/api"


export const fetchLibraryTopics = async() => {
    const res = await api.get(`/api/library/topics/`);
    return res.data;
}

export const fetchLibraryComponents = async() => {
    const res = await api.get(`/api/library/components/`)
    return res.data;
}