import React, { useEffect, useState } from "react";
import useAuthApi from "../auth-hooks/useAuthApi";
import UserCard from "../components/auth/cards/UserCard"; // Assuming this path, will create next

const AdminDashboardPage = () => {
    const { data: users, loading, error, fetchData } = useAuthApi();
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchData("/admin/users");
    }, [fetchData, refresh]);

    const handleUserUpdate = () => {
        setRefresh(!refresh);
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users && users.length > 0 ? (
                    users.map((user) => (
                        <UserCard key={user.id} user={user} onUserUpdate={handleUserUpdate} />
                    ))
                ) : (
                    <div>No users found.</div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;