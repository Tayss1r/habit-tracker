const { contextBridge, ipcRenderer } = require("electron");

const API_BASE_URL = "http://localhost:8000/api/v1";

// API functions defined directly in preload to avoid sandbox issues
async function register(email, username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password })
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

contextBridge.exposeInMainWorld("api", {
  register: register,
  login: login,
  getHabits: getHabits,
  createHabit: createHabit,
  updateHabit: updateHabit,
  deleteHabit: deleteHabit,
  markHabitDone: markHabitDone,
  getHabitStatus: getHabitStatus
});

contextBridge.exposeInMainWorld("electron", {
  openDashboard: () => ipcRenderer.send("open-dashboard"),
  closeCurrent: () => ipcRenderer.send("close-current"),
  logout: () => ipcRenderer.send("logout")
});
