"use client";

import { useState, useEffect } from "react";
import { forms } from "@/lib/forms";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DynamicForm({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { lang, t } = useLanguage();
  
  const [formConfig, setFormConfig] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const resolvedParams = React.use(params);
  const formType = decodeURIComponent(resolvedParams.type);

  useEffect(() => {
    if (forms[formType]) {
      setFormConfig(forms[formType][lang] || forms[formType]['en']);
    } else {
      router.push("/forms");
    }
  }, [formType, router, lang]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve({
          name: file.name,
          data: event.target.result // Base64
        });
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    })).then(base64Files => {
      setAttachments(prev => [...prev, ...base64Files]);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          formType, 
          formData: { ...formData, attachments }
        }),
      });
      if (res.ok) {
        router.push("/forms");
      }
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
  };

  if (!formConfig) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading form...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">{formConfig.title}</h1>
        <p className="page-description">{formConfig.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Core Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {formConfig.fields.map(field => (
            <div key={field.name} className="form-group">
              <label className="form-label">{field.label}</label>
              <input type={field.type} name={field.name} onChange={handleChange} required={field.required} style={{ width: '100%' }} />
            </div>
          ))}
        </div>

        {/* Checklist Items */}
        {formConfig.items && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Checklist</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {formConfig.items.map((item, idx) => (
                <div key={idx} style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <p style={{ fontWeight: '500', marginBottom: '0.75rem' }}>{item}</p>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {formConfig.itemOptions.map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="radio" name={`item_${idx}`} value={opt} onChange={handleChange} required />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sections (for nested items like Site Safety) */}
        {formConfig.sections && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {formConfig.sections.map((sec, s_idx) => (
              <div key={s_idx}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>{sec.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {sec.items.map((item, i_idx) => (
                    <div key={i_idx} style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <p style={{ fontWeight: '500', marginBottom: '0.75rem' }}>{item}</p>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {formConfig.itemOptions.map(opt => (
                          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input type="radio" name={`sec_${s_idx}_item_${i_idx}`} value={opt} onChange={handleChange} required />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Extra Fields */}
        {formConfig.extraFields && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {formConfig.extraFields.map(field => (
              <div key={field.name} className="form-group">
                <label className="form-label">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea name={field.name} onChange={handleChange} required={field.required} rows={4} style={{ width: '100%' }} />
                ) : (
                  <input type={field.type} name={field.name} onChange={handleChange} required={field.required} style={{ width: '100%' }} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Standard Comments Field */}
        <div className="form-group">
          <label className="form-label">{lang === 'ar' ? 'تعليقات إضافية (اختياري)' : 'Additional Comments (Optional)'}</label>
          <textarea name="comments" onChange={handleChange} rows={4} style={{ width: '100%' }} placeholder={lang === 'ar' ? 'أضف أي تعليقات أو ملاحظات إضافية هنا...' : 'Add any additional comments or observations here...'} />
        </div>

        {/* Attachments Upload */}
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
          <label className="form-label">{t('uploadImages')}</label>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{t('uploadMultiple')}</p>
          <input type="file" multiple onChange={handleFileChange} style={{ width: '100%' }} />
          
          {attachments.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              {attachments.map((att, i) => (
                <div key={i} style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.75rem' }}>
                  {att.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" onClick={() => router.push("/forms")} className="btn">{t('cancel')}</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '...' : t('submit')}
          </button>
        </div>
      </form>
    </div>
  );
}
