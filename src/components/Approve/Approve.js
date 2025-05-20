import React, { useEffect, useState } from 'react';
import './Approve.css';

function Approve() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log('Fetching users...'); // Debug log

        const response = await fetch('http://localhost:5000/api/users');
        console.log('Raw response:', response); // Debug log

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Parsed data:', data); // Debug log
        
        if (data.success) {
          setUsers(data.users);
          console.log('Users set:', data.users); // Debug log
        } else {
          setActionMsg('Error: ' + data.message);
        }
      } catch (error) {
        console.error('Detailed fetch error:', {
          message: error.message,
          stack: error.stack
        });
        setActionMsg('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAction = async (userId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      
      if (data.success) {
        setUsers(prev => prev.filter(user => user._id !== userId));
        setActionMsg(`Successfully ${status === 'approved' ? 'approved' : 'rejected'}!`);
      } else {
        setActionMsg(data.message || 'Error updating status');
      }
    } catch (error) {
      console.error('Action error:', error);
      setActionMsg('Error updating status');
    }
    
    setTimeout(() => setActionMsg(''), 2000);
  };

  return (
    <div className="approve-container">
      <h2>Pending User Approvals</h2>
      {loading && <div>Loading...</div>}
      {actionMsg && <div className="approve-msg">{actionMsg}</div>}
      {!loading && users.length === 0 && <div>No pending users.</div>}
      
      <table className="approve-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name || 'N/A'}</td>
              <td>{user.email || 'N/A'}</td>
              <td>{user.status || 'pending'}</td>
              <td className="approve-actions">
                <button 
                  onClick={() => handleAction(user._id, 'approved')} 
                  className="approve-btn approve"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleAction(user._id, 'rejected')} 
                  className="approve-btn reject"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Approve;