
import api from "../../config/api"


export const fetchLibraries = async() => {
    const res = await api.get("/api/libraries/");
    return res.data;
}