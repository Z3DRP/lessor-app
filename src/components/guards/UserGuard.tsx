import useAuth from "@/hooks/useAuth";
import { Fragment } from "react";
import { Navigate } from "react-router-dom";

interface UserGuardType {
  children: React.ReactNode;
}

export default function UserGuard({ children }: UserGuardType) {
  const { user } = useAuth();

  if (user?.profileType === "worker") {
    return <Navigate to="/dashboard/worker" />;
  }

  if (user?.profileType === "tenant") {
    return <Navigate to="/dashboard/tenant" />;
  }

  return <Fragment>{children}</Fragment>;
}
