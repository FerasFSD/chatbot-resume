export const sendMessageToBot = async (token, message) => {
    try {
      const response = await fetch('https://your-firebase-project.cloudfunctions.net/chat', {
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