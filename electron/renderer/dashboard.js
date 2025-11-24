// Dashboard page JavaScript logic

let currentUser = null;
let habits = [];
let habitStatuses = {};

// DOM Elements
const navUsername = document.getElementById("navUsername");
const navProfileImage = document.getElementById("navProfileImage");
const profileBtn = document.getElementById("profileBtn");
const logoutBtn = document.getElementById("logoutBtn");
const habitsContainer = document.getElementById("habitsContainer");
const emptyState = document.getElementById("emptyState");
const addHabitBtn = document.getElementById("addHabitBtn");
const addHabitModal = document.getElementById("addHabitModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const addHabitForm = document.getElementById("addHabitForm");
const editHabitModal = document.getElementById("editHabitModal");
const closeEditModalBtn = document.getElementById("closeEditModalBtn");
const editHabitForm = document.getElementById("editHabitForm");
const deleteHabitBtn = document.getElementById("deleteHabitBtn");
const totalHabitsEl = document.getElementById("totalHabits");
const completedTodayEl = document.getElementById("completedToday");
const completionRateEl = document.getElementById("completionRate");
const profileModal = document.getElementById("profileModal");
const closeProfileModal = document.getElementById("closeProfileModal");
const profileForm = document.getElementById("profileForm");
const profileImagePreview = document.getElementById("profileImagePreview");
const profileImageSelect = document.getElementById("profileImageSelect");
const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const profilePassword = document.getElementById("profilePassword");
const profileMessage = document.getElementById("profileMessage");

// Category colors and icons
const categoryStyles = {
  Health: { 
    bg: "from-green-400 to-emerald-500", 
    icon: '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>'
  },
  Fitness: { 
    bg: "from-orange-400 to-red-500", 
    icon: '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>'
  },
  Study: { 
    bg: "from-blue-400 to-indigo-500", 
    icon: '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path></svg>'
  },
  Work: { 
    bg: "from-purple-400 to-pink-500", 
    icon: '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path></svg>'
  },
  Personal: { 
    bg: "from-yellow-400 to-orange-500", 
    icon: '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>'
  },
  Finance: { 
    bg: "from-green-400 to-teal-500", 
    icon: '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
  },
  Social: { 
    bg: "from-pink-400 to-rose-500", 
    icon: '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>'
  }
};

// Priority colors
const priorityColors = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-green-100 text-green-700 border-green-200"
};

// Initialize dashboard
async function initDashboard() {
  // Get user from localStorage
  const userData = localStorage.getItem("user");
  if (!userData) {
    console.error("No user data found");
    window.electron.logout();
    return;
  }

  currentUser = JSON.parse(userData);
  navUsername.textContent = currentUser.username;
  
  // Set profile image if available
  if (currentUser.profileImage) {
    navProfileImage.src = `../assets/figures/${currentUser.profileImage}`;
  }

  // Load habits
  await loadHabits();
}

// Load all habits
async function loadHabits() {
  try {
    habits = await window.api.getHabits(currentUser.userId);
    
    // Load status for each habit
    for (const habit of habits) {
      const habitId = habit.id || habit._id;
      if (habitId) {
        const status = await window.api.getHabitStatus(habitId);
        habitStatuses[habitId] = status.done_today;
      }
    }

    renderHabits();
    updateStats();
  } catch (error) {
    console.error("Error loading habits:", error);
    showNotification("Failed to load habits", "error");
  }
}

