import { SidebarItemsType } from "@/types/sidebar";

import { CheckSquare, Layout, House, Sliders, Users } from "lucide-react";

const pagesSection = [
  {
    href: "/dashboard",
    icon: Sliders,
    title: "Dashboard",
    role: "all",
    children: [
      {
        href: "/dashboard",
        title: "Home",
        role: "alessor",
      },
      {
        href: "/dashboard/analytics",
        title: "Analytics",
        role: "alessor",
      },
      {
        href: "/dashboard/worker",
        title: "Task Hub",
        role: "worker",
      },
    ],
  },
  {
    href: "/admin",
    icon: Layout,
    title: "Admin",
    role: "all",
    children: [
      {
        href: "/admin/lease",
        title: "Leases",
        role: "alessor",
      },
      {
        href: "/admin/settings",
        title: "Settings",
        role: "alessor",
      },
    ],
  },
  {
    href: "/properties",
    icon: House,
    title: "Properties",
    badge: "8",
    role: "alessor",
  },
  {
    href: "/tasks",
    icon: CheckSquare,
    title: "Tasks",
    //badge: "View",
    role: "alessor",
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
        role: "alessor",
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
    role: "alessor",
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
