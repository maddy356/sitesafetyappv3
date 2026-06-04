"use client";

import { useState, useEffect } from "react";
import { UserPlus, Users as UsersIcon, ShieldAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    placeOfWork: "",
    dateOfBirth: "",
    phoneNumber: "",
    role: "Labour",
    password: ""
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user.role !== 'Admin')) {
      router.push("/");
    } else if (status === "authenticated") {
      fetchUsers();
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: "loading", message: "Creating user..." });

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormStatus({ type: "error", message: data.error || "Failed to create user" });
      } else {
        setFormStatus({ type: "success", message: `User created! ID: ${data.user.employeeId}` });
        setUsers([data.user, ...users]);
        setFormData({
          name: "", placeOfWork: "", dateOfBirth: "", phoneNumber: "", role: "Labour", password: ""
        });
      }
    } catch (err) {
      setFormStatus({ type: "error", message: "Network error occurred." });
    }
  };

  if (status === "loading" || loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-description">Create new user IDs and assign roles for the Site Safety app.</p>
      </div>

      <div className="grid-split">
        
        {/* Create User Form */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <UserPlus className="text-primary" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Create New User</h2>
          </div>

          {formStatus.message && (
            <div style={{ 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '1.5rem',
              backgroundColor: formStatus.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: formStatus.type === 'error' ? 'var(--danger)' : 'var(--success)'
            }}>
              {formStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Password (Optional)</label>
                <input type="text" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to auto-generate" style={{ width: '100%' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Place of Work</label>
                <input type="text" name="placeOfWork" value={formData.placeOfWork} onChange={handleChange} required style={{ width: '100%' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Phone Number</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required style={{ width: '100%' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required style={{ width: '100%' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%' }}>
                  <option value="Labour">Labour</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Password (Optional)</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Defaults to Employee ID if left blank" style={{ width: '100%' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                If left blank, the user's password will be their Employee ID.
              </p>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={formStatus.type === 'loading'}>
              {formStatus.type === 'loading' ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>

        {/* User List */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <UsersIcon className="text-primary" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Active Users ({users.length})</h2>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
            {users.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No users found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {users.map((user) => (
                  <div key={user._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-color)' }}>
                    <div>
                      <h4 style={{ fontWeight: '600' }}>{user.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>({user.employeeId})</span></h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{user.placeOfWork} • {user.phoneNumber}</p>
                    </div>
                    <div>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: user.role === 'Admin' ? 'rgba(59, 130, 246, 0.1)' : user.role === 'Manager' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: user.role === 'Admin' ? 'var(--primary)' : user.role === 'Manager' ? 'var(--success)' : '#d97706'
                      }}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
