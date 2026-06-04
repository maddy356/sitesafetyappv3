"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle, MessageSquare, CheckSquare, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { forms } from "@/lib/forms";

export default function ReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  
  const [remark, setRemark] = useState("");
  const [remarkType, setRemarkType] = useState("Rectification");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" || (session && !['Admin', 'Manager'].includes(session.user.role))) {
      router.push("/");
    } else if (status === "authenticated") {
      fetchSubmissions();
    }
  }, [status, session, router]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/submissions");
      const data = await res.json();
      if (data.submissions) setSubmissions(data.submissions);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setSubmissions(submissions.map(s => s._id === id ? { ...s, status: newStatus } : s));
        if (selectedSub && selectedSub._id === id) {
          setSelectedSub({ ...selectedSub, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRemark = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/submissions/${selectedSub._id}/remarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: remark, type: remarkType })
      });
      if (res.ok) {
        const { submission } = await res.json();
        setSubmissions(submissions.map(s => s._id === submission._id ? submission : s));
        setSelectedSub(submission);
        setRemark("");
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading reviews...</div>;

  return (
    <div className="animate-fade-in split-view">
      
      {/* Submissions List */}
      <div className="card list-panel">
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t('formSubmissions')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('selectForm')}</p>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
          {submissions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No submissions found.</p>
          ) : (
            submissions.map(sub => (
              <div 
                key={sub._id}
                onClick={() => setSelectedSub(sub)}
                style={{ 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: `1px solid ${selectedSub?._id === sub._id ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: selectedSub?._id === sub._id ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-color)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontWeight: '600' }}>{sub.formType}</h4>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.125rem 0.5rem', 
                    borderRadius: '999px',
                    backgroundColor: sub.status === 'Reviewed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: sub.status === 'Reviewed' ? 'var(--success)' : '#d97706',
                    fontWeight: '500'
                  }}>
                    {sub.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>By: {sub.labour?.name || 'Unknown'} (ID: {sub.labour?.employeeId || 'N/A'})</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(sub.createdAt).toLocaleDateString()} {new Date(sub.createdAt).toLocaleTimeString()}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Panel */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedSub ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{selectedSub.formType} Checklist</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Submitted by {selectedSub.labour?.name} ({selectedSub.labour?.employeeId}) on {new Date(selectedSub.createdAt).toLocaleString()}</p>
              </div>
              {selectedSub.status !== 'Reviewed' && (
                <button onClick={() => handleStatusUpdate(selectedSub._id, 'Reviewed')} className="btn btn-primary" style={{ backgroundColor: 'var(--success)' }}>
                  <CheckCircle size={18} style={{ marginRight: '0.5rem' }} /> Mark as Reviewed
                </button>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Form Data Viewer */}
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Form Responses</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {Object.entries(selectedSub.formData).map(([key, value]) => {
                    if (key === 'attachments') return null; // Skip attachments array
                    
                    let displayKey = key.replace(/_/g, ' ').replace('sec ', 'Section ').replace('item', 'Item');
                    const formDef = forms[selectedSub.formType]?.en || forms[selectedSub.formType];
                    
                    if (formDef) {
                      if (key.startsWith('item_')) {
                        const idx = parseInt(key.split('_')[1]);
                        if (formDef.items && formDef.items[idx]) displayKey = formDef.items[idx];
                      } else if (key.startsWith('sec_')) {
                        const parts = key.split('_');
                        const sIdx = parseInt(parts[1]);
                        const iIdx = parseInt(parts[3]);
                        if (formDef.sections && formDef.sections[sIdx] && formDef.sections[sIdx].items[iIdx]) {
                          displayKey = `${formDef.sections[sIdx].title} - ${formDef.sections[sIdx].items[iIdx]}`;
                        }
                      } else {
                        const allFields = [...(formDef.fields || []), ...(formDef.extraFields || [])];
                        const matchedField = allFields.find(f => f.name === key);
                        if (matchedField) {
                          displayKey = matchedField.label;
                        } else if (key === 'comments') {
                          displayKey = "Additional Comments";
                        }
                      }
                    }

                    return (
                      <div key={key} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{displayKey}</p>
                        <p style={{ fontWeight: '500' }}>{value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attachments Section */}
              {selectedSub.formData.attachments && selectedSub.formData.attachments.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Attachments</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                    {selectedSub.formData.attachments.map((file, idx) => (
                      <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.5rem', overflow: 'hidden' }}>
                        {file.data.startsWith('data:image/') ? (
                          <img src={file.data} alt={file.name} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', borderRadius: '4px' }}>
                            <span style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>{file.name}</span>
                          </div>
                        )}
                        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {file.name}
                        </div>
                        <a href={file.data} download={file.name} style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', display: 'block', marginTop: '0.25rem' }}>Download</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Remarks Section */}
              <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={20} /> Remarks & Feedback
                </h3>
                
                {selectedSub.remarks && selectedSub.remarks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {selectedSub.remarks.map((rmk, idx) => (
                      <div key={idx} style={{ 
                        padding: '1rem', 
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: rmk.type === 'Rectification' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(59, 130, 246, 0.05)',
                        border: `1px solid ${rmk.type === 'Rectification' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', color: rmk.type === 'Rectification' ? 'var(--danger)' : 'var(--primary)' }}>
                            {rmk.type === 'Rectification' ? <AlertTriangle size={16} /> : <MessageSquare size={16} />}
                            {rmk.type}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(rmk.createdAt).toLocaleString()}</span>
                        </div>
                        <p style={{ color: 'var(--text-primary)' }}>{rmk.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontStyle: 'italic' }}>No remarks added yet.</p>
                )}

                <form onSubmit={handleAddRemark} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <select 
                      value={remarkType} 
                      onChange={(e) => setRemarkType(e.target.value)}
                      style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                    >
                      <option value="Rectification">Needs Rectification</option>
                      <option value="Identification">Identification / Note</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Add a remark for the labourer..." 
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      style={{ flex: 1 }}
                      required
                    />
                    <button type="submit" className="btn btn-primary">Add Remark</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            <CheckSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Select a submission from the list to review</p>
          </div>
        )}
      </div>
    </div>
  );
}
