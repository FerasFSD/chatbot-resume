export const sendMessageToBot = async (token, message) => {
    try {
      const response = await fetch(`https://europe-west1-chatbot-resume-bd8c0.cloudfunctions.net/chat`
, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, message }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      return { reply: error.message };
    }
  };