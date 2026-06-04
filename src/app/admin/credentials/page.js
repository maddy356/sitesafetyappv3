"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Building, Key, User, Edit, Trash2 } from "lucide-react";

export default function CredentialsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', placeOfWork: '', role: '', password: '' });

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

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId));
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        const { user } = await res.json();
        setUsers(users.map(u => u._id === user._id ? user : u));
        setEditingUser(null);
      }
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading credentials...</div>;

  const groupedUsers = users.reduce((acc, user) => {
    const company = user.placeOfWork || "Unassigned";
    if (!acc[company]) acc[company] = [];
    acc[company].push(user);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem', position: 'relative' }}>
      {/* Edit Modal Overlay */}
      {editingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Edit User</h2>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} required style={{ width: '100%' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Place of Work (Company)</label>
                <input type="text" value={editForm.placeOfWork} onChange={e => setEditForm({...editForm, placeOfWork: e.target.value})} required style={{ width: '100%' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Labour">Labour</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">New Password (Optional)</label>
                <input type="text" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} placeholder="Leave blank to keep current" style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" onClick={() => setEditingUser(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Company Credentials</h1>
          <p className="page-description">View all generated user credentials grouped by company.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {Object.entries(groupedUsers).map(([company, companyUsers]) => (
          <div key={company} className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <Building size={20} />
              {company}
              <span style={{ fontSize: '0.875rem', backgroundColor: 'rgba(0, 102, 204, 0.1)', color: 'var(--primary)', padding: '0.125rem 0.5rem', borderRadius: '999px', marginLeft: 'auto' }}>
                {companyUsers.length} Users
              </span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {companyUsers.map(user => (
                <div key={user._id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                    <User size={16} style={{ color: 'var(--text-secondary)' }} />
                    {user.name}
                    <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{user.role}</span>
                  </div>
                  
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Employee ID:</span>
                      <strong style={{ userSelect: 'all' }}>{user.employeeId}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Key size={14} /> Password:</span>
                      <strong style={{ userSelect: 'all' }}>{user.initialPassword || user.employeeId}</strong>
                    </div>
                  </div>
                  
                  {user.role === 'Admin' && user.employeeId === 'ADMIN001' && (
                     <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.5rem', fontStyle: 'italic' }}>Note: Admin default password is 'admin123'</p>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <button 
                      onClick={() => {
                        setEditingUser(user);
                        setEditForm({ name: user.name, placeOfWork: user.placeOfWork, role: user.role, password: '' });
                      }} 
                      className="btn" 
                      style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', color: 'white', backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}
                    >
                      <Edit size={14} /> Edit
                    </button>
                    {user.employeeId !== 'ADMIN001' && (
                      <button 
                        onClick={() => handleDelete(user._id)} 
                        className="btn" 
                        style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', color: 'white', backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {Object.keys(groupedUsers).length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No users have been created yet.
          </div>
        )}
      </div>
    </div>
  );
}
