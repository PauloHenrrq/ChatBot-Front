import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = () => {
  // Verificando se o token está armazenado no localStorage
  const token = localStorage.getItem("authToken");

  // Se não houver token, redireciona para a página de login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Se o token existir, permite o acesso à rota protegida
  return <Outlet />;
};

export default ProtectRoute;
