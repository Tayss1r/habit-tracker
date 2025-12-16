// Registration page JavaScript logic

const registerForm = document.getElementById("registerForm");
const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const profileImageInput = document.getElementById("profileImage");
const previewImage = document.getElementById("previewImage");
const registerBtn = document.getElementById("registerBtn");
const message = document.getElementById("message");

// Avatar carousel handling
const avatars = [
  'user-1.jpg', 'user-2.jpg', 'user-3.jpg', 'user-4.jpg', 'user-5.jpg', 'user-6.jpg',
  'user-7.jpg', 'user-8.jpg', 'user-9.jpg', 'user-10.jpg', 'user-11.jpg'
];

let currentAvatarIndex = 0;

const prevBtn = document.getElementById("prevAvatar");
const nextBtn = document.getElementById("nextAvatar");
const avatarCounter = document.getElementById("avatarCounter");
const dotsContainer = document.getElementById("dotsContainer");

// Create dots
avatars.forEach((_, index) => {
  const dot = document.createElement("div");
  dot.className = `dot ${index === 0 ? 'active' : ''}`;
  dot.addEventListener("click", () => goToAvatar(index));
  dotsContainer.appendChild(dot);
});

function updateAvatar(direction) {
  const avatar = avatars[currentAvatarIndex];
  previewImage.src = `../assets/figures/${avatar}`;
  profileImageInput.value = avatar;
  avatarCounter.textContent = `${currentAvatarIndex + 1}/${avatars.length}`;
  
  // Update dots
  const dots = dotsContainer.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentAvatarIndex);
  });
  
  // Add slide animation
  previewImage.classList.remove('slide-left', 'slide-right');
  void previewImage.offsetWidth; // Trigger reflow
  previewImage.classList.add(direction === 'next' ? 'slide-right' : 'slide-left');
}

function goToAvatar(index) {
  const direction = index > currentAvatarIndex ? 'next' : 'prev';
  currentAvatarIndex = index;
  updateAvatar(direction);
}

prevBtn.addEventListener("click", () => {
  currentAvatarIndex = (currentAvatarIndex - 1 + avatars.length) % avatars.length;
  updateAvatar('prev');
});

nextBtn.addEventListener("click", () => {
  currentAvatarIndex = (currentAvatarIndex + 1) % avatars.length;
  updateAvatar('next');
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    prevBtn.click();
  } else if (e.key === "ArrowRight") {
    nextBtn.click();
  }
});

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
  const confirmPassword = confirmPasswordInput.value.trim();
  const profileImage = profileImageInput.value;

  // Basic validation
  if (!email || !username || !password || !confirmPassword) {
    showMessage("Please fill in all fields", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters", "error");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match", "error");
    return;
  }

  // Disable button during registration
  registerBtn.disabled = true;
  registerBtn.textContent = "Creating account...";
  registerBtn.classList.add("opacity-75", "cursor-not-allowed");

  try {
    const result = await window.api.register(email, username, password, profileImage);
    
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
confirmPasswordInput.addEventListener("input", hideMessage);
