import { useState, useEffect } from 'react'
import HeaderCandidato from '../../Layout/HeaderCandidato'
import { api } from '../../Routes/server/api'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'

export default function Candidaturas () {
  const [vagas, setVagas] = useState([])
  const [candidaturas, setCandidaturas] = useState([])

  const token = localStorage.getItem('authToken')
  const decode = jwtDecode(token)
  const userID = decode.data.id

  useEffect(() => {
    const carregarCandidaturasEVagas = async () => {
      try {
        const response = await api.get(`/candidaturas/candidatos/${userID}`)
        const candidaturas = response.data.details
        setCandidaturas(candidaturas)
        console.log(candidaturas)

        const vagaIds = [...new Set(candidaturas.map(c => c.vagaId))]

        const vagasResponse = await Promise.all(
          vagaIds.map(id => api.get(`/vagas/${id}`))
        )

        const vagas = vagasResponse.map(res => res.data.details)
        setVagas(vagas)
        console.log(vagas)
      } catch (error) {
        console.error('Erro ao carregar candidaturas ou vagas:', error)
      }
    }

    carregarCandidaturasEVagas()
  }, [])

  return (
    <>
      <HeaderCandidato />
      <div className='p-12'>
        <section className=''>
          <h1 className='text-5xl mb-5 text-gray-800 text-center font-semibold'>
            Minhas Candidaturas
          </h1>
        </section>
        <section className='p-8 border rounded-2xl flex'>
          {vagas.map((vagas, index) => {
            const candidatura = candidaturas.find(c => c.vagaId === vagas.id)

            return (
              <div key={index} className='w-1/3 border rounded-xl p-4'>
                <h1 className='text-4xl font-semibold text-center'>
                  {vagas.empresa}
                </h1>
                <h2 className='text-2xl font-semibold text-center'>
                  {vagas.titulo}
                </h2>
                <Link to={`/candidatura/${candidatura.id}`}>
                  <button className='w-full border cursor-pointer'>a</button>
                </Link>
              </div>
            )
          })}
        </section>
      </div>
    </>
  )
}
