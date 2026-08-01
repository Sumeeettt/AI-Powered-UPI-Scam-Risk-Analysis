import { NavLink } from 'react-router-dom';
import { AlertTriangle, BarChart3, FileImage, History, Link2, LogOut, Megaphone, MessageSquareText, ShieldCheck, Siren, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/analyze-text', label: 'Analyze Text', icon: MessageSquareText },
  { to: '/analyze-image', label: 'Analyze Image', icon: FileImage },
  { to: '/history', label: 'History', icon: History },
  { to: '/report-scam', label: 'Report Scam', icon: Siren },
  { to: '/checker', label: 'Checker', icon: Link2 },
  { to: '/awareness', label: 'Awareness', icon: Megaphone },
  { to: '/emergency-guide', label: 'Emergency', icon: AlertTriangle },
  { to: '/profile', label: 'Profile', icon: User }
];

export default function Sidebar() {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-indigo-500/20 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-md md:inset-y-0 md:left-0 md:w-64 md:border-r md:border-r-indigo-500/10 md:border-t-0 md:p-5">
      <div className="mb-8 hidden items-center gap-3 px-2 text-xl font-extrabold tracking-tight text-white md:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
          <ShieldCheck className="h-5 w-5" />
        </div>
        FinShield
      </div>
      <nav className="grid grid-cols-4 gap-1 md:block md:space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 text-[10px] font-medium transition-all duration-300 md:flex-row md:justify-start md:gap-3 md:px-3 md:text-sm ${isActive
                ? 'bg-cyan-500/15 text-cyan-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] md:border-l-4 md:border-l-cyan-400'
                : 'text-slate-400 hover:-translate-y-0.5 hover:bg-slate-800/50 hover:text-slate-200 md:hover:translate-x-1 md:hover:translate-y-0'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="hidden md:inline">{label}</span>
          </NavLink>
        ))}
        <button onClick={handleLogout} className="flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 text-[10px] font-medium text-red-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500/10 md:mt-8 md:w-full md:flex-row md:justify-start md:gap-3 md:border-t md:border-slate-800/50 md:px-3 md:pt-6 md:text-sm md:hover:translate-x-1 md:hover:translate-y-0">
          <LogOut className="h-5 w-5" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </nav>
    </aside>
  );
}
