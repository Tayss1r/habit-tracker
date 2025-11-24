const { contextBridge, ipcRenderer } = require("electron");

const API_BASE_URL = "http://localhost:8000/api/v1";

// API functions defined directly in preload to avoid sandbox issues
async function register(email, username, password, profile_image = "user-2.jpg") {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password, profile_image })
  });
  return res.json();
}

async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Login failed");
  }
  return res.json();
}

async function getHabits(userId) {
  const res = await fetch(`${API_BASE_URL}/habits?user_id=${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch habits");
  }
  return res.json();
}

async function createHabit(habitData) {
  const res = await fetch(`${API_BASE_URL}/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(habitData)
  });
  if (!res.ok) {
    throw new Error("Failed to create habit");
  }
  return res.json();
}

async function markHabitDone(habitId, userId) {
  const res = await fetch(`${API_BASE_URL}/habit-logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ habit_id: habitId, user_id: userId, is_done: true })
  });
  if (!res.ok) {
    throw new Error("Failed to mark habit as done");
  }
  return res.json();
}

async function getHabitStatus(habitId) {
  const res = await fetch(`${API_BASE_URL}/habits/${habitId}/status`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Failed to get habit status");
  }
  return res.json();
}

async function updateHabit(habitId, habitData) {
  const res = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(habitData)
  });
  if (!res.ok) {
    throw new Error("Failed to update habit");
  }
  return res.json();
}

async function deleteHabit(habitId) {
  const res = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Failed to delete habit");
  }
  return res.json();
}

// Admin API functions
async function getAllUsers(adminUserId) {
  const res = await fetch(`${API_BASE_URL}/admin/users?admin_user_id=${adminUserId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

async function deleteUser(userId, adminUserId) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}?admin_user_id=${adminUserId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}

async function getOverviewStatistics(adminUserId) {
  const res = await fetch(`${API_BASE_URL}/admin/statistics/overview?admin_user_id=${adminUserId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to fetch statistics");
  return res.json();
}

async function getHabitsByCategory(adminUserId) {
  const res = await fetch(`${API_BASE_URL}/admin/statistics/habits-by-category?admin_user_id=${adminUserId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to fetch category statistics");
  return res.json();
}

async function getHabitsByPriority(adminUserId) {
  const res = await fetch(`${API_BASE_URL}/admin/statistics/habits-by-priority?admin_user_id=${adminUserId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to fetch priority statistics");
  return res.json();
}

async function getCompletionTrend(adminUserId, days = 30) {
  const res = await fetch(`${API_BASE_URL}/admin/statistics/completion-trend?admin_user_id=${adminUserId}&days=${days}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to fetch completion trend");
  return res.json();
}

async function getUserActivity(adminUserId) {
  const res = await fetch(`${API_BASE_URL}/admin/statistics/user-activity?admin_user_id=${adminUserId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to fetch user activity");
  return res.json();
}

async function getNewUsers(adminUserId, days = 30) {
  const res = await fetch(`${API_BASE_URL}/admin/statistics/new-users?admin_user_id=${adminUserId}&days=${days}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to fetch new users");
  return res.json();
}

// User profile API functions
async function getUser(userId) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

async function updateUser(userId, userData) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to update user");
  }
  return res.json();
}

contextBridge.exposeInMainWorld("api", {
  register: register,
  login: login,
  getHabits: getHabits,
  createHabit: createHabit,
  updateHabit: updateHabit,
  deleteHabit: deleteHabit,
  markHabitDone: markHabitDone,
  getHabitStatus: getHabitStatus,
  // User profile APIs
  getUser: getUser,
  updateUser: updateUser,
  // Admin APIs
  getAllUsers: getAllUsers,
  deleteUser: deleteUser,
  getOverviewStatistics: getOverviewStatistics,
  getHabitsByCategory: getHabitsByCategory,
  getHabitsByPriority: getHabitsByPriority,
  getCompletionTrend: getCompletionTrend,
  getUserActivity: getUserActivity,
  getNewUsers: getNewUsers
});

contextBridge.exposeInMainWorld("electron", {
  openDashboard: () => ipcRenderer.send("open-dashboard"),
  openAdminDashboard: () => ipcRenderer.send("open-admin-dashboard"),
  closeCurrent: () => ipcRenderer.send("close-current"),
  logout: () => ipcRenderer.send("logout")
});
