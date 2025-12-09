const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const path = require("path");

admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-admin-key.json")),
});

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cookieParser());
("");
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

app.listen(3000, () => console.log("Server running at http://localhost:5000"));
