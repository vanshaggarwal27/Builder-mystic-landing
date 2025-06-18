# SHKVA School Management System - Backend API

A comprehensive Node.js/Express.js backend for the SHKVA School Management System.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth with role-based access control
- **User Management** - Students, Teachers, and Administrators
- **Assignment Management** - Create, upload, submit, and grade assignments
- **Notice System** - School-wide announcements with targeting
- **File Upload/Download** - Secure file handling for assignments and materials
- **Role-based Access** - Different permissions for students, teachers, and admins

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## 📦 Installation

1. **Clone and navigate to server directory**:

   ```bash
   cd server
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB** (make sure MongoDB is running)

5. **Run the server**:

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Assignments

- `GET /api/assignments` - Get assignments (role-based)
- `POST /api/assignments` - Create assignment (teachers)
- `POST /api/assignments/:id/submit` - Submit assignment (students)
- `POST /api/assignments/:assignmentId/submissions/:submissionId/grade` - Grade submission (teachers)
- `GET /api/assignments/download/:filename` - Download files

### Notices

- `GET /api/notices` - Get notices (role-based)
- `POST /api/notices` - Create notice (admin)
- `POST /api/notices/:id/read` - Mark as read
- `GET /api/notices/:id/analytics` - Get analytics (admin)
- `PUT /api/notices/:id` - Update notice (admin)
- `DELETE /api/notices/:id` - Delete notice (admin)

### Students

- `GET /api/students` - Get students (teachers/admin)
- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update student profile
- `GET /api/students/assignments` - Get student assignments
- `GET /api/students/attendance` - Get attendance records

### Teachers

- `GET /api/teachers` - Get teachers (admin)
- `GET /api/teachers/profile` - Get teacher profile
- `PUT /api/teachers/profile` - Update teacher profile
- `GET /api/teachers/classes` - Get assigned classes
- `GET /api/teachers/assignments` - Get created assignments

### Admin

- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - User management
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

## 👥 User Roles

- **Student**: Can view assignments, submit work, read notices
- **Teacher**: Can create assignments, grade submissions, mark attendance
- **Admin**: Full system access, user management, notice creation

## 📁 File Upload

Supported file types:

- **Images**: JPG, JPEG, PNG, GIF
- **Documents**: PDF, DOC, DOCX, TXT
- **Max size**: 10MB per file

Files are stored in `uploads/assignments/` directory.

## 🗄 Database Schema

### Users

- Base user information with role-based profiles
- Student, Teacher, and Admin specific data

### Assignments

- Assignment details, materials, submissions
- File attachments and grading system

### Notices

- School announcements with targeting
- Read tracking and analytics

## 🔧 Configuration

Key environment variables:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## 🚦 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional details if available"
}
```

## 📊 Logging

- Request logging with Morgan
- Error logging to console
- Structured logging for production use

## 🔒 Security Features

- JWT token authentication
- Role-based authorization
- Input validation and sanitization
- File type restrictions
- Rate limiting
- CORS protection
- Security headers with Helmet

## 🧪 Testing

```bash
npm test
```

## 📈 Production Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set strong JWT secret
4. Configure CORS for your domain
5. Set up reverse proxy (Nginx)
6. Enable HTTPS
7. Configure log aggregation

## 🤝 API Integration

The backend integrates seamlessly with the React frontend. Make sure to:

1. Set correct API base URL in frontend
2. Include JWT tokens in requests
3. Handle authentication state
4. Implement file upload/download

## 📝 License

MIT License - see LICENSE file for details.
