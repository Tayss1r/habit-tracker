// Admin Dashboard JavaScript

let currentAdmin = null;
let charts = {};

// DOM Elements
const navUsername = document.getElementById("navUsername");
const logoutBtn = document.getElementById("logoutBtn");
const refreshUsersBtn = document.getElementById("refreshUsersBtn");
const usersTableBody = document.getElementById("usersTableBody");
const statsTab = document.getElementById("statsTab");
const usersTab = document.getElementById("usersTab");
const statsContent = document.getElementById("statsContent");
const usersContent = document.getElementById("usersContent");

// Stat elements
const totalUsersEl = document.getElementById("totalUsers");
const activeUsersEl = document.getElementById("activeUsers");
const totalHabitsEl = document.getElementById("totalHabits");
const totalCompletionsEl = document.getElementById("totalCompletions");
const recentCompletionsEl = document.getElementById("recentCompletions");

// Initialize admin dashboard
async function initAdminDashboard() {
  // Get admin from localStorage
  const userData = localStorage.getItem("user");
  if (!userData) {
    console.error("No user data found");
    window.electron.logout();
    return;
  }

  currentAdmin = JSON.parse(userData);
  
  if (!currentAdmin.isAdmin) {
    alert("Access denied. Admin privileges required.");
    window.electron.logout();
    return;
  }

  navUsername.textContent = currentAdmin.username;

  // Load all data
  await loadStatistics();
  await loadCharts();
  await loadUsers();
}

// Load overview statistics
async function loadStatistics() {
  try {
    const stats = await window.api.getOverviewStatistics(currentAdmin.userId);
    
    totalUsersEl.textContent = stats.total_users;
    activeUsersEl.textContent = stats.active_users;
    totalHabitsEl.textContent = stats.total_habits;
    totalCompletionsEl.textContent = stats.total_completions;
    recentCompletionsEl.textContent = stats.recent_completions;

    // Animate numbers
    animateValue(totalUsersEl, 0, stats.total_users, 1000);
    animateValue(activeUsersEl, 0, stats.active_users, 1000);
    animateValue(totalHabitsEl, 0, stats.total_habits, 1000);
    animateValue(totalCompletionsEl, 0, stats.total_completions, 1000);
    animateValue(recentCompletionsEl, 0, stats.recent_completions, 1000);
    
  } catch (error) {
    console.error("Error loading statistics:", error);
    showNotification("Failed to load statistics", "error");
  }
}

// Animate number counting
function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      element.textContent = Math.round(end);
      clearInterval(timer);
    } else {
      element.textContent = Math.round(current);
    }
  }, 16);
}

// Load and create charts
async function loadCharts() {
  try {
    // Category Chart
    const categoryData = await window.api.getHabitsByCategory(currentAdmin.userId);
    createCategoryChart(categoryData);

    // Radar Chart (instead of Priority Chart)
    const priorityData = await window.api.getHabitsByPriority(currentAdmin.userId);
    createRadarChart(categoryData, priorityData);

    // Trend Chart
    const trendData = await window.api.getCompletionTrend(currentAdmin.userId, 30);
    createTrendChart(trendData);

    // Activity Chart
    const activityData = await window.api.getUserActivity(currentAdmin.userId);
    createActivityChart(activityData);

    // New Users Chart
    const newUsersData = await window.api.getNewUsers(currentAdmin.userId, 30);
    createNewUsersChart(newUsersData);

  } catch (error) {
    console.error("Error loading charts:", error);
    showNotification("Failed to load charts", "error");
  }
}

// Create category chart
function createCategoryChart(data) {
  const ctx = document.getElementById("categoryChart");
  
  if (charts.category) {
    charts.category.destroy();
  }

  charts.category = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.category),
      datasets: [{
        data: data.map(d => d.count),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(244, 63, 94, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        }
      }
    }
  });
}

