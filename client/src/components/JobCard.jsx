import { Link } from 'react-router-dom';

const TYPE_COLORS = {
  'full-time':  'bg-green-100 text-green-700',
  'part-time':  'bg-blue-100 text-blue-700',
  'contract':   'bg-orange-100 text-orange-700',
  'remote':     'bg-purple-100 text-purple-700',
  'internship': 'bg-pink-100 text-pink-700',
};

export default function JobCard({ job }) {
  const salary = job.salaryMin
    ? `₹ ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k`
    : 'Salary not disclosed';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link to={`/jobs/${job.id}`} className="font-semibold text-[#1a237e] hover:text-[#FF9933] text-lg leading-tight block truncate">
            {job.title}
          </Link>
          <p className="text-gray-500 text-sm mt-1">{job.company}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${TYPE_COLORS[job.type] || 'bg-gray-100 text-gray-600'}`}>
          {job.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
        <span>📍 {job.location || 'India'}</span>
        <span>💼 {job.category || 'General'}</span>
        <span>💰 {salary}</span>
      </div>

      {job.deadline && (
        <p className="text-xs text-gray-400 mt-3">Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
      )}

      <Link
        to={`/jobs/${job.id}`}
        className="mt-4 inline-block bg-[#1a237e] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#283593] transition"
      >
        View Details
      </Link>
    </div>
  );
}
