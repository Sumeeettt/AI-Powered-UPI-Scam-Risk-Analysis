import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, BadgeCheck, LockKeyhole, ScanSearch, Search, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../api/api';
import Loader from '../components/Loader.jsx';
import Navbar from '../components/Navbar.jsx';
import PdfReportButton from '../components/PdfReportButton.jsx';
import { rememberLatestAnalysis } from '../utils/pdfReport';

const sourceTypes = [
  ['sms', 'SMS'],
  ['whatsapp', 'WhatsApp'],
  ['email', 'Email'],
  ['upi_message', 'UPI Message'],
  ['link', 'Link'],
  ['other', 'Other']
];

const riskTheme = {
  Safe: 'border-green-200 bg-green-50 text-green-700',
  'Low Risk': 'border-blue-200 bg-blue-50 text-blue-700',
  Suspicious: 'border-amber-200 bg-amber-50 text-amber-700',
  'High Risk': 'border-orange-200 bg-orange-50 text-orange-700',
  Critical: 'border-red-200 bg-red-50 text-red-700'
};

const entityLabels = {
  urls: 'URLs',
  upi_ids: 'UPI IDs',
  phone_numbers: 'Phone numbers',
  amounts: 'Amounts'
};

function ResultSection({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-panel p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primaryBlue/30 hover:shadow-md">
      <h3 className="text-sm font-semibold text-slate-400">{title}</h3>
      <div className="mt-2 text-slate-400">{children}</div>
    </div>
  );
}

