# Habit Tracker - Complete System Documentation

## Overview
A full-stack habit tracking application with a FastAPI backend and Electron desktop frontend featuring a modern, responsive UI with Tailwind CSS.

## Features Implemented

### Backend (FastAPI)
1. **Authentication System**
   - User registration (`POST /api/v1/auth/register`)
   - User login with credential validation (`POST /api/v1/auth/login`)
   - Password hashing with bcrypt

2. **Habit Management**
   - Create habits (`POST /api/v1/habits`)
   - Get all user habits (`GET /api/v1/habits?user_id={id}`)
   - Get single habit (`GET /api/v1/habits/{habit_id}`)
   - Update habits (`PUT /api/v1/habits/{habit_id}`)
   - Delete/deactivate habits (`DELETE /api/v1/habits/{habit_id}`)
   - Check habit status (`GET /api/v1/habits/{habit_id}/status`)

3. **Habit Logging**
   - Mark habits as done (`POST /api/v1/habit-logs`)
   - Get habit logs (`GET /api/v1/habit-logs/{habit_id}`)
   - Track daily completion status

### Frontend (Electron)

1. **Registration Page** (`index.html`)
   - Beautiful gradient background
   - Form validation
   - Success/error messaging
   - Link to login page

2. **Login Page** (`login.html`)
   - Matching design with registration
   - Email and password authentication
   - Error handling for invalid credentials
   - Auto-redirect to dashboard on success

3. **Dashboard** (`dashboard.html`)
   - **Top Navigation Bar**
     - App logo and branding
     - User name display
     - Logout button
   
   - **Statistics Cards**
     - Total habits count
     - Completed today count
     - Completion rate percentage
     - Color-coded with icons
   
   - **Habit Cards Grid**
     - Responsive grid layout (1-3 columns)
     - Color-coded by category with emojis
     - Priority badges (High/Medium/Low)
     - "Mark as Done" button
     - Completion status indicator
     - Hover effects and animations
   
   - **Add Habit Modal**
     - Title input
     - Category selection (Health, Fitness, Study, Work, Personal, Finance, Social)
     - Priority selection
     - Optional description
   
   - **Empty State**
     - Displayed when no habits exist
     - Call-to-action button

## Design Features

### Color Scheme
- **Primary**: Purple to Indigo gradient
- **Categories**:
  - Health: Green to Emerald
  - Fitness: Orange to Red
  - Study: Blue to Indigo
  - Work: Purple to Pink
  - Personal: Yellow to Orange
  - Finance: Green to Teal
  - Social: Pink to Rose

### UI/UX Elements
- Smooth animations (fadeIn, slideIn)
- Hover effects on cards and buttons
- Shadow elevations for depth
- Rounded corners (2xl radius)
- Gradient backgrounds
- Toast notifications
- Loading states
- Responsive design

## API Endpoints Summary

### Authentication
```
POST /api/v1/auth/register
Body: { email, username, password }
Response: { message }

POST /api/v1/auth/login
Body: { email, password }
Response: { message, user_id }
```

### Habits
```
GET /api/v1/habits?user_id={id}
Response: Array of Habit objects

POST /api/v1/habits
Body: { user_id, title, category?, priority?, description? }
Response: Habit object

GET /api/v1/habits/{habit_id}/status
Response: { habit_id, done_today }
```

### Habit Logs
```
POST /api/v1/habit-logs
Body: { habit_id, user_id, is_done }
Response: HabitLog object
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: string,
  username: string,
  password: string (hashed),
  created_at: datetime
}
```

### Habits Collection
```javascript
{
  _id: ObjectId,
  user_id: string,
  title: string,
  description: string?,
  category: string?,
  priority: string (High/Medium/Low),
  created_at: datetime,
  is_active: boolean
}
```

### Habit Logs Collection
```javascript
{
  _id: ObjectId,
  habit_id: string,
  user_id: string,
  date: datetime,
  is_done: boolean
}
```

## How to Run

### Backend
```bash
cd backend
source venvpire/bin/activate  # or your venv name
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd electron
npm start
```

## User Flow

1. **Registration**: User creates account with email, username, and password
2. **Login**: User logs in with email and password
3. **Dashboard Opens**: Shows statistics and habit cards
4. **Create Habits**: Click "Add New Habit" to create habits with category and priority
5. **Track Progress**: Mark habits as done each day
6. **View Stats**: See completion rate and daily progress
7. **Logout**: User can logout to return to login screen

## Technology Stack

- **Backend**: FastAPI, MongoDB, Motor (async driver), Pydantic, Passlib/Bcrypt
- **Frontend**: Electron, HTML5, Tailwind CSS, Vanilla JavaScript
- **IPC**: Electron IPC for window management
- **Storage**: LocalStorage for user session management

## Security Features

- Password hashing with bcrypt
- Context isolation in Electron
- CORS middleware configured
- Input validation with Pydantic
- Sandboxed preload scripts

## Notes

- All habit statuses are checked daily (resets at midnight)
- LocalStorage stores user session data
- Animations use CSS keyframes for performance
- Window management via Electron IPC
- All API calls use async/await pattern
