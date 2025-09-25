require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const morgan = require("morgan");
const { body, validationResult } = require("express-validator");
const axios = require("axios");
const admin = require("firebase-admin");
const path = require("path");

// Init Firebase Admin
const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json";
const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
if (!FIREBASE_API_KEY) {
  console.error("FIREBASE_API_KEY missing in env");
  process.exit(1);
}

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));

// CORS - restrict in production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || true, // set to exact origin in production
};
app.use(cors(corsOptions));

// Rate limiter (adjust as appropriate)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
});
app.use(limiter);

// Helpers
const firebaseSignInUrl = (apiKey) =>
  `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

// --- Register endpoint ---
// Creates a user with firebase-admin, then signs them in via REST to return tokens
app.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 8 }).withMessage("Minimum 8 characters for password"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Server-side password policy: you can extend checks here
      // Create user with admin SDK
      const userRecord = await admin.auth().createUser({
        email,
        password,
        emailVerified: false,
      });

      // Optionally add custom claims or user profile setup here
      // await admin.auth().setCustomUserClaims(userRecord.uid, { accountType: "standard" });

      // Sign the user in via REST to give client an idToken/refreshToken
      const signInResp = await axios.post(firebaseSignInUrl(FIREBASE_API_KEY), {
        email,
        password,
        returnSecureToken: true,
      }, { timeout: 10000 });

      const { idToken, refreshToken, expiresIn, localId } = signInResp.data;

      return res.status(201).json({
        uid: userRecord.uid,
        idToken,
        refreshToken,
        expiresIn,
        localId,
      });
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message || err);
      // Handle Firebase errors more carefully in production
      const message = err.response?.data?.error?.message || err.message || "Server error";
      return res.status(500).json({ error: message });
    }
  }
);

// --- Login endpoint ---
// Uses Firebase REST API to authenticate with email+password and returns tokens
app.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isString().withMessage("Password required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const signInResp = await axios.post(firebaseSignInUrl(FIREBASE_API_KEY), {
        email,
        password,
        returnSecureToken: true,
      }, { timeout: 10000 });

      const { idToken, refreshToken, expiresIn, localId } = signInResp.data;

      return res.json({ idToken, refreshToken, expiresIn, localId });
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message || err);
      const message = err.response?.data?.error?.message || "Invalid credentials";
      return res.status(401).json({ error: message });
    }
  }
);

// --- Verify endpoint ---
// Verifies idToken via admin SDK
app.post("/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing Bearer token" });
    }
    const idToken = authHeader.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(idToken);
    return res.json({ uid: decoded.uid, claims: decoded });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Basic health-check
app.get("/health", (req, res) => res.send({ status: "ok" }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Auth backend listening on port ${port}`);
});
