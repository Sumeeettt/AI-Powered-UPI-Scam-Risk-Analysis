export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#E6EEF6',
        page: '#071423',
        panel: '#0F172A',
        primaryBlue: '#FB923C',
        dangerRed: '#DC2626',
        successGreen: '#16A34A'
      },
      boxShadow: {
        glow: '0 18px 45px rgba(15, 23, 42, 0.08)',
        soft: '0 14px 35px rgba(15, 23, 42, 0.07)'
      }
    }
  },
  plugins: []
};
