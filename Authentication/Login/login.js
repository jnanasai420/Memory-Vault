// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmBm7WN6I40QnhZaG5JXDY4tIy3LJModM",
  authDomain: "memory-vault-3a7b3.firebaseapp.com",
  projectId: "memory-vault-3a7b3",
  storageBucket: "memory-vault-3a7b3.appspot.com",
  messagingSenderId: "661679216351",
  appId: "1:661679216351:web:c2dadabe11be040f5fbb6a",
  measurementId: "G-17V21P9ZZJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Error Handling
  if (!email || !password) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Email and password are required.",
    });
    return;
  }

  try {
    // Firebase authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Fetch user data using UID
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      throw new Error("User data not found.");
    }

    const userData = snapshot.val();

    Swal.fire({
      icon: "success",
      title: `Welcome, ${userData.name}!`,
      text: "Login successful.",
    }).then(() => {
      location.href = "../../DashBoard/dashBoard.html"; // Redirect to dashboard
    });
  } catch (error) {
    Swal.fire({ icon: "error", title: "Login Failed", text: error.message });
  }
});
