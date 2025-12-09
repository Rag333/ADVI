const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const path = require("path");

// --- FIX 1: Secure Firebase Initialization ---
// This tries to load the key from the Render Environment Variable first.
// If that fails (like on your local PC), it tries to load the local file.
let serviceAccount;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Production: Read from Environment Variable
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Local Development: Read from file
    serviceAccount = require("./firebase-admin-key.json");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error("Firebase Init Error: Could not load credentials.", error);
}

const app = express();

// Middleware
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to protect dashboard
function protect(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login/niveditha");

  admin
    .auth()
    .verifyIdToken(token)
    .then(() => next())
    .catch(() => res.redirect("/login/niveditha"));
}

// Routes
app.get("/", (req, res) => res.render("index"));
app.get("/login/niveditha", (req, res) => res.render("login/niveditha"));
app.get("/login/pallavi", (req, res) => res.render("login/pallavi"));

app.post("/saveToken", (req, res) => {
  res.cookie("token", req.body.token, { httpOnly: true });
  res.json({ status: true });
});

app.get("/dashboard", protect, (req, res) => res.render("dashboard"));

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// --- FIX 2: Dynamic Port for Deployment ---
// Render gives you a specific port in process.env.PORT. You must use it.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
