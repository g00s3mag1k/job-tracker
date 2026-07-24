'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const [ applications, setApplications ] = useState([]);
  const [ company, setCompany ] = useState('');
  const [ role, setRole ] = useState('');
  const [ jobUrl, setJobUrl ] = useState('');
  const [ status, setStatus ] = useState('saved');
  const [ notes, setNotes ] = useState('');
  const [ search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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

  function getStatusLabel(status) {
    const labels = {
      saved: 'Saved',
      applied: 'Applied',
      interviewing: 'Interviewing',
      rejected: 'Rejected',
      offer: 'Offer',
    };

    return labels[status] || status;
  }

  function getStatusStyle(status) {
    const styles = {
      saved: {
        background: '#334155',
        color: '#e2e8f0'
      },
      applied: {
        background: '#1d4ed8',
        color: '#dbeafe',
      },
      interviewing: {
        background: '#854d0e',
        color: '#fef3c7',
      },
      rejected: {
        background: '#7f1d1d',
        color: '#fee2e2',
      },
      offer: {
        background: '#14532d',
        color: '#dcfce7',
      },
    };

    return styles[status] || styles.saved;
  }

  const filteredApplication = applications.filter((app) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm) ||
      app.role.toLowerCase().includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalApplications = applications.length;
  const appliedCount = applications.filter(
    (app) => app.status === 'applied'
  ).length;
  const interviewCount = applications.filter(
    (app) => app.status === 'interviewing'
  ).length;
  const offerCount = applications.filter(
    (app) => app.status === 'offer'
  ).length;

  return (
    <main>
      <h1>Job Tracker</h1>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns:'repeat(4, 1fr',
          gap: 16,
          marginTop: 20,
          marginBottom: 30,
      }}
      >
        <div style={cardStyle}>
          <h2>{totalApplications}</h2>
          <p>Total</p>
        </div>

        <div style={cardStyle}>
          <h2>{appliedCount}</h2>
          <p>Applied</p>
        </div>

        <div style={cardStyle}>
          <h2>{interviewCount}</h2>
          <p>Interviewing</p>
        </div>

        <div style={cardStyle}>
          <h2>{offerCount}</h2>
          <p>Offers</p>
        </div>
      </div>
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

      <input
        type='text'
        placeholder='Search by company or role...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginTop: 20,
          padding: 10,
          width: '100%',
        }}
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{
          marginTop: 12,
          padding: 10,
          width: '100%',
        }}
      >
        <option value='all'>All statuses</option>
        <option value='saved'>Saved</option>
        <option value='applied'>Applied</option>
        <option value='interviewing'>Interviewing</option>
        <option value='rejected'>Rejected</option>
        <option value='offer'>Offer</option>
      </select>
      {error && (
        <p style={{ color: '#f87171' }}>
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : filteredApplication.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: 12,
            marginTop: 20,
          }}
        >
          {filteredApplication.map((app) => (
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

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{...getStatusStyle(app.status),
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {getStatusLabel(app.status)}
                  </span>
                  
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
                </div>

                <p style={{ opacity: 0.75, fontSize: 14 }}>
                  Added: {new Date(app.createdAt).toLocaleDateString()}
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