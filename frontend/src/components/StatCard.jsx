const toneClasses = {
  blue: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  red: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  orange: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  green: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
};

export default function StatCard({ icon: Icon, label, value = 0, tone = 'blue' }) {
  const isLongText = typeof value === 'string' && value.length > 12;
  return (
    <div className="group rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-slate-800 hover:shadow-xl hover:shadow-cyan-500/10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-wide text-slate-400 uppercase">{label}</p>
          <p className={`mt-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 ${isLongText ? 'text-lg leading-6' : 'text-3xl'}`}>{value ?? 0}</p>
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${toneClasses[tone] || toneClasses.blue}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}
