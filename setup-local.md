# 🚀 Quick Local Setup Guide

## For Anyone Who Clones This Repo

### **What You Get:**

- ✅ **Frontend** running locally
- ✅ **Backend** connecting to deployed server
- ✅ **Database** using MongoDB Atlas
- ✅ **No local backend needed**

### **Steps to Run:**

1. **Clone the repository:**

```bash
git clone <your-repo-url>
cd <repo-name>
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the frontend:**

```bash
npm run dev
```

4. **Access the app:**

- Open: http://localhost:8080
- Login with: admin@shkva.edu / admin123 / 123456

### **How It Works:**

- **Frontend**: Runs on localhost:8080
- **Backend**: Uses deployed server (shkva-backend-new.onrender.com)
- **Database**: MongoDB Atlas (shared cloud database)

### **Default Accounts:**

- **Admin**: admin@shkva.edu / admin123
- **Teacher**: teacher@shkva.edu / teacher123
- **Student**: student@shkva.edu / student123

### **No Backend Setup Needed!**

The frontend automatically connects to the deployed backend. You don't need to:

- ❌ Run `cd server && npm run dev`
- ❌ Set up local database
- ❌ Configure environment variables
- ❌ Install backend dependencies

### **Troubleshooting:**

If you see "Demo mode activated":

1. Check your internet connection
2. Wait a few seconds and try again
3. The deployed backend might be starting up (first request can be slow)

### **For Deployment:**

Your local changes will work everywhere because the backend is already deployed and accessible globally.
