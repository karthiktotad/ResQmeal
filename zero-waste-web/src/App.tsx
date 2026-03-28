import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/donor/UploadPage';
import DonorDashboardPage from './pages/donor/DashboardPage';
import ReceiverDashboardPage from './pages/receiver/DashboardPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import TrackPage from './pages/TrackPage';
import ImpactPage from './pages/ImpactPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary">
      <header className="bg-[#0F172A] border-b border-[#334155]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold font-inter text-[#F8FAFC]">ZeroWaste AI</Link>
          <nav className="flex gap-4">
            <Link to="/impact" className="text-[#94A3B8] hover:text-[#F8FAFC] transition">Impact</Link>
            <Link to="/donor/dashboard" className="text-[#94A3B8] hover:text-[#F8FAFC] transition">Donor</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-[#1E293B] border-t border-[#334155] text-text-muted py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} ZeroWaste AI. Turning surplus into hope.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/donor/upload" element={<UploadPage />} />
          <Route path="/donor/dashboard" element={<DonorDashboardPage />} />
          <Route path="/receiver/dashboard" element={<ReceiverDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/track/:foodId" element={<TrackPage />} />
          <Route path="/impact" element={<ImpactPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