// Render habits grid
function renderHabits() {
  if (habits.length === 0) {
    habitsContainer.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  habitsContainer.classList.remove("hidden");
  emptyState.classList.add("hidden");
  habitsContainer.innerHTML = "";

  habits.forEach((habit, index) => {
    const habitId = habit.id || habit._id;
    const isDone = habitStatuses[habitId] || false;
    const style = categoryStyles[habit.category] || categoryStyles.Personal;
    const priorityClass = priorityColors[habit.priority] || priorityColors.Medium;

    const habitCard = document.createElement("div");
    habitCard.className = "habit-card bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 border border-gray-100 animate-fadeIn";
    habitCard.style.animationDelay = `${index * 0.1}s`;

    habitCard.innerHTML = `
      <!-- Category Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div class="bg-gradient-to-br ${style.bg} rounded-xl p-3 shadow-lg">
            <span class="text-2xl">${style.icon}</span>
          </div>
          <div>
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">${habit.category}</span>
          </div>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-semibold border ${priorityClass}">
          ${habit.priority}
        </span>
      </div>

      <!-- Habit Title & Description -->
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-xl font-bold text-gray-800 flex-1">${habit.title}</h3>
        <button 
          class="edit-habit-btn text-gray-400 hover:text-purple-600 transition-colors ml-2"
          data-habit='${JSON.stringify(habit).replace(/'/g, "&#39;")}'
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
      </div>
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        ${habit.description || "No description provided"}
      </p>

      <!-- Status & Action -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        ${isDone 
          ? `<div class="flex items-center space-x-2 text-green-600">
               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                 <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
               </svg>
               <span class="text-sm font-semibold">Completed Today!</span>
             </div>`
          : `<button 
               class="mark-done-btn flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
               data-habit-id="${habitId}"
             >
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
               </svg>
               <span class="font-semibold">Mark as Done</span>
             </button>`
        }
      </div>
    `;

    habitsContainer.appendChild(habitCard);
  });

  // Add event listeners to mark done buttons
  document.querySelectorAll(".mark-done-btn").forEach(btn => {
    btn.addEventListener("click", handleMarkDone);
  });

  // Add event listeners to edit buttons
  document.querySelectorAll(".edit-habit-btn").forEach(btn => {
    btn.addEventListener("click", handleEditClick);
  });
}

// Handle marking habit as done
async function handleMarkDone(e) {
  const btn = e.currentTarget;
  const habitId = btn.dataset.habitId;

  // Disable button
  btn.disabled = true;
  btn.classList.add("opacity-50", "cursor-not-allowed");
  btn.innerHTML = '<span>Marking...</span>';

  try {
    await window.api.markHabitDone(habitId, currentUser.userId);
    habitStatuses[habitId] = true;
    
    showNotification("Habit marked as complete!", "success");
    renderHabits();
    updateStats();
  } catch (error) {
    console.error("Error marking habit as done:", error);
    showNotification("Failed to mark habit as done", "error");
    btn.disabled = false;
    btn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

// Update statistics
function updateStats() {
  const total = habits.length;
  const completed = Object.values(habitStatuses).filter(status => status).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  totalHabitsEl.textContent = total;
  completedTodayEl.textContent = completed;
  completionRateEl.textContent = `${rate}%`;
}

// Show notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl text-white font-semibold transform transition-all duration-300 animate-fadeIn ${
    type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-500" : 
    type === "error" ? "bg-gradient-to-r from-red-500 to-pink-500" : 
    "bg-gradient-to-r from-blue-500 to-indigo-500"
  }`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Handle add habit modal
addHabitBtn.addEventListener("click", () => {
  addHabitModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  addHabitModal.classList.add("hidden");
  addHabitForm.reset();
});

// Close modal on background click
addHabitModal.addEventListener("click", (e) => {
  if (e.target === addHabitModal) {
    addHabitModal.classList.add("hidden");
    addHabitForm.reset();
  }
});

// Handle add habit form submission
addHabitForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const habitData = {
    user_id: currentUser.userId,
    title: document.getElementById("habitTitle").value.trim(),
    category: document.getElementById("habitCategory").value,
    priority: document.getElementById("habitPriority").value,
    description: document.getElementById("habitDescription").value.trim() || null
  };

  try {
    await window.api.createHabit(habitData);
    showNotification("Habit created successfully!", "success");
    addHabitModal.classList.add("hidden");
    addHabitForm.reset();
    await loadHabits();
  } catch (error) {
    console.error("Error creating habit:", error);
    showNotification("Failed to create habit", "error");
  }
});

// Handle edit habit click
function handleEditClick(e) {
  const habitData = JSON.parse(e.currentTarget.dataset.habit);
  const habitId = habitData.id || habitData._id;
  
  // Populate edit form
  document.getElementById("editHabitId").value = habitId;
  document.getElementById("editHabitTitle").value = habitData.title;
  document.getElementById("editHabitCategory").value = habitData.category || "Personal";
  document.getElementById("editHabitPriority").value = habitData.priority || "Medium";
  document.getElementById("editHabitDescription").value = habitData.description || "";
  
  // Show modal
  editHabitModal.classList.remove("hidden");
}

// Handle edit habit modal
closeEditModalBtn.addEventListener("click", () => {
  editHabitModal.classList.add("hidden");
  editHabitForm.reset();
});

// Close edit modal on background click
editHabitModal.addEventListener("click", (e) => {
  if (e.target === editHabitModal) {
    editHabitModal.classList.add("hidden");
    editHabitForm.reset();
  }
});

// Handle edit habit form submission
editHabitForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const habitId = document.getElementById("editHabitId").value;
  const habitData = {
    user_id: currentUser.userId,
    title: document.getElementById("editHabitTitle").value.trim(),
    category: document.getElementById("editHabitCategory").value,
    priority: document.getElementById("editHabitPriority").value,
    description: document.getElementById("editHabitDescription").value.trim() || null
  };

  try {
    await window.api.updateHabit(habitId, habitData);
    showNotification("Habit updated successfully!", "success");
    editHabitModal.classList.add("hidden");
    editHabitForm.reset();
    await loadHabits();
  } catch (error) {
    console.error("Error updating habit:", error);
    showNotification("Failed to update habit", "error");
  }
});

// Handle delete habit
deleteHabitBtn.addEventListener("click", async () => {
  const habitId = document.getElementById("editHabitId").value;
  
  if (!confirm("Are you sure you want to delete this habit?")) {
    return;
  }

  try {
    await window.api.deleteHabit(habitId);
    showNotification("Habit deleted successfully!", "success");
    editHabitModal.classList.add("hidden");
    editHabitForm.reset();
    await loadHabits();
  } catch (error) {
    console.error("Error deleting habit:", error);
    showNotification("Failed to delete habit", "error");
  }
});

// Handle logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.electron.logout();
});

// Profile Modal Handlers
profileBtn.addEventListener("click", async () => {
  try {
    const user = await window.api.getUser(currentUser.userId);
    
    // Populate form with current user data
    profileUsername.value = user.username;
    profileEmail.value = user.email;
    profileImageSelect.value = user.profile_image || "user-2.jpg";
    profileImagePreview.src = `../assets/figures/${user.profile_image || "user-2.jpg"}`;
    profilePassword.value = "";
    
    profileModal.classList.remove("hidden");
  } catch (error) {
    console.error("Error loading profile:", error);
    showNotification("Failed to load profile", "error");
  }
});

closeProfileModal.addEventListener("click", () => {
  profileModal.classList.add("hidden");
  hideProfileMessage();
});

profileModal.addEventListener("click", (e) => {
  if (e.target === profileModal) {
    profileModal.classList.add("hidden");
    hideProfileMessage();
  }
});

// Update profile image preview
profileImageSelect.addEventListener("change", (e) => {
  profileImagePreview.src = `../assets/figures/${e.target.value}`;
});

// Handle profile form submission
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideProfileMessage();

  const updateData = {
    username: profileUsername.value.trim(),
    email: profileEmail.value.trim(),
    profile_image: profileImageSelect.value
  };

  // Only include password if it's not empty
  const password = profilePassword.value.trim();
  if (password) {
    if (password.length < 6) {
      showProfileMessage("Password must be at least 6 characters", "error");
      return;
    }
    updateData.password = password;
  }

  try {
    const updatedUser = await window.api.updateUser(currentUser.userId, updateData);
    
    // Update localStorage and UI
    currentUser.username = updatedUser.username;
    currentUser.email = updatedUser.email;
    currentUser.profileImage = updatedUser.profile_image;
    localStorage.setItem("user", JSON.stringify(currentUser));
    
    navUsername.textContent = updatedUser.username;
    navProfileImage.src = `../assets/figures/${updatedUser.profile_image}`;
    
    showProfileMessage("Profile updated successfully!", "success");
    setTimeout(() => {
      profileModal.classList.add("hidden");
      hideProfileMessage();
    }, 1500);
  } catch (error) {
    console.error("Error updating profile:", error);
    showProfileMessage(error.message || "Failed to update profile", "error");
  }
});

function showProfileMessage(text, type = "error") {
  profileMessage.classList.remove("hidden", "bg-red-50", "border-red-500", "bg-green-50", "border-green-500");
  profileMessage.querySelector("p").classList.remove("text-red-700", "text-green-700");
  
  if (type === "success") {
    profileMessage.classList.add("bg-green-50", "border-l-4", "border-green-500");
    profileMessage.querySelector("p").classList.add("text-green-700");
  } else {
    profileMessage.classList.add("bg-red-50", "border-l-4", "border-red-500");
    profileMessage.querySelector("p").classList.add("text-red-700");
  }
  
  profileMessage.querySelector("p").textContent = text;
}

function hideProfileMessage() {
  profileMessage.classList.add("hidden");
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initDashboard);
