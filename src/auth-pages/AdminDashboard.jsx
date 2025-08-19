import React, { useEffect, useState } from "react";
import useAuthApi from "../auth-hooks/useAuthApi";
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalUsers: 0,
    disabledUsers: 0,
    currentlyOnline: 0
  });
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  
  const { data, loading, error, fetchData } = useAuthApi();

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      await fetchData('/admin/stats');
      if (data) {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load admin stats", err);
    }
  };

  const fetchUsers = async () => {
    try {
      await fetchData('/admin/users');
      if (data) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await fetchData(`/admin/users/${userId}`, { method: 'DELETE' });
      if (data !== null) {
        setUsers(users.filter(user => user.id !== userId));
        setStats(prev => ({
          ...prev,
          totalUsers: prev.totalUsers - 1
        }));
        alert("User deleted successfully");
      }
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Failed to delete user");
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await fetchData(`/admin/users/${userId}/toggle-status`, { 
        method: 'PUT',
        body: { enabled: !currentStatus }
      });
      
      if (data !== null) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, enabled: !currentStatus }
            : user
        ));
        
        setStats(prev => ({
          ...prev,
          activeUsers: currentStatus ? prev.activeUsers - 1 : prev.activeUsers + 1,
          disabledUsers: currentStatus ? prev.disabledUsers + 1 : prev.disabledUsers - 1
        }));
      }
    } catch (err) {
      console.error("Failed to toggle user status", err);
      alert("Failed to update user status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && users.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="text-muted">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="text-muted">Currently Online</div>
              <div className="h4 font-weight-bold text-success">{stats.currentlyOnline}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="text-muted">Active Users</div>
              <div className="h4 font-weight-bold text-primary">{stats.activeUsers}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="text-muted">Disabled Users</div>
              <div className="h4 font-weight-bold text-danger">{stats.disabledUsers}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="text-muted">Total Users</div>
              <div className="h4 font-weight-bold text-dark">{stats.totalUsers}</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="h5 mb-0">User Management</h2>
          <button
            onClick={() => setShowUserList(!showUserList)}
            className="btn btn-primary"
          >
            {showUserList ? 'Hide Users' : 'Show Users'}
          </button>
        </div>

        {showUserList && (
          <div className="card-body">
            {users.length === 0 ? (
              <p className="text-muted text-center py-4">No users found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Email</th>
                      <th scope="col">Role</th>
                      <th scope="col">Status</th>
                      <th scope="col">Created</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="font-weight-bold">{user.email}</div>
                          <div className="text-muted small">ID: {user.id}</div>
                        </td>
                        <td>
                          <span className="badge bg-info">{user.role}</span>
                        </td>
                        <td>
                          <span className={`badge ${user.enabled ? 'bg-success' : 'bg-danger'}`}>
                            {user.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="text-muted">
                          {formatDate(user.createdAt)}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => toggleUserStatus(user.id, user.enabled)}
                              className={`btn btn-sm ${user.enabled ? 'btn-warning' : 'btn-success'}`}
                            >
                              {user.enabled ? 'Disable' : 'Enable'}
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="btn btn-sm btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;