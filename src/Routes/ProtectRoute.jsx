import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { api } from './server/api' // ajuste o caminho se necessário

export default function ProtectRoute () {
  const [role, setRole] = useState(null)

  const location = useLocation()
  const rotaAtual = location.pathname

  const token = localStorage.getItem('authToken')

  if (!token) {
    return <Navigate to='/' replace />
  }

  useEffect(() => {
    const coletarRole = async () => {
      try {
        const response = await api.get(`/profile`)
        const role = response.data.message.role
        setRole(role)
      } catch (error) {
        console.error('Erro ao buscar role do usuário:', error)
      }
    }

    coletarRole()
  }, [token])

  const rotasAdmin = ['/cadastro-adm', '/candidatos', '/vagas']
  const rotasUser = ['/home', '/minhas-vagas']

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