// Create radar chart
function createRadarChart(categoryData, priorityData) {
  const ctx = document.getElementById("radarChart");
  
  if (charts.radar) {
    charts.radar.destroy();
  }

  charts.radar = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: categoryData.map(d => d.category),
      datasets: [{
        label: 'Habit Count',
        data: categoryData.map(d => d.count),
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            precision: 0
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Create trend chart
function createTrendChart(data) {
  const ctx = document.getElementById("trendChart");
  
  if (charts.trend) {
    charts.trend.destroy();
  }

  charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Completions',
        data: data.map(d => d.completions),
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Create activity chart
function createActivityChart(data) {
  const ctx = document.getElementById("activityChart");
  
  if (charts.activity) {
    charts.activity.destroy();
  }

  charts.activity = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.username),
      datasets: [{
        label: 'Completions',
        data: data.map(d => d.completions),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Create new users chart
function createNewUsersChart(data) {
  const ctx = document.getElementById("newUsersChart");
  
  if (charts.newUsers) {
    charts.newUsers.destroy();
  }

  charts.newUsers = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'New Users',
        data: data.map(d => d.new_users),
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Load users table
async function loadUsers() {
  try {
    const users = await window.api.getAllUsers(currentAdmin.userId);
    renderUsersTable(users);
  } catch (error) {
    console.error("Error loading users:", error);
    showNotification("Failed to load users", "error");
  }
}

// Render users table
function renderUsersTable(users) {
  usersTableBody.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50 transition-colors";
    
    const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });

    const profileImage = user.profile_image || 'user-2.jpg';
    
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        <img src="../assets/figures/${profileImage}" alt="${user.username}" class="h-12 w-12 rounded-full border-2 border-purple-300 object-cover">
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">${user.username}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${user.email}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.is_admin 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }">
          ${user.is_admin ? 'Admin' : 'User'}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${joinDate}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        ${!user.is_admin ? `
          <button 
            class="delete-user-btn text-red-600 hover:text-red-900 transition-colors"
            data-user-id="${user.id}"
            data-username="${user.username}"
          >
            Delete
          </button>
        ` : '<span class="text-gray-400">Protected</span>'}
      </td>
    `;

    usersTableBody.appendChild(row);
  });

  // Add event listeners to delete buttons
  document.querySelectorAll(".delete-user-btn").forEach(btn => {
    btn.addEventListener("click", handleDeleteUser);
  });
}

// Handle delete user
async function handleDeleteUser(e) {
  const userId = e.target.dataset.userId;
  const username = e.target.dataset.username;

  if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
    return;
  }

  try {
    await window.api.deleteUser(userId, currentAdmin.userId);
    showNotification(`User "${username}" deleted successfully`, "success");
    await loadUsers();
    await loadStatistics();
  } catch (error) {
    console.error("Error deleting user:", error);
    showNotification("Failed to delete user", "error");
  }
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

// Handle refresh users
refreshUsersBtn.addEventListener("click", async () => {
  await loadUsers();
  await loadStatistics();
  await loadCharts();
  showNotification("Data refreshed successfully", "success");
});

// Handle logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.electron.logout();
});

// Tab switching
statsTab.addEventListener("click", () => {
  // Update tab buttons
  statsTab.classList.add("bg-gradient-to-r", "from-red-600", "to-pink-600", "text-white");
  statsTab.classList.remove("text-gray-600", "hover:bg-gray-100");
  usersTab.classList.remove("bg-gradient-to-r", "from-red-600", "to-pink-600", "text-white");
  usersTab.classList.add("text-gray-600", "hover:bg-gray-100");
  
  // Update content
  statsContent.classList.remove("hidden");
  usersContent.classList.add("hidden");
});

usersTab.addEventListener("click", () => {
  // Update tab buttons
  usersTab.classList.add("bg-gradient-to-r", "from-red-600", "to-pink-600", "text-white");
  usersTab.classList.remove("text-gray-600", "hover:bg-gray-100");
  statsTab.classList.remove("bg-gradient-to-r", "from-red-600", "to-pink-600", "text-white");
  statsTab.classList.add("text-gray-600", "hover:bg-gray-100");
  
  // Update content
  usersContent.classList.remove("hidden");
  statsContent.classList.add("hidden");
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", initAdminDashboard);
