import Sidebar from '../components/Sidebar.jsx';

export default function Layout({ children, title, subtitle, action }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 via-indigo-950/20 to-slate-900 text-slate-200">
      <Sidebar />
      <main className="pb-28 md:ml-64 md:pb-10">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 relative z-10">
          <header className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 md:text-4xl">{title}</h1>
              {subtitle && <p className="max-w-2xl text-base leading-relaxed text-slate-400/90 font-medium">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
