"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, CheckSquare, Users, LogOut, Key, Globe } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLanguage();

  if (!session) return null;

  const role = session.user?.role;

  const navItems = [
    { name: t('dashboard'), href: '/', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Labour'] },
    { name: t('myForms'), href: '/forms', icon: FileText, roles: ['Admin', 'Labour'] },
    { name: t('myHistory'), href: '/history', icon: CheckSquare, roles: ['Admin', 'Labour'] },
    { name: t('reviewForms'), href: '/reviews', icon: CheckSquare, roles: ['Manager', 'Admin'] },
    { name: t('userManagement'), href: '/admin/users', icon: Users, roles: ['Admin'] },
    { name: t('credentialsList'), href: '/admin/credentials', icon: Key, roles: ['Admin'] },
    { name: t('translationOption'), href: '/translation', icon: Globe, roles: ['Admin', 'Manager', 'Labour'] },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="page-title" style={{ fontSize: '1.25rem' }}>Site Safety</h1>
        <p className="page-description" style={{ fontSize: '0.875rem' }}>{session.user?.name} ({t(role?.toLowerCase())})</p>
      </div>
      <div className="sidebar-nav">
        {navItems.filter(item => item.roles.includes(role)).map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </div>
      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <button className="nav-link" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => signOut()}>
          <LogOut size={20} />
          {t('signOut')}
        </button>
      </div>
    </div>
  );
}
