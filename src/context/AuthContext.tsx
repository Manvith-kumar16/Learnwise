import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthUser, ensureDefaultClass, ensureStudentRecord, getAuthUser, setAuthUser, addStudentToClass } from "@/lib/store";

type AuthContextType = {
  user: AuthUser | null;
  signIn: (params: { email: string; name?: string; role?: AuthUser["role"] }) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const existing = getAuthUser();
    if (existing) {
      setUser(existing);
      // Ensure defaults first so seeded data is available
      ensureDefaultClass();
      ensureStudentRecord(existing.email, existing.name);
      addStudentToClass("placement-prep", existing.email);
    }
  }, []);

  const signIn: AuthContextType["signIn"] = ({ email, name, role }) => {
    const normalized: AuthUser = {
      email: email.toLowerCase().trim(),
      name: name?.trim() || email.split("@")[0],
      role: role || "student",
    };
    setAuthUser(normalized);
    setUser(normalized);
    // Ensure corresponding student and default class exist
    ensureDefaultClass();
    ensureStudentRecord(normalized.email, normalized.name);
    addStudentToClass("placement-prep", normalized.email);
  };

  const signOut = () => {
    setAuthUser(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, signIn, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
