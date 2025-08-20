import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthApi from "../auth-hooks/useAuthApi";

const UserManagementPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { data: user, loading, error, fetchData } = useAuthApi();
    const { data: deleteResponse, loading: deleting, error: deleteError, fetchData: deleteUser } = useAuthApi();
    const { data: updateResponse, loading: updating, error: updateError, fetchData: updateUser } = useAuthApi();
    const [disableAccount, setDisableAccount] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchData(`/admin/user/${userId}`); // Assuming this endpoint
        }
    }, [userId, fetchData]);

    useEffect(() => {
        if (deleteResponse) {
            alert("User deleted successfully!");
            navigate("/admin/dashboard");
        }
    }, [deleteResponse, navigate]);

    useEffect(() => {
        if (updateResponse) {
            alert("User updated successfully!");
            navigate("/admin/dashboard");
        }
    }, [updateResponse, navigate]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            await deleteUser(`/admin/delete-user/${userId}`, { method: "DELETE" }); // Assuming this endpoint
        }
    };

    const handleDisableEnable = async () => {
        if (user) {
            const updatedUser = { ...user, enabled: !disableAccount };
            await updateUser("/admin/update-user", { method: "PUT", data: updatedUser }); // Assuming this endpoint
        }
    };

    if (loading) return <div>Loading user details...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>User not found.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manage User: {user.email}</h1>
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <p><strong>User ID:</strong> {user.userId}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Account Status:</strong> {user.enabled ? "Enabled" : "Disabled"}</p>
                <div className="mt-4 flex space-x-4">
                    <button
                        onClick={handleDisableEnable}
                        disabled={updating}
                        className={`font-bold py-2 px-4 rounded ${user.enabled ? "bg-yellow-500 hover:bg-yellow-700" : "bg-green-500 hover:bg-green-700"} text-white`}
                    >
                        {updating ? "Processing..." : (user.enabled ? "Disable Account" : "Enable Account")}
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {deleting ? "Deleting..." : "Delete Account"}
                    </button>
                </div>
                {deleteError && <div className="text-red-500 mt-2">Error deleting user: {deleteError}</div>}
                {updateError && <div className="text-red-500 mt-2">Error updating user: {updateError}</div>}
            </div>
        </div>
    );
};

export default UserManagementPage;
