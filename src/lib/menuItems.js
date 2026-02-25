import { Key, LayoutDashboard, Mail, NotebookTabs, ListTodo, DollarSign, UserCircle, Calculator, ReceiptText } from "lucide-react";

export const MENU_ITEMS = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
    roles: ["admin", "uiux", "frontend", "backend", "finance", "pm", "cfo"]
  },
  {
    label: "Pesan",
    to: "/inbox",
    icon: Mail,
    roles: ["admin", "marketing"]
  },
  {
    label: "Portfolio",
    to: "/portfolio",
    icon: NotebookTabs,
    roles: ["admin", "pm"]
  },
  {
    label: "Otorisasi",
    to: "/authorization",
    icon: Key,
    roles: ["admin", "pm", "cfo"]
  },
  {
    label: "Project",
    to: "/projects",
    icon: ListTodo,
    roles: ["admin", "uiux", "frontend", "backend", "pm"]
  },
  {
    label: "Pengajuan",
    to: "/submissions",
    icon: ReceiptText,
    roles: ["finance", "pm", "uiux", "frontend", "backend", "admin"]
  },
  {
    label: "Finance",
    to: "/finance",
    icon: DollarSign,
    roles: ["admin", "finance"]
  },
  {
    label: "Rencana Anggaran",
    to: "/rab",
    icon: Calculator,
    roles: ["admin", "finance", "pm"]
  },
  {
    label: "Profile",
    to: "/profile",
    icon: UserCircle,
    roles: ["admin", "uiux", "frontend", "backend", "finance", "pm"]
  }
];