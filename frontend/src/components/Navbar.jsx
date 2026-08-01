import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const linkClass = ({ isActive }) =>
    `border-b-2 py-1 text-sm font-medium transition-colors duration-200 ${isActive ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
    }`;
  const sectionLinkClass = 'border-b-2 border-transparent py-1 text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-white focus:outline-none focus-visible:border-cyan-400 focus-visible:text-cyan-400';

  const handleSectionNavigate = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const [theme, setTheme] = useState('warm');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const t = saved || 'warm';
    setTheme(t);
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('theme-warm', t === 'warm');
      document.body.classList.toggle('theme-cool', t === 'cool');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'warm' ? 'cool' : 'warm';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.body.classList.toggle('theme-warm', next === 'warm');
    document.body.classList.toggle('theme-cool', next === 'cool');
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-700/50 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <ShieldCheck className="text-cyan-400" />
          FinShield
        </Link>
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/quick-scan" className={linkClass}>Quick Scan</NavLink>
          <NavLink to="/checker" className={linkClass}>Checker</NavLink>
          <NavLink to="/awareness" className={linkClass}>Awareness</NavLink>
          <NavLink to="/emergency-guide" className={linkClass}>Emergency Guide</NavLink>
          <button type="button" onClick={() => handleSectionNavigate('features')} className={sectionLinkClass}>Features</button>
          <button type="button" onClick={() => handleSectionNavigate('about')} className={sectionLinkClass}>About Us</button>
          <button type="button" onClick={toggleTheme} className="rounded-md p-2 text-slate-300 hover:bg-white/5" aria-label="Toggle theme">
            {theme === 'warm' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          {isAuthenticated ? (
            <>
              {user?.name && <span className="hidden text-sm font-medium text-slate-400 md:inline">{user.name}</span>}
              <Link to="/dashboard" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-cyan-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2">Dashboard</Link>
              <button onClick={() => logout()} className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500/10 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <Link to="/register" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-cyan-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
