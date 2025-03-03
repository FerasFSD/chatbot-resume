import React, { useState } from 'react';
import { Box, TextField, IconButton, List, ListItem, ListItemText, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { sendMessageToBot } from '../services/api';

const ChatInterface = ({ token }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!message.trim()) return;

      // User-Nachricht hinzufügen
  const userMsg = { text: message, isBot: false };
  setMessages(prev => [...prev, userMsg]);
  setMessage('');

  // Backend anfragen
  const { reply } = await sendMessageToBot(token, message);

  // Bot-Nachricht hinzufügen
  setMessages(prev => [...prev, { text: reply, isBot: true }]);
};


    // Temporär: Simuliere eine Antwort, bis das Backend integriert ist
    const newMessages = [...messages, { text: message, isBot: false }, { text: "Das ist eine Testantwort!", isBot: true }];
    setMessages(newMessages);
    setMessage('');
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px', maxWidth: '600px' }}>
      <List style={{ height: '400px', overflow: 'auto' }}>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={msg.text} 
              style={{ textAlign: msg.isBot ? 'left' : 'right' }}
            />
          </ListItem>
        ))}
      </List>
      <Box display="flex" alignItems="center">
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Stelle mir eine Frage..."
        />
        <IconButton onClick={handleSend} color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatInterface;