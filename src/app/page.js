'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const [ applications, setApplications ] = useState([]);
  const [ company, setCompany ] = useState('');
  const [ role, setRole ] = useState('');
  const [ jobUrl, setJobUrl ] = useState('');
  const [ status, setStatus ] = useState('saved');
  const [ notes, setNotes ] = useState('');
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState('');

  async function loadApplications() {
    try {
      setError('');
      setLoading(true); 

      const res = await fetch('/api/applications');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load applications");
      }

      setApplications(data.applications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createApplication(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company, 
          role,
          jobUrl,
          status,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create application');
      }

      setApplications((prev) => [data.application, ...prev]);

      setCompany('');
      setRole('');
      setJobUrl('');
      setStatus('saved');
      setNotes('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteApplication(id) {
    setError('');
    
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete application');
      }

      setApplications((prev) => prev.filter((app) => app._id !== id));
    
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateApplicationStatus(id, nextStatus) {
    setError('');

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update application');
      }

      setApplications((prev) => 
        prev.map((app) =>
          app._id === id ? data.application : app
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <main>
      <h1>Job Tracker</h1>
      <p>Track job applications, statuses, notes, and interviews.</p>

      <form onSubmit={createApplication} style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        <input
          placeholder='Company'
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          placeholder='Role'
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          placeholder='Job URL'
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value='saved'>Saved</option>
          <option value='applied'>Applied</option>
          <option value='interviewing'>Interviewing</option>
          <option value='rejected'>Rejected</option>
          <option value='offer'>Offer</option>
        </select>

        <textarea
          placeholder='Notes'
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type='submit' disabled={!company.trim() || !role.trim()}>
          Add Application
        </button>
      </form>


      {error && (
        <p style={{ color: '#f87171' }}>
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: 12,
            marginTop: 20,
          }}
        >
          {applications.map((app) => (
            <div 
              key={app._id}
              style={{
                border: '1px solid #334155',
                borderRadius: 12,
                padding: 16,
                background: '#111827',
              }}
              >
                <h2>{app.company}</h2>

                <p>
                  <strong>Role:</strong> {app.role}
                </p>

                <label>
                  <strong>Status:</strong> {' '}
                  <select
                    value={app.status}
                    onChange={(e) => updateApplicationStatus(app._id, e.target.value)}
                    >
                      <option value='saved'>Saved</option>
                      <option value='applied'>Applied</option>
                      <option value='interviewing'>Interviewing</option>
                      <option value='rejected'>Rejected</option>
                      <option value='offer'>Offer</option>
                    </select>
                </label>

                {app.jobUrl && (
                  <p>
                    <a
                      href={app.jobUrl}
                      target='_blank'
                      rel='noreferrer'
                      >
                        Job Posting
                      </a>
                  </p>
                )}

                {app.notes && (
                  <p>{app.notes}</p>
                )}

                <button 
                  onClick={() => deleteApplication(app._id)}
                  style={{ marginTop: 12 }}>Delete</button>
                </div>
          ))}
          </div>
      )}
    </main>
  );

}