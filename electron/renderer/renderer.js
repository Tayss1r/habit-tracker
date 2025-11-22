// Registration page JavaScript logic

const registerForm = document.getElementById("registerForm");
const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("registerBtn");
const message = document.getElementById("message");

// Show message
function showMessage(text, type = "error") {
  message.classList.remove("hidden", "bg-red-50", "border-red-500", "bg-green-50", "border-green-500");
  message.querySelector("p").classList.remove("text-red-700", "text-green-700");
  
  if (type === "success") {
    message.classList.add("bg-green-50", "border-l-4", "border-green-500");
    message.querySelector("p").classList.add("text-green-700");
  } else {
    message.classList.add("bg-red-50", "border-l-4", "border-red-500");
    message.querySelector("p").classList.add("text-red-700");
  }
  
  message.querySelector("p").textContent = text;
}

// Hide message
function hideMessage() {
  message.classList.add("hidden");
}

// Handle form submission
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const email = emailInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Basic validation
  if (!email || !username || !password) {
    showMessage("Please fill in all fields", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters", "error");
    return;
  }

  // Disable button during registration
  registerBtn.disabled = true;
  registerBtn.textContent = "Creating account...";
  registerBtn.classList.add("opacity-75", "cursor-not-allowed");

  try {
    const result = await window.api.register(email, username, password);
    
    showMessage(result.message || "Account created successfully! Redirecting to login...", "success");
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
    
  } catch (error) {
    console.error("Registration error:", error);
    showMessage(error.message || "Registration failed. Please try again.", "error");
    
    // Re-enable button
    registerBtn.disabled = false;
    registerBtn.textContent = "Create Account";
    registerBtn.classList.remove("opacity-75", "cursor-not-allowed");
  }
});

// Clear message on input
emailInput.addEventListener("input", hideMessage);
usernameInput.addEventListener("input", hideMessage);
passwordInput.addEventListener("input", hideMessage);
