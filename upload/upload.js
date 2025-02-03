import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  push,
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
const database = getDatabase(app);

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = "dc9ntbjnj";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

// Upload Image to Cloudinary
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

// Upload Memory Function
const uploadMemory = async () => {
  let user = auth.currentUser;

  if (!user) {
    Swal.fire("Error", "You must be logged in to upload.", "error");
    return;
  }

  let categoryName = document.getElementById("categoryName").value.trim();
  let memoryName = document.getElementById("memoryName").value.trim();
  let memoryDate = document.getElementById("memoryDate").value;
  let memoryDescription = document
    .getElementById("memoryDescription")
    .value.trim();
  let fileInput = document.getElementById("imageUpload");
  let file = fileInput.files[0];

  if (
    !categoryName ||
    !memoryName ||
    !memoryDate ||
    !memoryDescription ||
    !file
  ) {
    Swal.fire("Error", "Please fill all fields and select an image.", "error");
    return;
  }

  // Check if file is an image
  if (!file.type.startsWith("image/")) {
    Swal.fire("Error", "Please select a valid image file.", "error");
    return;
  }

  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    Swal.fire(
      "Error",
      "File is too large. Please select an image under 5MB.",
      "error"
    );
    return;
  }

  // Upload image to Cloudinary
  let imageUrl = await uploadToCloudinary(file);

  if (!imageUrl) {
    Swal.fire("Error", "Image upload failed. Please try again.", "error");
    return;
  }

  // Store Memory Details in Firebase under authenticated user
  let userMemoryRef = push(ref(database, `users/${user.uid}/memories`));
  try {
    await set(userMemoryRef, {
      category: categoryName,
      memoryName: memoryName,
      date: memoryDate,
      description: memoryDescription,
      imageUrl: imageUrl,
    });
    Swal.fire("Success", "Memory uploaded successfully!", "success");
  } catch (error) {
    console.error("Firebase Error:", error);
    Swal.fire(
      "Error",
      "There was an error saving your memory. Please try again.",
      "error"
    );
  }

  // Clear the form after submission
  document.getElementById("categoryName").value = "";
  document.getElementById("memoryName").value = "";
  document.getElementById("memoryDate").value = "";
  document.getElementById("memoryDescription").value = "";
  document.getElementById("imageUpload").value = "";
  document.getElementById("previewImage").classList.add("d-none");
};

// Attach event listener to upload button
document.getElementById("uploadButton").addEventListener("click", uploadMemory);

// Handle image preview
document
  .getElementById("imageUpload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const previewImage = document.getElementById("previewImage");

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.classList.remove("d-none");
      };
      reader.readAsDataURL(file);
    }
  });

// Check if User is Logged In
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.uid); // Debugging log
  } else {
    console.log("No user logged in."); // Debugging log
  }
});
