import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  return (
    <nav className="bg-[#1a237e] text-white shadow-lg sticky top-0 z-50">
      {/* tricolor top bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #FF9933 33.33%, #ffffff 33.33%, #ffffff 66.66%, #138808 66.66%)' }} />

      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="text-[#FF9933] font-bold text-xl">IIPA</span>
          <span className="font-semibold text-white text-lg">Job Forum</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/jobs"    className="hover:text-[#FF9933] transition-colors">Find Jobs</Link>
          <Link to="/about"   className="hover:text-[#FF9933] transition-colors">About</Link>
          <Link to="/contact" className="hover:text-[#FF9933] transition-colors">Contact</Link>
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/seeker/dashboard'}
                className="text-sm hover:text-[#FF9933] transition-colors truncate max-w-[140px]"
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

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-[#1a237e] border-t border-white/10 px-4 py-4 flex flex-col gap-4 text-sm">
          <Link to="/jobs"    onClick={() => setOpen(false)} className="hover:text-[#FF9933] transition-colors py-1">Find Jobs</Link>
          <Link to="/about"   onClick={() => setOpen(false)} className="hover:text-[#FF9933] transition-colors py-1">About</Link>
          <Link to="/contact" onClick={() => setOpen(false)} className="hover:text-[#FF9933] transition-colors py-1">Contact</Link>
          <div className="border-t border-white/10 pt-3 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/seeker/dashboard'}
                  onClick={() => setOpen(false)}
                  className="hover:text-[#FF9933] transition-colors py-1"
                >
                  {user.fullName}
                </Link>
                <button onClick={handleLogout}
                  className="bg-[#FF9933] text-[#1a237e] font-semibold px-4 py-2 rounded-full hover:bg-orange-400 transition text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    onClick={() => setOpen(false)} className="hover:text-[#FF9933] transition-colors py-1">Sign In</Link>
                <Link to="/register" onClick={() => setOpen(false)}
                  className="bg-[#FF9933] text-[#1a237e] font-semibold px-4 py-2 rounded-full hover:bg-orange-400 transition text-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
