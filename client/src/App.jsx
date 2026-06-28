import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar       from './components/Navbar';
import Footer       from './components/Footer';
import AIAssistant  from './components/AIAssistant';
import api          from './api/axios';

import Home         from './pages/public/Home';
import Jobs         from './pages/public/Jobs';
import JobDetail    from './pages/public/JobDetail';
import Login        from './pages/public/Login';
import Register     from './pages/public/Register';
import About        from './pages/public/About';
import Contact      from './pages/public/Contact';
import Employers    from './pages/public/Employers';

import SeekerDashboard from './pages/seeker/Dashboard';
import SeekerProfile   from './pages/seeker/Profile';

import RecruiterDashboard from './pages/recruiter/Dashboard';
import PostJob            from './pages/recruiter/PostJob';
import Applicants         from './pages/recruiter/Applicants';
import CompanyProfile     from './pages/recruiter/CompanyProfile';

import AdminPanel       from './pages/admin/AdminPanel';
import CoordinatorPanel from './pages/coordinator/CoordinatorPanel';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const allowed = Array.isArray(role) ? role : role ? [role] : null;
  if (allowed && !allowed.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/jobs"    element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about"   element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/employers" element={<Employers />} />

          <Route path="/seeker/dashboard" element={
            <ProtectedRoute role="seeker"><SeekerDashboard /></ProtectedRoute>
          } />
          <Route path="/seeker/profile" element={
            <ProtectedRoute role="seeker"><SeekerProfile /></ProtectedRoute>
          } />

          <Route path="/recruiter/dashboard" element={
            <ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>
          } />
          <Route path="/recruiter/post-job" element={
            <ProtectedRoute role={['recruiter','admin']}><PostJob /></ProtectedRoute>
          } />
          <Route path="/recruiter/applicants/:jobId" element={
            <ProtectedRoute role="recruiter"><Applicants /></ProtectedRoute>
          } />
          <Route path="/recruiter/company-profile" element={
            <ProtectedRoute role={['recruiter','admin']}><CompanyProfile /></ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>
          } />
          <Route path="/coordinator/dashboard" element={
            <ProtectedRoute role="coordinator"><CoordinatorPanel /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    api.get('/settings').then(r => {
      if (r.data?.headerLogoUrl) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = r.data.headerLogoUrl;
      }
    }).catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
