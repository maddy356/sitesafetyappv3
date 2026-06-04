"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle, MessageSquare, CheckSquare, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { forms } from "@/lib/forms";

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, lang } = useLanguage();
  
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated" || (session && !['Admin', 'Labour'].includes(session.user.role))) {
      router.push("/");
    } else if (status === "authenticated") {
      fetchSubmissions();
    }
  }, [status, session, router]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/submissions");
      const data = await res.json();
      if (data.submissions) {
        setSubmissions(data.submissions.filter(sub => sub.status === 'Reviewed'));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading history...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 6rem)' }}>
      
      {/* Submissions List */}
      <div className="card" style={{ width: '350px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t('reviewedForms')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('viewHistoryDesc')}</p>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
          {submissions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>You have no reviewed submissions yet.</p>
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
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--success)',
                    fontWeight: '500'
                  }}>
                    Reviewed
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(sub.createdAt).toLocaleDateString()} {new Date(sub.createdAt).toLocaleTimeString()}</p>
                {sub.remarks && sub.remarks.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '500' }}>
                    <MessageSquare size={12} /> {sub.remarks.length} Remarks
                  </div>
                )}
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
                <p style={{ color: 'var(--text-secondary)' }}>Submitted on {new Date(selectedSub.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Remarks Section */}
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={20} /> {t('managementRemarks')}
                </h3>
                
                {selectedSub.remarks && selectedSub.remarks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                            {rmk.type === 'Rectification' ? t('needsRectification') : t('identification')}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(rmk.createdAt).toLocaleString()}</span>
                        </div>
                        <p style={{ color: 'var(--text-primary)' }}>{rmk.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>{t('noRemarks')}</p>
                )}
              </div>

              {/* Form Data Viewer */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>{t('formResponses')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {Object.entries(selectedSub.formData).map(([key, value]) => {
                    if (key === 'attachments') return null;
                    
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
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>{t('attachments')}</h3>
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
                        <a href={file.data} download={file.name} style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', display: 'block', marginTop: '0.25rem' }}>{t('download')}</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            <CheckSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>{t('selectForm')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
