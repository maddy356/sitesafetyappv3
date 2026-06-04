"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Users, FileText, CheckSquare, Key } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || !session) return null;

  const role = session.user?.role;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">{t('welcome')}, {session.user.name}</h1>
        <p className="page-description">{t('yourRoleIs')} <strong>{t(role?.toLowerCase())}</strong>.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          {t('quickActions')}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          {role === 'Admin' && (
            <>
              <Link href="/admin/users" className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', textDecoration: 'none', color: 'inherit', transition: 'var(--transition)' }}>
                <div style={{ backgroundColor: 'rgba(0, 102, 204, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
                  <Users size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{t('createUsers')}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('manageUsers')}</p>
                </div>
              </Link>
              
              <Link href="/admin/credentials" className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', textDecoration: 'none', color: 'inherit', transition: 'var(--transition)' }}>
                <div style={{ backgroundColor: 'rgba(0, 102, 204, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
                  <Key size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{t('viewCredentials')}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('viewCredentialsDesc')}</p>
                </div>
              </Link>
            </>
          )}

          {(role === 'Manager' || role === 'Admin') && (
            <Link href="/reviews" className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', textDecoration: 'none', color: 'inherit', transition: 'var(--transition)' }}>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
                <CheckSquare size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{t('reviewSubmissions')}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('reviewSubDesc')}</p>
              </div>
            </Link>
          )}

          {(role === 'Labour' || role === 'Admin') && (
            <>
              <Link href="/forms" className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', textDecoration: 'none', color: 'inherit', transition: 'var(--transition)' }}>
                <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}>
                  <FileText size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{t('startChecklist')}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('startChecklistDesc')}</p>
                </div>
              </Link>
              
              <Link href="/history" className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', textDecoration: 'none', color: 'inherit', transition: 'var(--transition)' }}>
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
                  <CheckSquare size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{t('viewHistory')}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('viewHistoryDesc')}</p>
                </div>
              </Link>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
