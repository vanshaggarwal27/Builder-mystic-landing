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

const API_BASE_URL = "/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Verify token with backend
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
    try {
      console.log("🔐 Attempting login:", {
        email,
        role,
        apiUrl: `${API_BASE_URL}/auth/login`,
      });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      console.log("📡 Login response status:", response.status);
      const data = await response.json();
      console.log("📄 Login response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("authToken", data.token);

      // Set user in state
      setUser({
        id: data.user.id,
        name: `${data.user.profile.firstName} ${data.user.profile.lastName}`,
        email: data.user.email,
        role: data.user.role,
      });
    } catch (error) {
      console.error("Login error:", error);

      // Fallback for hosted environment - demo mode
      if (error.message.includes("Failed to fetch")) {
        console.log("🌐 Backend not accessible, using demo mode");

        // Demo credentials check
        const demoUsers: Record<string, any> = {
          "admin@shkva.edu": {
            id: "demo-admin",
            name: "Admin User",
            email: "admin@shkva.edu",
            role: "admin",
          },
          "teacher@shkva.edu": {
            id: "demo-teacher",
            name: "Maria Johnson",
            email: "teacher@shkva.edu",
            role: "teacher",
          },
          "student@shkva.edu": {
            id: "demo-student",
            name: "John Smith",
            email: "student@shkva.edu",
            role: "student",
          },
        };

        const demoPasswords: Record<string, string> = {
          "admin@shkva.edu": "admin123",
          "teacher@shkva.edu": "teacher123",
          "student@shkva.edu": "student123",
        };

        if (
          demoUsers[email] &&
          demoPasswords[email] === password &&
          demoUsers[email].role === role
        ) {
          localStorage.setItem("authToken", "demo-token");
          setUser(demoUsers[email]);
          return;
        }
      }

      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
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
