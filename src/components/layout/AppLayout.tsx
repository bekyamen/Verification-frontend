'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  CheckSquare, 
  Clock, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div style={{ fontSize: '1.125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Loading…</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="flex items-center gap-3 p-6 mb-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-lg">
            ✓
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-tight leading-none">PayCheck</h1>
            <p className="text-xs text-sidebar-text mt-1">Verify Payments. Build Trust.</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col pt-4">
          <div className={`nav-item ${pathname === '/' ? 'active' : ''}`} onClick={() => router.push('/')}>
            <Home size={20} />
            Home
          </div>
          <div className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`} onClick={() => router.push('/dashboard')}>
            <CheckSquare size={20} />
            Verify Payment
          </div>
          <div className={`nav-item ${pathname === '/transactions' ? 'active' : ''}`}>
            <Clock size={20} />
            Transaction History
          </div>
          <div className={`nav-item ${pathname === '/merchants' ? 'active' : ''}`}>
            <Users size={20} />
            Merchants / Accounts
          </div>
          <div className={`nav-item ${pathname === '/reports' ? 'active' : ''}`}>
            <BarChart3 size={20} />
            Reports
          </div>
          <div className={`nav-item ${pathname === '/settings' ? 'active' : ''}`} onClick={() => router.push('/settings')}>
            <Settings size={20} />
            Settings
          </div>
        </nav>

        {/* Support Card */}
        <div className="p-4 mt-auto">
          <div className="bg-[#112347] rounded-xl p-4">
            <div className="flex items-center gap-2 text-white font-semibold mb-2 text-sm">
              <HelpCircle size={18} className="text-primary" />
              Need Help?
            </div>
            <p className="text-xs text-sidebar-text mb-4">
              Our support team is here for you 24/7.
            </p>
            <button
              className="w-full btn btn-outline text-xs py-2"
              style={{ borderColor: 'var(--sidebar-text)', color: '#fff', borderRadius: 'var(--radius-lg)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Contact Support →
            </button>
          </div>
          <div className="mt-4 text-xs text-sidebar-text/50">
            © 2025 PayCheck. All rights reserved.
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="flex items-center gap-2 text-muted bg-[#F4F7FC] px-4 py-2 rounded-lg w-96 ml-2">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search transactions, reference or merchant..." 
              className="bg-transparent border-none text-sm w-full text-text-main"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-muted hover:text-text-main relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-[#E0E7FF] text-primary flex items-center justify-center font-bold text-sm">
                BK
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-none">{user.fullName || 'Bereket Terefe'}</span>
                <span className="text-xs text-muted mt-1">{user.role || 'Merchant'}</span>
              </div>
              <ChevronDown size={16} className="text-muted ml-1" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
