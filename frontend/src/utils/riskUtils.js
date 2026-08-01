export const riskStyles = {
  Safe: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500', border: 'border-emerald-500/20' },
  'Low Risk': { text: 'text-sky-400', bg: 'bg-sky-500/10', bar: 'bg-sky-500', border: 'border-sky-500/20' },
  Suspicious: { text: 'text-amber-400', bg: 'bg-amber-500/10', bar: 'bg-amber-500', border: 'border-amber-500/20' },
  'High Risk': { text: 'text-orange-400', bg: 'bg-orange-500/10', bar: 'bg-orange-500', border: 'border-orange-500/20' },
  Critical: { text: 'text-red-400', bg: 'bg-red-500/10', bar: 'bg-red-500', border: 'border-red-500/20' }
};

export const getRiskStyle = (level = 'Safe') => riskStyles[level] || riskStyles.Safe;

export const chartColors = ['#34D399', '#38BDF8', '#FBBF24', '#FB923C', '#F87171'];

export const riskChartColor = (name = '') => ({
  Safe: '#34D399',
  'Low Risk': '#38BDF8',
  Suspicious: '#FBBF24',
  'High Risk': '#FB923C',
  Critical: '#F87171'
}[name] || '#38BDF8');
