import { jwtDecode } from 'jwt-decode'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function CheckRoute () {
  const token = localStorage.getItem('authToken')

  if (token) {
    const decoded = jwtDecode(token)
    const role = decoded.data.role

    if (role === 'admin') {
        return <Navigate to="/vagas" replace/>
    } else {
        return <Navigate to="/home" replace/>
    }
  }

  return <Outlet />
}
