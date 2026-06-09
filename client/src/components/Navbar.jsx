import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-[#0a2342] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-[#c9a84c] font-bold text-xl">IIPA</span>
          <span className="font-semibold text-white text-lg">Job Forum</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/jobs"   className="hover:text-[#c9a84c] transition-colors">Find Jobs</Link>
          <Link to="/about"  className="hover:text-[#c9a84c] transition-colors">About</Link>
          <Link to="/contact" className="hover:text-[#c9a84c] transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/seeker/dashboard'}
                className="text-sm hover:text-[#c9a84c] transition-colors"
              >
                {user.fullName}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-[#c9a84c] text-[#0a2342] text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-yellow-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="text-sm hover:text-[#c9a84c] transition-colors">Sign In</Link>
              <Link to="/register" className="bg-[#c9a84c] text-[#0a2342] text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-yellow-400 transition">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
