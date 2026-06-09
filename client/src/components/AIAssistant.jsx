import { useState } from 'react';

const DEMO_REPLIES = {
  default: "I'm your IIPA Career Assistant! I can help you find jobs, improve your profile, and prepare for interviews. What would you like to know?",
  job:     "We currently have openings in Technology, HR, Marketing, and Finance. Try searching by category on the Jobs page, or tell me your skills and I'll suggest matching roles!",
  resume:  "A strong resume should highlight measurable achievements, use action verbs, and be tailored to each role. Keep it to 1-2 pages. Would you like specific tips for your field?",
  interview: "To ace your interview: research the company, prepare STAR-format answers for behavioral questions, and have 2-3 questions ready for the interviewer. Good luck!",
  salary:  "Salaries vary by role and experience. For tech roles in Pakistan, junior positions typically range PKR 80k–120k, mid-level 120k–200k, and senior 200k+. Check individual job listings for specifics.",
};

function getReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('job') || m.includes('role') || m.includes('position')) return DEMO_REPLIES.job;
  if (m.includes('resume') || m.includes('cv'))                           return DEMO_REPLIES.resume;
  if (m.includes('interview'))                                             return DEMO_REPLIES.interview;
  if (m.includes('salary') || m.includes('pay'))                          return DEMO_REPLIES.salary;
  return DEMO_REPLIES.default;
}

export default function AIAssistant() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: DEMO_REPLIES.default }
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    const botMsg  = { from: 'bot',  text: getReply(input) };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 bg-[#0a2342] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl hover:bg-[#0d2d59] transition"
        title="AI Career Assistant"
      >
        🤖
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-[#0a2342] text-white px-4 py-3 flex items-center justify-between">
            <span className="font-semibold text-sm">AI Career Assistant</span>
            <button onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-72">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-snug ${
                  m.from === 'user'
                    ? 'bg-[#0a2342] text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-2 flex gap-2">
            <input
              className="flex-1 text-sm border rounded-lg px-3 py-2 outline-none focus:border-[#0a2342]"
              placeholder="Ask me anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button
              onClick={send}
              className="bg-[#c9a84c] text-[#0a2342] font-bold px-3 py-2 rounded-lg hover:bg-yellow-400 transition text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
