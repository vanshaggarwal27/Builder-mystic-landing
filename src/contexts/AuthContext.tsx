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

// Always use production backend for real authentication
const API_BASE_URL = "https://shkva-backend-new.onrender.com/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load and restore user session
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("currentUser");

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // Verify token with backend
        fetchCurrentUser(token);
      } catch (e) {
        console.error("Error parsing saved user:", e);
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = {
          id: data.user.id,
          name: `${data.user.profile.firstName} ${data.user.profile.lastName}`,
          email: data.user.email,
          role: data.user.role,
        };
        setUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role: UserRole) => {
    console.log("🔐 Login starting:", { email, role });
    console.log("🌐 Using API URL:", API_BASE_URL);

    // All users, including admin, use real backend authentication
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      // Check content type to determine how to parse
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const responseText = await response.text();
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          console.error("❌ JSON parse error:", parseError);
          throw new Error("Invalid response from server");
        }
      }

      if (!response.ok) {
        console.error("❌ Server response not ok:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });
        throw new Error(
          data.error ||
            data.message ||
            `Server error: ${response.status} - ${response.statusText}`,
        );
      }

      // Store token and user data
      localStorage.setItem("authToken", data.token);
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
      console.error("❌ Backend login failed:", error);

      // Special fallback for admin only when backend is not accessible
      if (
        email === "admin@shkva.edu" &&
        password === "admin123" &&
        role === "admin" &&
        (error.message.includes("Failed to fetch") ||
          error.message.includes("network"))
      ) {
        console.log("🔑 Admin fallback login - backend not accessible");
        const adminUser = {
          id: "demo-admin",
          name: "System Administrator",
          email: "admin@shkva.edu",
          role: "admin" as UserRole,
        };
        setUser(adminUser);
        localStorage.setItem("authToken", "demo-admin-token");
        localStorage.setItem("currentUser", JSON.stringify(adminUser));
        return;
      }

      throw new Error(
        error.message || "Login failed. Please contact your admin.",
      );
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

// Helper function to get API headers with auth token
export function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Helper function to make authenticated API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");

  // Handle demo admin token for offline scenarios
  if (token === "demo-admin-token") {
    // For demo admin, simulate API responses for essential operations
    if (endpoint === "/admin/users" && options.method === "GET") {
      return { users: [] }; // Return empty users list
    }
    if (endpoint === "/admin/users" && options.method === "POST") {
      throw new Error(
        "Please use real admin login to create users. Backend connection required.",
      );
    }
    throw new Error(
      "Backend connection required for this operation. Please ensure you're connected to the internet and try logging in again.",
    );
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      throw new Error("Session expired. Please login again.");
    }

    // Clone the response to avoid body stream already read error
    const responseClone = response.clone();
    let errorText;
    try {
      errorText = await response.text();
    } catch (e) {
      errorText = `API call failed: ${response.status}`;
    }
    throw new Error(errorText || `API call failed: ${response.status}`);
  }

  return response.json();
}
