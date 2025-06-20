import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User, UserRole } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use proxy for local development, direct URL for production/mobile
const API_BASE_URL =
  import.meta.env.MODE === "development" &&
  window.location.hostname === "localhost"
    ? "/api"
    : "https://shkva-backend-new.onrender.com/api";

// Demo users storage (persists in localStorage)
const getDemoUsers = () => {
  const stored = localStorage.getItem("demoUsers");
  const defaultUsers = {
    "admin@shkva.edu": {
      id: "demo-admin",
      name: "Admin User",
      email: "admin@shkva.edu",
      role: "admin",
      password: "admin123",
    },
    "teacher@shkva.edu": {
      id: "demo-teacher",
      name: "Maria Johnson",
      email: "teacher@shkva.edu",
      role: "teacher",
      password: "teacher123",
    },
    "student@shkva.edu": {
      id: "demo-student",
      name: "John Smith",
      email: "student@shkva.edu",
      role: "student",
      password: "student123",
    },
  };

  if (stored) {
    try {
      return { ...defaultUsers, ...JSON.parse(stored) };
    } catch {
      return defaultUsers;
    }
  }
  return defaultUsers;
};

const saveDemoUsers = (users: any) => {
  const {
    "admin@shkva.edu": admin,
    "teacher@shkva.edu": teacher,
    "student@shkva.edu": student,
    ...custom
  } = users;
  localStorage.setItem("demoUsers", JSON.stringify(custom));
};

// Export function to add demo users (for admin user creation)
export const addDemoUser = (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: string,
) => {
  const users = getDemoUsers();
  users[email] = {
    id: `demo-${role}-${Date.now()}`,
    name: `${firstName} ${lastName}`,
    email,
    role,
    password,
  };
  saveDemoUsers(users);
  console.log("✅ Demo user added to storage:", { email, role });
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load and restore user session
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("currentUser");

    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUser(user);
        if (token.startsWith("demo-token")) {
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Error parsing saved user:", e);
      }
    }

    if (token && !token.startsWith("demo-token")) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token: string) => {
    try {
      // If demo token, skip API call
      if (token === "demo-token") {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.user.id,
          name: `${data.user.profile.firstName} ${data.user.profile.lastName}`,
          email: data.user.email,
          role: data.user.role,
        });
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("authToken");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);

      // If backend not accessible and demo token exists, that's ok
      if (token === "demo-token") {
        console.log("🌐 Demo mode - backend not accessible");
      } else {
        localStorage.removeItem("authToken");
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role: UserRole) => {
    console.log("🔐 Login starting:", { email, role });

    // Get demo users from storage (includes newly created users)
    const demoUsers = getDemoUsers();

    // Check if this is a demo login first
    const isDemoLogin =
      demoUsers[email] &&
      demoUsers[email].password === password &&
      demoUsers[email].role === role;

    // Direct backend URL for mobile apps
    const backendURL = "https://shkva-backend-new.onrender.com/api";
    console.log("�� Using backend URL:", backendURL);

    try {
      // Create a fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log("⏰ Fetch timeout after 8 seconds");
      }, 8000); // 8 second timeout for mobile networks

      console.log("📡 Attempting fetch to:", `${backendURL}/auth/login`);

      const response = await fetch(`${backendURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password, role }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("📡 Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      // Check if response has content before parsing JSON
      const responseText = await response.text();
      console.log("📄 Raw response:", responseText);

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      // Store token in localStorage
      console.log("💾 Storing token...");
      localStorage.setItem("authToken", data.token);

      // Set user in state and persist
      console.log("👤 Setting user state...");
      const userData = {
        id: data.user.id,
        name: `${data.user.profile.firstName} ${data.user.profile.lastName}`,
        email: data.user.email,
        role: data.user.role,
      };
      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));

      console.log("✅ Backend login completed successfully");
    } catch (error: any) {
      console.error("❌ Backend login failed:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // For valid credentials, fall back to demo mode, but for newly created users, try backend first
      if (isDemoLogin) {
        console.log("🌐 Falling back to demo mode for valid credentials");
        localStorage.setItem("authToken", `demo-token-${email}`);
        const { password, ...userWithoutPassword } = demoUsers[email];
        setUser(userWithoutPassword);
        console.log("✅ Demo login successful");
        return;
      }

      // For invalid credentials, show the actual error
      throw new Error(error.message || "Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
