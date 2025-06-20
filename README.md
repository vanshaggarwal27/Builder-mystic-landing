# SHKVA School Management System

A comprehensive school management system built with React, Node.js, and MongoDB Atlas. The system supports students, teachers, and administrators with role-based access control.

## 🚀 Features

- **Multi-Role Authentication**: Students, Teachers, and Admins
- **Real Database Integration**: MongoDB Atlas cloud database
- **Admin User Management**: Create and manage all user accounts
- **Role-Based Dashboards**: Customized interfaces for each user type
- **Responsive Design**: Mobile-first design with smooth transitions
- **Real-Time Data**: Live connection to cloud database

## 🏗 Architecture

### Frontend (React + TypeScript)

- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM
- **Styling**: TailwindCSS with custom components
- **State Management**: Context API for authentication
- **UI Components**: Radix UI primitives with custom styling

### Backend (Node.js + Express)

- **Runtime**: Node.js with Express
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: express-validator for input validation
- **Security**: Helmet, CORS, rate limiting

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (connection string provided)

### 1. Install Dependencies

**Frontend:**

```bash
npm install
```

**Backend:**

```bash
cd server
npm install
```

### 2. Environment Setup

The MongoDB connection is already configured in `server/.env`:

```env
MONGODB_URI=mongodb+srv://shkva:9kocZC2eqG1WiQZp@cluster0.shqln6q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### 3. Create Initial Users

Run the seeder scripts to create sample users:

```bash
# Create admin user
cd server
npm run seed:admin

# Create sample student and teacher
npm run seed:users
```

### 4. Start the Application

**Terminal 1 - Backend Server:**

```bash
cd server
npm run dev
```

Backend runs on: http://localhost:5000

**Terminal 2 - Frontend Dev Server:**

```bash
npm run dev
```

Frontend runs on: http://localhost:8080

## 👥 Default User Accounts

After running the seeders, you can login with:

| Role        | Email             | Password   |
| ----------- | ----------------- | ---------- |
| **Admin**   | admin@shkva.edu   | admin123   |
| **Teacher** | teacher@shkva.edu | teacher123 |
| **Student** | student@shkva.edu | student123 |

## 🔐 Authentication System

### How It Works

1. **Admin-Only User Creation**: Only admins can create new user accounts
2. **Database Authentication**: All login attempts are verified against MongoDB
3. **JWT Tokens**: Secure token-based session management
4. **Role-Based Access**: Different dashboards and permissions per role

### Creating New Users

1. Login as admin (admin@shkva.edu / admin123)
2. Navigate to User Management
3. Click "Add User" and fill in the details
4. Users can then login with their assigned email/password

## 📱 User Interface

### Student Dashboard

- View assignments and due dates
- Check attendance records
- Access notices and announcements
- View class schedule
- Download results

### Teacher Dashboard

- Manage classes and students
- Create and grade assignments
- Mark attendance
- Send notices
- View teaching schedule

### Admin Dashboard

- **User Management**: Create/edit all user accounts
- System reports and analytics
- Send school-wide announcements
- Manage teacher attendance
- System settings

## 🔄 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Admin Routes (Admin only)

- `POST /api/admin/users` - Create new user
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user

### Student Routes

- `GET /api/students/profile` - Get student profile
- `GET /api/attendance/student` - Get attendance

### Teacher Routes

- `GET /api/teachers/profile` - Get teacher profile

## 🛡 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based sessions
- **Role-Based Access Control**: Endpoint protection by user role
- **Input Validation**: Server-side validation for all inputs
- **Environment Variables**: Sensitive data in environment files

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure MongoDB Atlas connection string is correct
- Check network connectivity
- Verify database permissions

### Authentication Problems

- Clear browser localStorage and try again
- Ensure backend server is running on port 5000
- Check that seeder scripts ran successfully

### Development Server Issues

- Frontend: http://localhost:8080
- Backend: http://localhost:5000
- Ensure both servers are running simultaneously

## 📄 Project Structure

```
├── src/                          # Frontend source
│   ├── components/               # Reusable UI components
│   ├── contexts/                # React contexts (Auth)
│   ├── pages/                   # Route components
│   │   ├── auth/               # Login pages
│   │   ├── student/            # Student dashboard
│   │   ├── teacher/            # Teacher dashboard
│   │   └── admin/              # Admin dashboard
│   └── lib/                    # Utilities and types
│
├── server/                      # Backend source
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API route handlers
│   ├── middleware/             # Auth middleware
│   ├── seeds/                  # Database seeders
│   └── app.js                  # Express server
│
└── package.json                # Frontend dependencies
```

## 🔄 Development Workflow

1. **Start Backend**: `cd server && npm run dev`
2. **Start Frontend**: `npm run dev`
3. **Test Authentication**: Use provided sample accounts
4. **Create Users**: Login as admin to create new accounts
5. **Database Changes**: Use seeders or admin interface

The system is now fully connected to the cloud database and only accepts users created by administrators!
