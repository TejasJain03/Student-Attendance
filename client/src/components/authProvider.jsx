/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "../axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("/auth/user")
      .then((response) => {
        console.log(response.data.user);
        setUser(response.data.user);
      })
      .catch((error) => {
        console.log("Error fetching user:", error);
      });
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post("/auth/login", credentials);
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    await axios.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider; // Default export
