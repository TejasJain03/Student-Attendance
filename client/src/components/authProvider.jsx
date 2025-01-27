/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "../axios"; // Assuming axios is configured properly

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user info
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/user", {
          withCredentials: true,
        });
        setUser(response.data.user); // Set the user data from API
      } catch (error) {
        setUser(null); // If error, clear the user data
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false); // Set loading to false once data fetching is complete
      }
    };

    fetchUser();
  }, [loading]); // Empty array ensures it only runs on mount

  // Function to handle login
  const login = async (credentials) => {
    try {
      const response = await axios.post("/auth/login", credentials);
      setUser(response.data.user); // Set user data after successful login
      return response.data.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Function to handle logout
  const logout = async () => {
    await axios.post("/auth/logout");
    setUser(null); // Clear user data on logout
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children} {/* Render children components */}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider; // Default export for AuthProvider
