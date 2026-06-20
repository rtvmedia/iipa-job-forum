import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-[#1a237e] text-white shadow-lg sticky top-0 z-50">
      {/* tricolor top bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #FF9933 33.33%, #ffffff 33.33%, #ffffff 66.66%, #138808 66.66%)' }} />
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-[#FF9933] font-bold text-xl">IIPA</span>
          <span className="font-semibold text-white text-lg">Job Forum</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/jobs"    className="hover:text-[#FF9933] transition-colors">Find Jobs</Link>
          <Link to="/about"   className="hover:text-[#FF9933] transition-colors">About</Link>
          <Link to="/contact" className="hover:text-[#FF9933] transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/seeker/dashboard'}
                className="text-sm hover:text-[#FF9933] transition-colors"
              >
                {user.fullName}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-[#FF9933] text-[#1a237e] text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-orange-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="text-sm hover:text-[#FF9933] transition-colors">Sign In</Link>
              <Link to="/register" className="bg-[#FF9933] text-[#1a237e] text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-orange-400 transition">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
