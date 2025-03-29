import { SidebarItemsType } from "@/types/sidebar";

import {
  User,
  Calendar,
  CheckSquare,
  CreditCard,
  Layout,
  House,
  Sliders,
  Users,
} from "lucide-react";

const pagesSection = [
  {
    href: "/dashboard",
    icon: Sliders,
    title: "Dashboard",
    role: "lessor",
    children: [
      {
        href: "/dashboard",
        title: "Home",
      },
      {
        href: "/dashboard/analytics",
        title: "Analytics",
      },
      {
        href: "/dashboard/worker",
        title: "Home",
        role: "worker",
      },
    ],
  },
  {
    href: "/admin",
    icon: Layout,
    title: "Admin",
    role: "lessor",
    children: [
      // {
      //   href: "/admin/company",
      //   title: "Company",
      // },
      {
        href: "/admin/lease",
        title: "Leases",
      },
      {
        href: "/admin/settings",
        title: "Settings",
      },
    ],
  },
  {
    href: "/properties",
    icon: House,
    title: "Properties",
    badge: "8",
    role: "lessor",
  },
  {
    href: "/tasks",
    icon: CheckSquare,
    title: "Tasks",
    //badge: "View",
    role: "lessor",
    children: [
      // {
      //   href: "/tasks",
      //   title: "List",
      //   badge: "3",
      // },
      {
        href: "/tasks/view",
        title: "View",
        badge: "3",
      },
    ],
  },
  // {
  //   href: "/tenant",
  //   icon: User,
  //   title: "Tenants",
  // },
  {
    href: "/worker",
    icon: Users,
    title: "Workers",
    role: "lessor",
  },
  // {
  //   href: "/invoices",
  //   icon: CreditCard,
  //   title: "Invoices",
  //   children: [
  //     {
  //       href: "/invoices",
  //       title: "List",
  //     },
  //     {
  //       href: "/invoices/detail",
  //       title: "Detail",
  //     },
  //   ],
  // },
  // {
  //   href: "/calendar",
  //   icon: Calendar,
  //   title: "Calendar",
  // },
] as SidebarItemsType[];

const navItems = [
  {
    title: "Pages",
    pages: pagesSection,
  },
];

export default navItems;
