'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const [ applications, setApplications ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState('');

  async function loadApplications() {
    try {
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

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <main>
      <h1>Job Tracker</h1>

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

                <p>
                  <strong>Status:</strong> {app.status}
                </p>

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
                </div>
          ))}
          </div>
      )}
    </main>
  );

}