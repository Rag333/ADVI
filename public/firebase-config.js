// Firebase Client SDK (Frontend)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-hUTLHlfTaC9JqVYgBVvG4vptmj3WmJY",
  authDomain: "advi-cloud-login.firebaseapp.com",
  projectId: "advi-cloud-login",
  storageBucket: "advi-cloud-login.appspot.com",
  messagingSenderId: "980673881448",
  appId: "1:980673881448:web:b24a0925625560258f62dd",
  measurementId: "G-BDT87MJP09",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
