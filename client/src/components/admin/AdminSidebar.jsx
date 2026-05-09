import { Link, useLocation } from 'react-router-dom';
import { HiOutlineHome, HiOutlineCube, HiOutlineUsers, HiOutlineClipboardList, HiOutlineCog } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';

const AdminSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    { path: '/admin', label: 'Dashboard', icon: HiOutlineHome },
    { path: '/admin/products', label: 'Products', icon: HiOutlineCube },
    { path: '/admin/orders', label: 'Orders', icon: HiOutlineClipboardList },
    { path: '/admin/users', label: 'Users', icon: HiOutlineUsers },
  ];

  return (
    <aside className="w-64 flex-shrink-0 min-h-[calc(100vh-64px)] glass-strong border-r border-white/5 flex flex-col hidden lg:flex">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          <HiOutlineCog className="text-violet" /> Admin Panel
        </h2>
        <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path || (location.pathname.startsWith(link.path) && link.path !== '/admin');
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet/20 to-cyan/10 text-white border border-violet/20 shadow-glow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <link.icon size={20} className={isActive ? 'text-cyan' : ''} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Back to Storefront
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
