import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch logged-in user on page reload
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:3000/api/auth/getuser", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'auth-token': token },
        });

        if (res.ok) {
          const data = await res.json();

          // ✅ Base user info
          let userData = {
            id: data._id,
            name: data.name,
            email: data.email,
            role: data.accountType, // guest | staff | admin
            number: data.number,
          };

          // ✅ Extra fields for staff
          if (data.accountType === "staff") {
            userData = {
              ...userData,
              salary: data.salary,
              department: data.department,
              departmentRole: data.departmentRole,
              floorNumber: data.floorNumber,
            };
          }

          setUser(userData);
        }
        if (!res.ok) {
    console.error("Failed to fetch user:", res.status);
    return; // don’t set user
  }
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ✅ Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login"; // ✅ always redirect after logout
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use in components
export const useAuth = () => useContext(AuthContext);
