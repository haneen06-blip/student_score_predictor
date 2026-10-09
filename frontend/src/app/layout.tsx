import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'ApexScore | Student Performance Analytics & Exam Score Predictor',
  description: 'High-precision academic score forecasting, empirical factor attribution, and cohort benchmarking based on verified regression models.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-indigo-500/30 selection:text-indigo-200 min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 backdrop-blur py-6 mt-16 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">ApexScore Platform</span>
              <span>•</span>
              <span>Empirical Student Score Forecasting</span>
            </div>
            <div className="flex items-center gap-6">
              <span>Standardized Multiple Regression</span>
              <span>Cohort Benchmark: 6,607 Records</span>
              <span>R² = 0.74 | MAE = 1.62</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
