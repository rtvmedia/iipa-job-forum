import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1a237e] text-gray-300 mt-auto">
      {/* tricolor bar at top of footer */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #FF9933 33.33%, #ffffff 33.33%, #ffffff 66.66%, #138808 66.66%)' }} />
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#FF9933] font-bold text-xl">IIPA</span>
            <span className="text-white font-semibold">Job Forum</span>
          </div>
          <p className="text-sm leading-relaxed">Your trusted career partner — connecting professionals with leading employers across India.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">For Job Seekers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/jobs"             className="hover:text-[#FF9933]">Browse Jobs</Link></li>
            <li><Link to="/register"         className="hover:text-[#FF9933]">Create Profile</Link></li>
            <li><Link to="/seeker/dashboard" className="hover:text-[#FF9933]">My Applications</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">For Employers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/register"            className="hover:text-[#FF9933]">Post a Job</Link></li>
            <li><Link to="/recruiter/dashboard" className="hover:text-[#FF9933]">Recruiter Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about"   className="hover:text-[#FF9933]">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#FF9933]">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} IIPA Job Forum. All rights reserved.
      </div>
    </footer>
  );
}
