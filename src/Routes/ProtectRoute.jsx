import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { api } from './server/api' // ajuste o caminho se necessário
import { jwtDecode } from 'jwt-decode'

export default function ProtectRoute () {
  const [role, setRole] = useState(null)

  const location = useLocation()
  const rotaAtual = location.pathname

  const token = localStorage.getItem('authToken')

  if (!token) {
    return <Navigate to='/' replace />
  }

  useEffect(() => {
    const decodeToken = jwtDecode(token)
    const role = decodeToken.data.role
    setRole(role)
  }, [token])

  const rotasAdmin = ['/cadastro-adm', '/candidatos', '/vagas']
  const rotasUser = ['/home', '/minhas-vagas', '/perfil', '/candidatura/:id']

  const isAdmin = role === 'admin'
  const isUser = role === 'user'

  const tentandoAcessarAdmin = rotasAdmin.includes(rotaAtual)
  const tentandoAcessarUser = rotasUser.includes(rotaAtual)

  if (rotaAtual === '/') {
    if (isAdmin) {
      return <Navigate to='/vagas' replace />
    } else if (isUser) {
      return <Navigate to='/home' replace />
    }
  }

  if (tentandoAcessarUser && isAdmin) {
    return <Outlet />
  }

  if (tentandoAcessarAdmin && isUser) {
    return <Navigate to='/home' replace />
  }

  if (tentandoAcessarUser && isAdmin) {
    return <Navigate to='/vagas' replace />
  }

  return <Outlet />
}
