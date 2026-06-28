import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const SavedJobsContext = createContext(null);

export function SavedJobsProvider({ children }) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState(new Set());
  const [savedJobs, setSavedJobs] = useState([]);

  const refresh = useCallback(() => {
    if (user?.role !== 'seeker') { setSavedIds(new Set()); setSavedJobs([]); return; }
    api.get('/seeker/saved-jobs').then(r => {
      setSavedJobs(r.data);
      setSavedIds(new Set(r.data.map(j => j.id)));
    }).catch(() => {});
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const toggleSave = async (jobId) => {
    if (user?.role !== 'seeker') return;
    if (savedIds.has(jobId)) {
      await api.delete(`/seeker/saved-jobs/${jobId}`);
    } else {
      await api.post('/seeker/saved-jobs', { jobId });
    }
    refresh();
  };

  return (
    <SavedJobsContext.Provider value={{ savedIds, savedJobs, toggleSave, refresh }}>
      {children}
    </SavedJobsContext.Provider>
  );
}

export const useSavedJobs = () => useContext(SavedJobsContext);
