const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const cors = require("cors")({ origin: true });
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API-Key aus Firebase-Umgebungsvariablen
});
initializeApp();
const db = getFirestore();

exports.chat = onRequest({ region: "europe-west1" }, (req, res) => {
  cors(req, res, async () => {
    try {
      // 1. Request-Validierung
      if (!req.body || !req.body.token) {
        return res.status(400).json({ error: "Token fehlt im Request" });
      }

      const { token, message } = req.body;

      // 2. Firestore-Abfrage mit Error-Handling
      const snapshot = await db.collection("users")
        .where("token", "==", token)
        .limit(1)
        .get({ ignoreUndefinedProperties: true }); // 👈 Kritische Korrektur

      if (snapshot.empty) {
        return res.status(404).json({ error: "Ungültiger Zugangscode" });
      }

      // 3. Datenverarbeitung
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      if (userData.remaining_credits <= 0) {
        return res.status(403).json({ error: "Kontingent erschöpft" });
      }

      // 4. Antwort & Update
      await userDoc.ref.update({
        remaining_credits: FieldValue.increment(-1),
        used_credits: FieldValue.increment(1),
      });

      res.json({ reply: `Antwort auf: ${message}` });

    } catch (error) {
      console.error("KRITISCHER FEHLER:", {
        error: error.message,
        stack: error.stack,
        requestBody: req.body
      });
      res.status(500).json({ error: "Interner Serverfehler" });
    }
  });
});