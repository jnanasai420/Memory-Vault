// export { email, password };
let formSubmittion = document.querySelector("form");
formSubmittion.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmpassword = document.getElementById("confirm-password").value;
  if (password !== confirmpassword) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Passwords do not match. Please try again.",
    });
    return;
  }

  const userData = {
    name: name,
    email: email,
    password: password,
  };
  localStorage.setItem("userData", JSON.stringify(userData));
  Swal.fire({
    title: "Signup Successful!",
    text: "You have successfully signed up.",
    icon: "success",
    // confirmButtonText: "OK",
    timer: 2000, // 2 seconds timer
    showConfirmButton: false,
  }).then(() => {
    window.location.href = "../Login/login.html"; // Redirect to the login page
  });
});
// export { email, password };
