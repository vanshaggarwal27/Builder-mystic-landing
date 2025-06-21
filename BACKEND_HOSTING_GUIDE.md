# 🚀 Backend Hosting Guide for SHKVA School Management System

Your backend needs to be hosted on a cloud platform to be accessible from any device. Here are the best options:

## 🎯 **Recommended Hosting Platforms**

### **1. Railway (Easiest & Best for Beginners)**

**Perfect for your school management system!**

**Why Railway:**

- ✅ **Free tier available** (500 hours/month)
- ✅ **Automatic deployments** from GitHub
- ✅ **Built-in MongoDB** support
- ✅ **Zero configuration** needed
- ✅ **Global CDN** for fast access
- ✅ **Custom domains** included

**Steps:**

1. **Sign up**: https://railway.app (use GitHub account)
2. **Connect GitHub**: Link your repository
3. **Deploy**: Click "Deploy from GitHub repo"
4. **Environment**: Railway will detect Node.js automatically
5. **Add MongoDB**: Click "Add Plugin" → MongoDB
6. **Done!** Your API will be live at `https://yourapp.railway.app`

### **2. Render (Great Free Option)**

**Reliable and developer-friendly**

**Why Render:**

- ✅ **Free tier** (no credit card needed)
- ✅ **Auto-deploy** from GitHub
- ✅ **SSL certificates** included
- ✅ **Fast global network**

**Steps:**

1. **Sign up**: https://render.com
2. **New Web Service** → Connect GitHub
3. **Settings**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. **MongoDB**: Use MongoDB Atlas (you already have this!)
5. **Deploy**: Automatic deployment

### **3. Vercel (Excellent Performance)**

**Great for global performance**

**Why Vercel:**

- ✅ **Free tier** with generous limits
- ✅ **Edge functions** (super fast)
- ✅ **Auto-scaling**
- ✅ **Global deployment**

**Steps:**

1. **Sign up**: https://vercel.com
2. **Import Project** from GitHub
3. **Framework**: Select "Other"
4. **Build Settings**:
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`
   - **Build Command**: `npm run build` (add this to package.json)

### **4. Heroku (Traditional Choice)**

**Reliable but requires credit card**

**Why Heroku:**

- ✅ **Easy deployment**
- ✅ **Great documentation**
- ✅ **Many add-ons available**
- ❌ **No free tier** anymore (starts at $5/month)

## 🔧 **Setup Instructions for Railway (Recommended)**

### **Step 1: Prepare Your Code**

Add this to your `server/package.json`:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "build": "npm install"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### **Step 2: Update CORS for Production**

Update `server/app.js`:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:3000",
      /.*\.railway\.app$/,
      /.*\.render\.com$/,
      /.*\.vercel\.app$/,
      /.*\.builder\.codes$/,
      /.*\.projects\.builder\.codes$/,
    ],
    credentials: true,
  }),
);
```

### **Step 3: Environment Variables**

Set these in Railway dashboard:

```
MONGODB_URI=mongodb+srv://shkva:9kocZC2eqG1WiQZp@cluster0.shqln6q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-key-here
NODE_ENV=production
PORT=5000
```

### **Step 4: Update Frontend**

Update your frontend `.env`:

```
VITE_API_BASE_URL=https://your-app-name.railway.app/api
```

## 📱 **Making It Work on Any Device**

### **1. Update Frontend API URLs**

In `src/contexts/AuthContext.tsx`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
```

### **2. Update Vite Config**

In `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "https://your-app.railway.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
```

### **3. Test from Different Devices**

Once deployed, test from:

- ✅ **Desktop browser**
- ✅ **Mobile browser**
- ✅ **Tablet**
- ✅ **Different networks** (WiFi, Mobile data)

## 🔒 **Security Best Practices**

### **1. Environment Variables**

Never commit these to GitHub:

```
JWT_SECRET=super-secret-random-string-change-this
MONGODB_URI=your-mongodb-connection-string
NODE_ENV=production
```

### **2. CORS Configuration**

Only allow your frontend domains:

```javascript
app.use(
  cors({
    origin: ["https://your-frontend-domain.com"],
    credentials: true,
  }),
);
```

### **3. Rate Limiting**

Add to `server/app.js`:

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

## 🎉 **Quick Start: Deploy in 5 Minutes**

### **Option 1: Railway (Recommended)**

1. **Go to**: https://railway.app
2. **Sign in** with GitHub
3. **Click**: "Deploy from GitHub repo"
4. **Select**: Your repository
5. **Wait**: 2-3 minutes for deployment
6. **Add**: MongoDB plugin
7. **Set**: Environment variables
8. **Done!** API live at `https://yourapp.railway.app`

### **Option 2: One-Click Deploy Buttons**

Add to your GitHub README:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/VKJ0jL)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 📋 **After Deployment Checklist**

- ✅ **Backend URL** accessible (test `/api/health`)
- ✅ **Frontend connected** to new backend
- ✅ **MongoDB** connection working
- ✅ **Environment variables** set correctly
- ✅ **CORS** allows your frontend domain
- ✅ **Test login** from mobile device
- ✅ **Test file uploads** working
- ✅ **Admin user creation** functional

## 🆘 **Troubleshooting**

### **Common Issues:**

**1. "Failed to fetch" errors:**

- Check CORS configuration
- Verify backend URL is accessible
- Check environment variables

**2. "Internal Server Error":**

- Check server logs in hosting dashboard
- Verify MongoDB connection string
- Check all required environment variables

**3. "Authentication failed":**

- Verify JWT_SECRET is set
- Check token expiration settings
- Test API endpoints directly

### **Testing Your Deployment:**

```bash
# Test backend health
curl https://your-app.railway.app/api/health

# Test login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shkva.edu","password":"admin123","role":"admin"}'
```

## 💡 **Pro Tips**

1. **Use Railway** for easiest setup
2. **Keep MongoDB Atlas** (already working)
3. **Set up auto-deployments** from GitHub
4. **Monitor your app** with hosting platform dashboards
5. **Use custom domain** for professional look
6. **Set up monitoring** alerts for downtime

**Your school management system will be accessible from any device worldwide once deployed!** 🌍📱💻
