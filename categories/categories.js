import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
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
const database = getDatabase(app);
const categoriesContainer = document.getElementById("categoriesContainer");

// Create a popup container
const popupContainer = document.createElement("div");
popupContainer.id = "imagePopup";
popupContainer.style.position = "fixed";
popupContainer.style.top = "0";
popupContainer.style.left = "0";
popupContainer.style.width = "100vw";
popupContainer.style.height = "100vh";
popupContainer.style.background = "rgba(0, 0, 0, 0.7)";
popupContainer.style.display = "none";
popupContainer.style.alignItems = "center";
popupContainer.style.justifyContent = "center";
popupContainer.style.zIndex = "1000";
popupContainer.style.backdropFilter = "blur(10px)";
popupContainer.style.flexDirection = "column";
document.body.appendChild(popupContainer);

const popupContent = document.createElement("div");
popupContent.style.background = "white";
popupContent.style.padding = "20px";
popupContent.style.borderRadius = "10px";
popupContent.style.textAlign = "center";
popupContent.style.maxWidth = "80%";
popupContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
popupContainer.appendChild(popupContent);

const popupImage = document.createElement("img");
popupImage.style.width = "500px";
popupImage.style.height = "400px";
popupImage.style.objectFit = "cover";
popupImage.style.borderRadius = "10px";
popupContent.appendChild(popupImage);

const popupDetails = document.createElement("div");
popupDetails.style.color = "black";
popupDetails.style.textAlign = "center";
popupDetails.style.marginTop = "20px";
popupContent.appendChild(popupDetails);

const closeButton = document.createElement("button");
closeButton.textContent = "← Back";
closeButton.style.marginTop = "10px";
closeButton.style.padding = "10px 20px";
closeButton.style.fontSize = "16px";
closeButton.style.color = "white";
closeButton.style.background = "#333";
closeButton.style.border = "none";
closeButton.style.cursor = "pointer";
closeButton.style.borderRadius = "5px";
closeButton.onclick = () => {
  popupContainer.style.display = "none";
};
popupContent.appendChild(closeButton);

// Fetch and display memories
const fetchMemories = async (userId) => {
  const userMemoriesRef = ref(database, `users/${userId}/memories`);

  try {
    const snapshot = await get(userMemoriesRef);
    if (!snapshot.exists()) {
      categoriesContainer.innerHTML =
        "<p class='text-center'>No memories found. Please upload memories.</p>";
      return;
    }

    const memories = snapshot.val();
    let categories = {};

    // Group memories by category
    Object.values(memories).forEach((memory) => {
      if (!categories[memory.category]) {
        categories[memory.category] = [];
      }
      categories[memory.category].push(memory);
    });

    // Display categories
    categoriesContainer.innerHTML = "";
    for (const category in categories) {
      const categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category-section");

      const categoryTitle = document.createElement("h2");
      categoryTitle.textContent = category;
      categoryTitle.classList.add("category-title");

      const memoryRow = document.createElement("div");
      memoryRow.classList.add("row");

      categories[category].forEach((memory) => {
        const memoryCard = document.createElement("div");
        memoryCard.classList.add("col-md-4", "mb-4");

        memoryCard.innerHTML = `
          <div class="card shadow-sm">
              <img src="${memory.imageUrl}" class="card-img-top memory-image" alt="${memory.memoryName}" style="cursor: pointer;">
              <div class="card-body">
                  <h5 class="card-title">${memory.memoryName}</h5>
                  <p class="text-muted">${memory.date}</p>
                  <p class="card-text">${memory.description}</p>
              </div>
          </div>
        `;

        // Add click event to open the image in popup
        memoryCard
          .querySelector(".memory-image")
          .addEventListener("click", () => {
            popupImage.src = memory.imageUrl;
            popupDetails.innerHTML = `<h2>${memory.memoryName}</h2><p>${memory.description}</p><p><em>${memory.date}</em></p>`;
            popupContainer.style.display = "flex";
          });

        memoryRow.appendChild(memoryCard);
      });

      categoryDiv.appendChild(categoryTitle);
      categoryDiv.appendChild(memoryRow);
      categoriesContainer.appendChild(categoryDiv);
    }
  } catch (error) {
    console.error("Error fetching memories:", error);
    Swal.fire("Error", "Could not fetch memories. Please try again.", "error");
  }
};

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchMemories(user.uid);
  } else {
    Swal.fire("Error", "You must be logged in to view your memories.", "error");
  }
});
