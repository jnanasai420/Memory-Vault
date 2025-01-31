// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
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

document.getElementById("signupButton").addEventListener("click", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirm-password")
    .value.trim();

  // Error Handling
  const errors = {
    name: "Name is required.",
    email: "Enter a valid email.",
    password: "Password must be at least 6 characters.",
    confirmPassword: "Passwords do not match.",
  };

  if (!name) return showError("name-error", errors.name);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return showError("email-error", errors.email);
  if (password.length < 6) return showError("password-error", errors.password);
  if (password !== confirmPassword)
    return showError("confirm-password-error", errors.confirmPassword);

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store user data using UID
    await set(ref(db, `users/${user.uid}`), {
      uid: user.uid,
      name: name,
      email: email,
    });

    Swal.fire({
      icon: "success",
      title: "Registration Successful!",
      text: "Your account has been created.",
    }).then(() => {
      location.href = "../Login/login.html"; // Redirect to login page
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Signup Failed",
      text: error.message,
    });
  }
});

// Function to show error messages
function showError(id, message) {
  document.getElementById(id).textContent = message;
}
