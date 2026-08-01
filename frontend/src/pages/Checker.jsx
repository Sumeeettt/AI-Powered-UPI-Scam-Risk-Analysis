import { useState } from 'react';
import { Link2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../api/api';
import Loader from '../components/Loader.jsx';
import Navbar from '../components/Navbar.jsx';

function FindingCard({ title, items, keyName }) {
  return (
    <section className="rounded-2xl border border-slate-700/50 bg-panel p-6 shadow-soft">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.length ? items.map((item) => (
          <div key={item[keyName]} className="rounded-xl border border-slate-700/50 bg-panel p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="break-all font-semibold text-ink">{item[keyName]}</p>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${item.risk === 'High Risk' ? 'bg-red-500/10 text-red-300' : item.risk === 'Suspicious' ? 'bg-amber-700/10 text-amber-300' : 'bg-green-700/10 text-green-300'}`}>{item.risk}</span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              {item.reasons.map((reason) => <li key={reason}>- {reason}</li>)}
            </ul>
          </div>
        )) : <p className="rounded-xl border border-dashed border-slate-600/30 bg-panel p-4 text-sm text-slate-400">No items found.</p>}
      </div>
    </section>
  );
}

export default function Checker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (text.trim().length < 2) return toast.error('Paste a URL, UPI ID, or message first');
    setLoading(true);
    try {
      const { data } = await api.post('/api/checker', { text });
      setResult(data);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Checker failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page text-ink">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <header className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 px-4 py-2 text-sm font-medium text-primaryBlue">
            <Link2 className="h-4 w-4" /> Public URL and UPI check
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">URL & UPI ID Checker</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">Paste a suspicious link, UPI ID, or full message to inspect risky link and payment-handle signals.</p>
        </header>

        <form onSubmit={submit} className="mt-10 rounded-2xl border border-slate-700/50 bg-panel p-6 shadow-soft">
          <textarea className="field min-h-44" value={text} onChange={(event) => setText(event.target.value)} placeholder="Example: http://bank-kyc-verify.com or kycverify@ybl" />
          <button disabled={loading} className="btn-primary mt-5 inline-flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" /> Check Risk
          </button>
          {loading && <div className="mt-4"><Loader label="Checking URL and UPI risk..." /></div>}
        </form>

        {result && (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <FindingCard title="URL Risk" items={result.urls || []} keyName="url" />
            <FindingCard title="UPI ID Risk" items={result.upi_ids || []} keyName="upi_id" />
            <div className="rounded-2xl border border-primaryBlue/20 bg-primaryBlue/10 p-5 lg:col-span-2">
              <p className="font-semibold text-ink">{result.advice}</p>
              <p className="mt-2 text-sm text-slate-400">{result.disclaimer}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
