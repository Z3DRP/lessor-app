import { SidebarItemsType } from "@/types/sidebar";

import { CheckSquare, Layout, House, Sliders, Users } from "lucide-react";

const pagesSection = [
  {
    href: "/dashboard",
    icon: Sliders,
    title: "Dashboard",
    role: "alessor",
    children: [
      {
        href: "/dashboard",
        title: "Home",
        role: "alessor",
      },
      {
        href: "/dashboard/analytics",
        title: "Analytics",
      },
      {
        href: "/dashboard/worker",
        title: "Worker Home",
        role: "worker",
      },
    ],
  },
  {
    href: "/admin",
    icon: Layout,
    title: "Admin",
    role: "alessor",
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
