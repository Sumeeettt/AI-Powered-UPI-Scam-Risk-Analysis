import { CalendarDays, ShieldAlert } from 'lucide-react';
import { getRiskStyle } from '../utils/riskUtils';
import PdfReportButton from './PdfReportButton.jsx';
import { rememberLatestAnalysis } from '../utils/pdfReport';

export default function AnalysisCard({ item }) {
  const style = getRiskStyle(item.risk_level);
  return (
    <div className="group rounded-2xl border border-slate-700/50 bg-slate-900/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-slate-800 hover:shadow-xl hover:shadow-cyan-500/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <ShieldAlert className={`${style.text} transition-transform duration-300 group-hover:scale-110`} size={28} />
          <div>
            <h3 className="font-extrabold text-white">{item.scam_category}</h3>
            <p className="text-sm font-medium text-slate-400">{item.source_type || 'unknown source'}</p>
          </div>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-sm font-bold shadow-sm ${style.bg} border-px ${style.border} ${style.text}`}>{item.risk_score}/100 - {item.risk_level}</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <p className="rounded-xl border border-slate-700/50 bg-slate-800/80 p-2.5 text-sm font-bold text-slate-300 shadow-inner">Trust Score: {item.trust_score ?? Math.max(0, 100 - (item.risk_score || 0))}/100</p>
        <p className="rounded-xl border border-slate-700/50 bg-slate-800/80 p-2.5 text-sm font-bold text-slate-300 shadow-inner">AI Scam Type: {item.ml_predicted_category || item.scam_category}</p>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-300">{item.summary}</p>
      <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <CalendarDays className="h-4 w-4" />
        {item.created_at ? new Date(item.created_at).toLocaleString() : 'Recent'}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <PdfReportButton result={item} inputType={item.source_type || 'History'} originalText={item.input_text || item.ocr_text || item.summary} />
        <button type="button" onClick={() => rememberLatestAnalysis(item)} className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700">
          Ask Assistant
        </button>
      </div>
    </div>
  );
}
