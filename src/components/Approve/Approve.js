import React, { useEffect, useState } from 'react';
import './Approve.css';

function Approve() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/approvals')
      .then(res => res.json())
      .then(data => {
        setPending(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAction = (id, status) => {
    fetch(`http://localhost:5000/api/approvals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then(res => res.json())
      .then(() => {
        setPending(prev => prev.filter(item => item._id !== id));
        setActionMsg(`Successfully ${status === 'approved' ? 'approved' : 'rejected'}!`);
        setTimeout(() => setActionMsg(''), 2000);
      });
  };

  return (
    <div className="approve-container">
      <h2>Pending Approvals</h2>
      {loading && <div>Loading...</div>}
      {actionMsg && <div className="approve-msg">{actionMsg}</div>}
      {!loading && pending.length === 0 && <div>No pending approvals.</div>}
      <ul className="approve-list">
        {pending.map(item => (
          <li key={item._id} className="approve-item">
            <div>
              <strong>{item.name}</strong> ({item.email})<br />
              <span>{item.message}</span>
            </div>
            <div className="approve-actions">
              <button onClick={() => handleAction(item._id, 'approved')} className="approve-btn approve">Approve</button>
              <button onClick={() => handleAction(item._id, 'rejected')} className="approve-btn reject">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Approve;