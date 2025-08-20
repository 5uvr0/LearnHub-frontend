import React from "react";
import { Link } from "react-router-dom";

const UserCard = ({ user, onUserUpdate }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold">{user.email}</h2>
            <p className="text-gray-600">User ID: {user.userId}</p>
            <div className="mt-4">
                <Link
                    to={`/admin/user-management/${user.id}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Update Info
                </Link>
            </div>
        </div>
    );
};

export default UserCard;
