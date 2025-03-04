const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const cors = require("cors")({ origin: true });
const OpenAI = require("openai");
const functions = require("firebase-functions");
const express = require("express");

// 1. Port & Express-Konfiguration
const PORT = 8080; // Absolute Festlegung
const app = express();
app.use(express.json());

// 2. Firebase Initialisierung
initializeApp();
const db = getFirestore();

// 3. OpenAI-Config
const openaiConfig = functions.config().openai;
if (!openaiConfig?.api_key) {
  throw new Error("OpenAI-Key fehlt! Befehl: firebase functions:config:set openai.api_key=DEIN_KEY");
}

const openai = new OpenAI({
  apiKey: openaiConfig.api_key,
  timeout: 240000 // 240s Timeout
});

// 4. CORS Handling
app.use((req, res, next) => {
  cors(req, res, next);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
});

// 5. Pflicht-Endpoints
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    port: PORT,
    service: "chatbot-resume"
  });
});

// 6. Hauptlogik (unverändert)
app.post("/", async (req, res) => {
  try {
    // [Ihre bestehende Logik]
  } catch (error) {
    // [Error Handling]
  }
});

// 7. Port-Bindung für alle Umgebungen
app.listen(PORT, () => {
  console.log(`Service gebunden an Port ${PORT}`);
});

// 8. Firebase Export
exports.chat = onRequest(
  {
    region: "europe-west1",
    memory: "1GB",
    timeoutSeconds: 240, // 👈 Ihr gewünschtes 240s Timeout
    port: PORT,
    minInstances: 0
  },
  app
);