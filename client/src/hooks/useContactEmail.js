import { useState, useEffect } from 'react';
import api from '../api/axios';

// The public contact email is an admin-managed site setting (Admin > Logo & Branding).
export default function useContactEmail() {
  const [email, setEmail] = useState('');
  useEffect(() => { api.get('/settings').then(r => setEmail(r.data?.contactEmail || '')).catch(() => {}); }, []);
  return email;
}
