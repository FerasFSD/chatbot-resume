import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
  // Hol den Token aus der URL (z. B. ?token=recruiter_1)
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginTop: '50px',
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh'
    }}>
      <ChatInterface token={token} />
    </div>
  );
}

export default App;