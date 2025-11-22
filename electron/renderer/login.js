// Login page JavaScript logic

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorMessage = document.getElementById("errorMessage");

// Show error message
function showError(message) {
  errorMessage.classList.remove("hidden");
  errorMessage.querySelector("p").textContent = message;
}

// Hide error message
function hideError() {
  errorMessage.classList.add("hidden");
}

// Handle form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Basic validation
  if (!email || !password) {
    showError("Please fill in all fields");
    return;
  }

  // Disable button during login
  loginBtn.disabled = true;
  loginBtn.textContent = "Signing in...";
  loginBtn.classList.add("opacity-75", "cursor-not-allowed");

  try {
    // Call login API
    const result = await window.api.login(email, password);

    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify({
      userId: result.user_id,
      username: result.message.replace("Welcome back, ", "").replace("!", ""),
      email: email
    }));

    // Open dashboard
    window.electron.openDashboard();
    
  } catch (error) {
    console.error("Login error:", error);
    showError(error.message || "Invalid credentials. Please try again.");
    
    // Re-enable button
    loginBtn.disabled = false;
    loginBtn.textContent = "Sign In";
    loginBtn.classList.remove("opacity-75", "cursor-not-allowed");
  }
});

// Clear error on input
emailInput.addEventListener("input", hideError);
passwordInput.addEventListener("input", hideError);
