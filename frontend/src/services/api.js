export const sendMessageToBot = async (token, message) => {
    try {
      const response = await fetch('https://us-central1-chatbot-resume-bd8c0.cloudfunctions.net/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, message }),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { reply: 'Fehler beim Verbinden mit dem Server.' };
    }
  };

  export const sendMessageToBot = async (token, message) => {
    try {
      const response = await fetch('https://us-central1-chatbot-resume-bd8c0.cloudfunctions.net/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, message }),
      });
  
      if (!response.ok) { // 👈 Neue Zeile
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      return { reply: error.message }; // 👈 Klare Fehlermeldung
    }
  };