"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { forms } from "@/lib/forms";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FormsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (status === "unauthenticated" || (session && !['Admin', 'Labour'].includes(session.user.role))) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading" || !session) return null;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">{t('startChecklist')}</h1>
        <p className="page-description">{t('selectForm')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {Object.keys(forms).map((formName) => {
          const formDef = forms[formName][lang] || forms[formName]['en'];
          return (
            <Link key={formName} href={`/forms/${encodeURIComponent(formName)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', transition: 'var(--transition)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>{formDef.title}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>{formDef.description}</p>
                  </div>
                </div>
                
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: '500', fontSize: '0.875rem' }}>
                  {t('startChecklist')} <ArrowRight size={16} style={{ marginLeft: '0.5rem', rtl: { transform: 'rotate(180deg)' } }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
