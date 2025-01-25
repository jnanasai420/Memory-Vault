// Select the form element
let formSubmittion = document.querySelector("form");

// Add a 'submit' event listener to the form
formSubmittion.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get email and password values entered by the user
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Fetch stored user data from localStorage
  const userData = localStorage.getItem("userData");

  // Check if user data exists in localStorage
  if (!userData) {
    Swal.fire({
      icon: "error",
      title: "User not found",
      text: "No user data found in local storage. Please sign up first.",
    });
    return;
  }

  // Parse the stored user data
  const usergetData = JSON.parse(userData);

  // Validate that email and password exist in the stored data
  if (usergetData.email && usergetData.password) {
    // Compare input credentials with stored credentials
    if (
      email.toLowerCase() === usergetData.email.toLowerCase() &&
      password === usergetData.password
    ) {
      // Success: Show a success message and redirect
      Swal.fire({
        title: "Login Successful!",
        text: "You have successfully logged in.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "../../DashBoard/dashBoard.html"; // Redirect to the dashboard
      });
    } else {
      // Error: Incorrect email or password
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Either Email or Password is Incorrect. Please try again.",
      });
    }
  } else {
    // Error: Stored data is invalid or incomplete
    Swal.fire({
      icon: "error",
      title: "User data invalid",
      text: "Stored user data is incomplete or corrupt. Please sign up again.",
    });
  }
});
