import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Helper: Decode JWT safely
  const getTokenExpiry = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000; // convert to ms
    } catch (err) {
      return null;
    }
  };

  // 🔁 Initial load (restore session)
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // 🔐 AUTO LOGOUT ON TOKEN EXPIRY
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const expiryTime = getTokenExpiry(token);
    if (!expiryTime) {
      logout();
      return;
    }

    const remainingTime = expiryTime - Date.now();

    // Token already expired
    if (remainingTime <= 0) {
      logout();
      window.location.href = "/login";
      return;
    }

    // Logout exactly at expiry time
    const timeout = setTimeout(() => {
      logout();
      window.location.href = "/login";
    }, remainingTime);

    return () => clearTimeout(timeout);
  }, [user]);

  // 🔑 Login
  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    setUser(data.user);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
