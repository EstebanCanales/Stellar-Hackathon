import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  stellarPublicKey: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there is a saved session
    const savedUser = localStorage.getItem("verida_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Login simulation - in production this would be a backend call
      if (email && password.length >= 6) {
        const mockUser: User = {
          id: "1",
          email: email,
          stellarPublicKey:
            "GCKFBEIYTKP33XDVHFED7JKUEWCADHJHTJTGXLYJJ7QSMMHD5PFCZDQX",
          name: email.split("@")[0],
        };

        setUser(mockUser);
        localStorage.setItem("verida_user", JSON.stringify(mockUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("verida_user");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
