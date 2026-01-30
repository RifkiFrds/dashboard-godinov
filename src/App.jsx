import React from "react";
import AppRouter from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <AppRouter />

      {/* GLOBAL TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
        closeOnClick
        pauseOnHover
        draggable
        style={{ zIndex: 99999 }} 
      />
    </>
  );
}
