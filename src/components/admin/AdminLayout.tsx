```tsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Utilisateurs', adminOnly: true },
    { path: '/admin/blog', icon: <FileText size={20} />, label: 'Blog' },
    { path: '/admin/projects', icon: <Briefcase size={20} />, label: 'Projets' },
    { path: '/admin/services', icon: <MessageSquare size={20} />, label: 'Services' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Paramètres' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1e37] text-white">
        <div className="p-4">
          <Link to="/" className="text-xl font-bold">AME Admin</Link>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            (!item.adminOnly || user?.role === 'admin') && (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm ${
                  isActive(item.path)
                    ? 'bg-[#3498db] text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            )
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-sm text-gray-300 hover:bg-gray-800"
          >
            <LogOut size={20} />
            <span className="ml-3">Déconnexion</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
```