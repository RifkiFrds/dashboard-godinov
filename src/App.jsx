import React from "react";
import AppRouter from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return  (
    <>
      <AppRouter />
      <ToastContainer position="top-right" theme="dark" autoClose={2500} />
    </>
  ); 
}
