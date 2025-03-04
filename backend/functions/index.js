const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const cors = require("cors")({ origin: true });
const OpenAI = require("openai");
const functions = require("firebase-functions");
const express = require("express");

// 1. Express & Port-Konfiguration
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

// 2. Firebase Initialisierung (MUSS zuerst kommen!)
initializeApp();
const db = getFirestore();

// 3. OpenAI-Konfiguration mit validierung
const openaiConfig = functions.config().openai;
if (!openaiConfig?.api_key) {
  throw new Error("❌ Fehler: OpenAI-Key fehlt! Führen Sie aus:\nfirebase functions:config:set openai.api_key=IHRSCHLÜSSEL");
}

const openai = new OpenAI({
  apiKey: openaiConfig.api_key,
  timeout: 30000, // 30s Timeout
});

// 4. CORS Middleware (erweitert)
app.use((req, res, next) => {
  cors(req, res, () => {});
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// 5. Pflicht-Endpoints für Cloud Run
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.redirect(301, "/health");
});

// 6. Haupt-API-Logik
app.post("/", async (req, res) => {
  try {
    // 6.1 Request Validation
    if (!req.body?.token || !req.body?.message) {
      return res.status(400).json({
        error: "Ungültige Anfrage",
        details: "Token und Nachricht müssen vorhanden sein"
      });
    }

    const { token, message } = req.body;

    // 6.2 Firestore Query
    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("token", "==", token)
      .limit(1)
      .get({ ignoreUndefinedProperties: true });

    if (snapshot.empty) {
      return res.status(404).json({ error: "Ungültiger Zugangscode" });
    }

    // 6.3 User Data Check
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    
    if (userData.remaining_credits <= 0) {
      return res.status(402).json({ 
        error: "Kontingent erschöpft",
        solution: "Kontaktieren Sie den Support"
      });
    }

    // 6.4 Update Credits
    await userDoc.ref.update({
      remaining_credits: FieldValue.increment(-1),
      used_credits: FieldValue.increment(1),
      last_used: FieldValue.serverTimestamp()
    });

    // 6.5 OpenAI-Request
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Sie sind ein professioneller KI-Assistent für Bewerbungsunterlagen. Antworten Sie immer auf Deutsch und maximal 3 Sätze."
        },
        { 
          role: "user", 
          content: message 
        }
      ],
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    // 6.6 Response
    res.json({
      reply: completion.choices[0].message.content,
      remaining: userData.remaining_credits - 1
    });

  } catch (error) {
    console.error("🔥 KRITISCHER FEHLER:", {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    
    res.status(500).json({
      error: "Serverfehler",
      code: "API_ERR_001",
      ...(process.env.NODE_ENV !== "production" && {
        debug: error.message,
        stack: error.stack
      })
    });
  }
});

// 7. Port-Bindung für Emulator
if (process.env.FUNCTIONS_EMULATOR === "true") {
  app.listen(PORT, () => {
    console.log(`🚀 Emulator läuft auf http://localhost:${PORT}`);
  });
}

// 8. Firebase Cloud Run Export
exports.chat = onRequest(
  {
    region: "europe-west1",
    memory: "1GB",
    timeoutSeconds: 60,
    minInstances: 0,
    maxInstances: 5,
    concurrency: 80,
    port: PORT // KRITISCH: Muss explizit gesetzt werden
  },
  app
);