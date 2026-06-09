import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar       from './components/Navbar';
import Footer       from './components/Footer';
import AIAssistant  from './components/AIAssistant';

import Home         from './pages/public/Home';
import Jobs         from './pages/public/Jobs';
import JobDetail    from './pages/public/JobDetail';
import Login        from './pages/public/Login';
import Register     from './pages/public/Register';
import About        from './pages/public/About';
import Contact      from './pages/public/Contact';

import SeekerDashboard from './pages/seeker/Dashboard';
import SeekerProfile   from './pages/seeker/Profile';

import RecruiterDashboard from './pages/recruiter/Dashboard';
import PostJob            from './pages/recruiter/PostJob';
import Applicants         from './pages/recruiter/Applicants';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user)             return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
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
            <ProtectedRoute role="recruiter"><PostJob /></ProtectedRoute>
          } />
          <Route path="/recruiter/applicants/:jobId" element={
            <ProtectedRoute role="recruiter"><Applicants /></ProtectedRoute>
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
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
