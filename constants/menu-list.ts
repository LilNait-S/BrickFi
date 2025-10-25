import { Building2, HomeIcon, LayoutDashboard } from "lucide-react"

export const desktopMenuItems = [
  {
    href: "/proyectos",
    label: "Proyectos",
    icon: Building2,
  },
  {
    href: "/dashboard",
    label: "Panel de usuario",
    icon: LayoutDashboard,
  },
]

export const mobileMenuItems = [
  {
    href: "/",
    label: "Home",
    icon: HomeIcon,
  },
  ...desktopMenuItems,
]
