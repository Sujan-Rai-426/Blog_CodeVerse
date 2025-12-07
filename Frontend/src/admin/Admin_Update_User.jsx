import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import apiAdmin from "../config/apiAdmin.js";
import { useAdmin } from "./Admin_API_Context.jsx";
import "../assets/css/Admin_Update_User.css"
import "../assets/css/Admin_Update_Data.css"; // table/skeleton styles

const Admin_Update_User = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [savingId, setSavingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [userTypeFilter, setUserTypeFilter] = useState("");

    const { cache, fetchResource, updateCacheList } = useAdmin();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Use cache if available
            // When fetching from cache
            if (cache.users && Array.isArray(cache.users)) {
                setUsers(cache.users);
            } else {
                const res = await apiAdmin.get("/api/admin/users/");
                const data = Array.isArray(res.data) ? res.data : res.data.results || [];
                setUsers(data);
                // Store in cache for future visits
                updateCacheList("users", data, "set"); 
            }
        } catch (err) {
            console.error(err);
            alert("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    

    // ================= Search + Filter Function =================
    const handleSearch = (term, type = userTypeFilter) => {
        setSearchTerm(term);

        const list = Array.isArray(users) ? users : []; // ensure array
        const filtered = list.filter(u => {
            const matchesSearch = u.full_name?.toLowerCase().includes(term.toLowerCase()) ||
                                u.email?.toLowerCase().includes(term.toLowerCase());
            const matchesType = type ? u.user_type === type : true;
            return matchesSearch && matchesType;
        });
        setFilteredUsers(filtered);
    };


    const handleFilter = (type, term = searchTerm) => {
        setUserTypeFilter(type);
        handleSearch(term, type); // reuse filtering logic
    };


    const handleEdit = (user) => {
        setEditingId(user.id);
        setFormData({ ...user });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({});
    };

    const handleUpdate = async (id) => {
        try {
            setSavingId(id);
            const res = await apiAdmin.patch(`/api/admin/users/${id}/`, formData);
            setUsers((prev) => prev.map((u) => (u.id === id ? res.data : u)));
            setFilteredUsers((prev) => prev.map((u) => (u.id === id ? res.data : u)));
            updateCacheList("users", res.data, "update");
            handleCancel();
            alert("User updated!");
        } catch (err) {
            console.error(err);
            alert("Update failed!");
        } finally {
            setSavingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await apiAdmin.delete(`/api/admin/users/${id}/`);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            setFilteredUsers((prev) => prev.filter((u) => u.id !== id));
            updateCacheList("users", { id }, "delete");
            if (editingId === id) handleCancel();
            alert("Deleted successfully");
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };


    return (
        <div className="auu-container">
            <h2 className="auu-title">Users List</h2>

            {/* ================= Search & Filter Bar ================= */}
            <div className="auu-search-wrapper"> <FaSearch className="auu-search-icon" /> 
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={searchTerm} 
                    className="auu-search-input" 
                    onChange={(e) => handleSearch(e.target.value, userTypeFilter)} 
                />
                <select
                    className="auu-filter-select"
                    value={userTypeFilter}
                    onChange={(e) => handleFilter(e.target.value, searchTerm)}
                >
                    <option value="">All Types</option>
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                    {/* <option value="superuser">Superuser</option> */}
                </select>
            </div>

            {loading ? (
                <div className="avd-skeleton-wrapper">
                    <div className="avd-skeleton-cards">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="avd-skeleton-card">
                                <div className="avd-skeleton avd-skeleton-line short"></div>
                                <div className="avd-skeleton avd-skeleton-line"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <table className="auu-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Type</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>
                                        {editingId === user.id ? (
                                            <input
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        ) : user.email}
                                    </td>
                                    <td>
                                        {editingId === user.id ? (
                                            <input
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            />
                                        ) : user.username}
                                    </td>
                                    <td>
                                        {editingId === user.id ? (
                                            <input
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            />
                                        ) : user.full_name}
                                    </td>
                                    <td>
                                        {editingId === user.id ? (
                                            <select
                                                value={formData.user_type}
                                                onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : user.user_type}
                                    </td>
                                    <td>
                                        {editingId === user.id ? (
                                            <select
                                                value={formData.is_active}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, is_active: e.target.value === "true" })
                                                }
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        ) : user.is_active ? "Active" : "Inactive"}
                                    </td>
                                    <td>
                                        {editingId === user.id ? (
                                            <>
                                                <button className="avd-save-btn auu-btn" onClick={() => handleUpdate(user.id)}>
                                                    {savingId === user.id ? "Saving..." : "Save"}
                                                </button>
                                                <button className="avd-cancel-btn auu-btn" onClick={handleCancel}>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="auu-edit-btn auu-btn" onClick={() => handleEdit(user)}>
                                                    <FaEdit /> Edit
                                                </button>
                                                <button className="auu-delete-btn auu-btn" onClick={() => handleDelete(user.id)}>
                                                    <FaTrash /> Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};
export default Admin_Update_User;