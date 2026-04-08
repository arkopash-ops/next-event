"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"ADMIN" | "ORGANIZER" | "USER">;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/login");
    }
  }, [user, allowedRoles, router]);

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) return null;

  return <>{children}</>;
};
