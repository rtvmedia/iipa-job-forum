import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0a2342] text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#c9a84c] font-bold text-xl">IIPA</span>
            <span className="text-white font-semibold">Job Forum</span>
          </div>
          <p className="text-sm leading-relaxed">Your trusted career partner — connecting professionals with leading employers across Pakistan.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">For Job Seekers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/jobs"             className="hover:text-[#c9a84c]">Browse Jobs</Link></li>
            <li><Link to="/register"         className="hover:text-[#c9a84c]">Create Profile</Link></li>
            <li><Link to="/seeker/dashboard" className="hover:text-[#c9a84c]">My Applications</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">For Employers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/register"           className="hover:text-[#c9a84c]">Post a Job</Link></li>
            <li><Link to="/recruiter/dashboard" className="hover:text-[#c9a84c]">Recruiter Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about"   className="hover:text-[#c9a84c]">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#c9a84c]">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} IIPA Job Forum. All rights reserved.
      </div>
    </footer>
  );
}
