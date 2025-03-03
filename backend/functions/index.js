const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true }); // 👈 CORS bleibt

admin.initializeApp();
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG); // 👈 Nur wenn benötigt

exports.chat = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
      try {
        const { token, message } = req.body;
        
        // 1. Budget prüfen
        const userDoc = await admin.firestore().collection("users").doc(token).get();
        if (!userDoc.exists || userDoc.data().remaining_credits <= 0) {
          return res.status(403).json({ error: "Kein Budget oder ungültiger Token" });
        }
  
        // 2. OpenAI-Anfrage (Beispiel)
        const reply = "Testantwort vom Bot"; 
  
        // 3. Budget aktualisieren
        await userDoc.ref.update({
          remaining_credits: admin.firestore.FieldValue.increment(-1),
          used_credits: admin.firestore.FieldValue.increment(1),
        });
  
        res.json({ reply });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  });
  