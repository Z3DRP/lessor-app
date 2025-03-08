import React from "react";
import { Navigate } from "react-router-dom";

import async from "@/components/Async";

// All pages that rely on 3rd party components (other than MUI) are
// loaded asynchronously, to keep the initial JS bundle to a minimum size

import ErrorLayout from "@/layouts/Error";
import DashboardLayout from "@/layouts/Dashboard";

// Guards
import AuthGuard from "@/components/guards/AuthGuard";

// Auth components
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ResetPassword from "@/pages/auth/ResetPassword";
import Page404 from "@/pages/auth/Page404";
import Page500 from "@/pages/auth/Page500";

// Page components
import Blank from "@/pages/pages/Blank";
import InvoiceDetails from "@/pages/pages/InvoiceDetails";
import InvoiceList from "@/pages/pages/InvoiceList";
import Products from "@/pages/pages/Products";
import Settings from "@/pages/pages/Settings";
import Projects from "@/pages/pages/Projects";

// Protected routes
import ProtectedPage from "@/pages/protected/ProtectedPage";

// Dashboard components
import AuthCover from "@/layouts/AuthCover";
import Properties from "./pages/pages/Properties";
import Default from "./pages/dashboards/Default";
const Analytics = async(() => import("@/pages/dashboards/Analytics"));
const SaaS = async(() => import("@/pages/dashboards/SaaS"));
const Profile = async(() => import("@/pages/pages/Profile"));
const Tasks = async(() => import("@/pages/pages/Tasks"));
const Calendar = async(() => import("@/pages/pages/Calendar"));

const routes = [
  {
    path: "/",
    element: <AuthCover />,
    children: [
      { path: "", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        //element: <Default />,
        element: (
          <AuthGuard>
            <Default />
          </AuthGuard>
        ),
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      // {
      //   path: "saas",
      //   element: <SaaS />,
      // },
    ],
  },
  {
    path: "admin",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Profile />,
      },
      {
        path: "company",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "lease",
        element: <Blank />,
      },
    ],
  },
  {
    path: "properties",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <Properties />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: "tasks",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Projects />,
      },
      {
        path: "view",
        element: <Tasks />,
      },
    ],
  },
  {
    path: "tenant",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Products />,
      },
    ],
  },
  {
    path: "worker",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Products />,
      },
    ],
  },
  {
    path: "invoices",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <InvoiceList />,
      },
      {
        path: "detail",
        element: <InvoiceDetails />,
      },
    ],
  },
  {
    path: "calendar",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Calendar />,
      },
    ],
  },
  {
    path: "error",
    element: <ErrorLayout />,
    children: [
      {
        path: "404",
        element: <Page404 />,
      },
      {
        path: "500",
        element: <Page500 />,
      },
    ],
  },
  {
    path: "private",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <ProtectedPage />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorLayout />,
    children: [
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
];

export default routes;
