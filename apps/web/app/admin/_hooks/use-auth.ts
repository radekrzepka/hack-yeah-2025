"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: string | null;
  token: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    login: null,
    token: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      // Check for token in localStorage or sessionStorage
      const token =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");
      const login =
        localStorage.getItem("adminLogin") ||
        sessionStorage.getItem("adminLogin");

      if (!token) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          login: null,
          token: null,
        });
        return;
      }

      // In production, you should decode and verify JWT token here
      // For now, just check if it exists
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        login,
        token,
      });
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        login: null,
        token: null,
      });
    }
  };

  const login = (
    token: string,
    userLogin: string,
    rememberMe: boolean = false,
  ) => {
    if (rememberMe) {
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminLogin", userLogin);
    } else {
      sessionStorage.setItem("adminToken", token);
      sessionStorage.setItem("adminLogin", userLogin);
    }

    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      login: userLogin,
      token,
    });

    toast.success("Zalogowano pomyślnie");
    router.push("/admin/dashboard");
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLogin");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminLogin");

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      login: null,
      token: null,
    });

    toast.success("Wylogowano pomyślnie");
    router.push("/admin");
  };

  const requireAuth = () => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      toast.error("Brak autoryzacji", {
        description: "Zaloguj się, aby uzyskać dostęp do tej strony",
      });
      router.push("/admin");
      return false;
    }
    return true;
  };

  return {
    ...authState,
    login,
    logout,
    requireAuth,
    checkAuth,
  };
}