export default function QuickScan() {
  const [inputText, setInputText] = useState('');
  const [sourceType, setSourceType] = useState('sms');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (inputText.trim().length < 3) return toast.error('Paste a suspicious message, UPI text, or URL first');
    setLoading(true);
    try {
      const { data } = await api.post('/api/public/quick-scan', { input_text: inputText });
      setResult(data);
      rememberLatestAnalysis(data);
      toast.success('Quick scan complete');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Quick scan failed');
    } finally {
      setLoading(false);
    }
  };

  const entities = result?.extracted_entities || {};
  const riskClass = riskTheme[result?.risk_level] || 'border-slate-700/50 bg-panel text-slate-400';

  return (
    <div className="min-h-screen bg-page text-ink">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <header className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 px-4 py-2 text-sm font-medium text-primaryBlue">
            <ScanSearch className="h-4 w-4" /> Public scam check
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink md:text-5xl">Quick Scan</h1>
          <p className="mt-4 text-lg leading-8 text-slate-400">
            Paste a suspicious message, UPI request, banking warning, reward text, or URL. No login required.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[.88fr_1.12fr]">
          <form onSubmit={submit} className="rounded-2xl border border-slate-700/50 bg-panel p-6 shadow-soft">
            <div>
              <h2 className="text-xl font-bold text-ink">Check suspicious content</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Paste the message, link, or UPI text you want to verify.</p>
            </div>

            <label className="mt-6 block text-sm font-semibold text-slate-400">Suspicious content</label>
            <textarea
              className="field mt-2 min-h-72 resize-y"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Example: Your bank KYC will be blocked today. Click this link and pay Rs 10..."
            />

            <label className="mt-5 block text-sm font-semibold text-slate-400">Source type</label>
            <select className="field mt-2" value={sourceType} onChange={(e) => setSourceType(e.target.value)}>
              {sourceTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>

            <p className="mt-4 rounded-xl border border-green-700/30 bg-green-700/10 p-3 text-sm leading-6 text-green-300">
              <LockKeyhole className="mr-2 inline h-4 w-4" />
              Do not enter OTP, UPI PIN, card details, or banking passwords.
            </p>

            <button disabled={loading} className="btn-primary mt-5 w-full">Analyze Risk</button>
            {loading && <div className="mt-4"><Loader label="Analyzing risk signals..." /></div>}
          </form>

          <section className="rounded-2xl border border-slate-700/50 bg-panel p-6 shadow-soft">
            <h2 className="text-xl font-bold text-ink">Scan Result</h2>

            {!result ? (
              <div className="mt-8 flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-slate-600/30 bg-panel p-8 text-center">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primaryBlue/10 text-primaryBlue">
                    <Search className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-ink">Your risk analysis will appear here.</h3>
                  <p className="mt-2 max-w-md text-slate-400">FinShield will show risk score, warning signals, and safety guidance.</p>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <ResultSection title="Risk Score">
                    <p className="text-4xl font-bold text-ink">{result.risk_score}<span className="text-xl text-slate-400">/100</span></p>
                  </ResultSection>
                  <ResultSection title="Trust Score">
                    <p className="text-4xl font-bold text-green-600">{result.trust_score}<span className="text-xl text-slate-400">/100</span></p>
                  </ResultSection>
                  <ResultSection title="Risk Level">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${riskClass}`}>{result.risk_level}</span>
                  </ResultSection>
                    <ResultSection title="AI Scam Type">
                    <p className="font-semibold text-ink">{result.ml_predicted_category || result.scam_category}</p>
                    <p className="mt-1 text-sm text-slate-400">ML Confidence: {result.ml_confidence ?? 0}%</p>
                  </ResultSection>
                </div>

                {result.trust_score < 50 && (
                  <p className="rounded-xl border border-amber-700/30 bg-amber-700/10 p-4 text-sm font-semibold text-amber-300">
                    Low trust score. Do not proceed without official verification.
                  </p>
                )}
                {['High Risk', 'Critical'].includes(result.risk_level) && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-300">
                    Do not click links, share OTP/UPI PIN, or make payment.
                  </p>
                )}

                <ResultSection title="Scam Category">
                  <p className="font-semibold text-ink">{result.scam_category}</p>
                </ResultSection>

                <ResultSection title="Summary">
                  <p className="leading-7">{result.summary}</p>
                </ResultSection>

                <ResultSection title="Detected Signals">
                  <ul className="space-y-2">
                    {(result.explanation || result.detected_signals || []).map((signal) => (
                      <li key={signal} className="flex gap-2 text-sm leading-6">
                        <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-red-600" />
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </ResultSection>

                <ResultSection title="Link & UPI ID Check">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[...(result.url_upi_analysis?.urls || []), ...(result.url_upi_analysis?.upi_ids || [])].length ? (
                      [...(result.url_upi_analysis?.urls || []), ...(result.url_upi_analysis?.upi_ids || [])].map((item) => (
                        <div key={item.url || item.upi_id} className="rounded-lg bg-panel p-3 border border-slate-700/40">
                          <p className="break-all text-sm font-semibold text-ink">{item.url || item.upi_id}</p>
                          <p className="mt-1 text-sm font-bold text-primaryBlue">{item.risk}</p>
                          <ul className="mt-2 space-y-1 text-xs text-slate-400">
                            {item.reasons.map((reason) => <li key={reason}>- {reason}</li>)}
                          </ul>
                        </div>
                      ))
                    ) : <p className="text-sm text-slate-600">No URL or UPI ID found.</p>}
                  </div>
                </ResultSection>

                <ResultSection title="Extracted Details">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(entityLabels).map(([key, label]) => (
                      <div key={key} className="rounded-lg bg-panel p-3 border border-slate-700/40">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                        <p className="mt-1 break-words text-sm text-slate-400">{entities[key]?.length ? entities[key].join(', ') : 'None found'}</p>
                      </div>
                    ))}
                  </div>
                </ResultSection>

                <ResultSection title="Recommended Action">
                  <p className="rounded-xl border border-red-200 bg-red-50 p-3 leading-7 text-red-700">{result.recommended_action}</p>
                  {['High Risk', 'Critical'].includes(result.risk_level) && (
                    <Link to="/emergency-guide" className="mt-3 inline-flex rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">View Emergency Steps</Link>
                  )}
                </ResultSection>

                <ResultSection title="Safety Tips">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {(result.safety_tips || []).map((tip) => (
                      <li key={tip} className="flex gap-2 text-sm leading-6">
                        <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-green-600" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </ResultSection>

                <PdfReportButton result={result} inputType="Quick Scan" originalText={inputText} className="w-full" />

                <div className="rounded-2xl border border-primaryBlue/20 bg-primaryBlue/10 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className="font-semibold text-ink">Create an account to save this analysis and track scam history.</p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link to="/register" className="rounded-lg bg-primaryBlue px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primaryBlue/80 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryBlue focus-visible:ring-offset-2">Register</Link>
                      <Link to="/login" className="rounded-lg border border-primaryBlue/20 bg-panel px-5 py-3 text-center text-sm font-semibold text-primaryBlue transition-all duration-200 hover:-translate-y-0.5 hover:border-primaryBlue/30 hover:bg-primaryBlue/10 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryBlue focus-visible:ring-offset-2">Login</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
