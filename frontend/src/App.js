import logo from './logo.svg';
import './App.css';
import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

function App() {
  // Hol den Token aus der URL (z. B. ?token=recruiter_1)
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <ChatInterface token={token} />
    </div>
  );
}

export default App;