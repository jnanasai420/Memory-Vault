// Toggle Sidebar
function toggleMenu() {
  document.getElementById("sidebar").classList.toggle("open");
}

// Close Sidebar
function closeMenu() {
  document.getElementById("sidebar").classList.remove("open");
}

let home = document.getElementById("home");
home.addEventListener("click", (e) => {
  location.href = "./dashBoard.html";
});

let upload = document.getElementById("upload");
upload.addEventListener("click", (e) => {
  location.href = "../upload/upload.html";
});

let addkeepsake = document.getElementById("addkeepsake");
addkeepsake.addEventListener("click", (e) => {
  location.href = "../upload/upload.html";
});
let Categories = document.getElementById("categories");
Categories.addEventListener("click", (e) => {
  location.href = "../categories/categories.html";
});
let about = document.getElementById("about");
about.addEventListener("click", (e) => {
  location.href = "../About/about.html";
});
