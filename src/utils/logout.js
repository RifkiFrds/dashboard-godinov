import api from "../api";
import { toast } from "react-toastify";

export async function handleLogout() {
  try {
    const token = localStorage.getItem("token");

    await api.get("/api/logout", {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success("Berhasil logout!");
  } catch (e) {
    toast.error("Gagal logout!");
  }

  localStorage.removeItem("token");
  window.location.href = "/login";
}

