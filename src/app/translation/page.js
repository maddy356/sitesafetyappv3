"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { useState } from "react";

export default function TranslationPage() {
  const { lang, changeLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(lang);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    changeLanguage(selectedLang);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">{t('translationSettings')}</h1>
          <p className="page-description">{t('translationSettingsDesc')}</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Globe size={24} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t('selectLanguage')}</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: selectedLang === 'en' ? 'rgba(0, 102, 204, 0.05)' : 'var(--bg-color)', borderColor: selectedLang === 'en' ? 'var(--primary)' : 'var(--border)' }}>
            <input 
              type="radio" 
              name="language" 
              value="en" 
              checked={selectedLang === 'en'} 
              onChange={() => setSelectedLang('en')}
              style={{ width: '1.2rem', height: '1.2rem' }}
            />
            <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>English</span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: selectedLang === 'ar' ? 'rgba(0, 102, 204, 0.05)' : 'var(--bg-color)', borderColor: selectedLang === 'ar' ? 'var(--primary)' : 'var(--border)' }}>
            <input 
              type="radio" 
              name="language" 
              value="ar" 
              checked={selectedLang === 'ar'} 
              onChange={() => setSelectedLang('ar')}
              style={{ width: '1.2rem', height: '1.2rem' }}
            />
            <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>العربية (Arabic)</span>
          </label>
        </div>

        <button onClick={handleSave} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          {t('savePreferences')}
        </button>

        {saved && (
          <p style={{ color: 'var(--success)', marginTop: '1rem', textAlign: 'center', fontWeight: '500' }}>
            {t('preferencesSaved')}
          </p>
        )}
      </div>
    </div>
  );
}
