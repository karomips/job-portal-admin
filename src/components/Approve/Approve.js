import React, { useEffect, useState } from 'react';
import './Approve.css';

function Approve() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAction = (id, status) => {
    fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then(res => res.json())
      .then(() => {
        setUsers(prev => prev.filter(user => user._id !== id));
        setActionMsg(`Successfully ${status === 'approved' ? 'approved' : 'rejected'}!`);
        setTimeout(() => setActionMsg(''), 2000);
      });
  };

  return (
    <div className="approve-container">
      <h2>Pending User Approvals</h2>
      {loading && <div>Loading...</div>}
      {actionMsg && <div className="approve-msg">{actionMsg}</div>}
      {!loading && users.length === 0 && <div>No pending users.</div>}
      <ul className="approve-list">
        {users.map(user => (
          <li key={user._id} className="approve-item">
            <div>
              <strong>{user.name}</strong> ({user.email})<br />
              <span>{user.message}</span>
            </div>
            <div className="approve-actions">
              <button onClick={() => handleAction(user._id, 'approved')} className="approve-btn approve">Approve</button>
              <button onClick={() => handleAction(user._id, 'rejected')} className="approve-btn reject">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Approve;