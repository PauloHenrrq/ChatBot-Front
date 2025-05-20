import { useState, useEffect } from 'react'
import HeaderCandidato from '../../Layout/HeaderCandidato'
import { api } from '../../Routes/server/api'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import { BuildingOffice2Icon } from '@heroicons/react/24/outline'

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

        if (candidaturas.length === 0) {
          setCandidaturas('Nenhuma Candidatura em processo')
          return
        }

        const vagaIds = [...new Set(candidaturas.map(c => c.vagaId))]

        const vagasResponse = await Promise.all(
          vagaIds.map(id => api.get(`/vagas/${id}`))
        )

        const vagas = vagasResponse.map(res => res.data.details)

        setVagas(vagas)
        setCandidaturas(candidaturas)
      } catch (error) {
        console.error('Erro ao carregar candidaturas ou vagas:', error)
      }
    }

    carregarCandidaturasEVagas()
  }, [userID])

  return (
    <>
      <HeaderCandidato />
      <div className=''>
        <section className='flex sm:justify-center max-sm:px-8 sm:px-12 py-5'>
          <h1 className='text-4xl w-2/3 text-gray-800 text-left font-semibold'>
            Minhas Vagas
          </h1>
        </section>
        <hr />
        <section className='flex flex-col'>
          {Array.isArray(candidaturas) && candidaturas.length > 0 ? (
            vagas.map((vaga, index) => {
              const candidatura = candidaturas.find(c => c.vagaId === vaga.id)

              return (
                <div key={index}>
                  <div className='w-2/3 max-sm:w-full m-auto px-8 py-6 max-sm:grid max-sm:grid-cols-1'>
                    <Link
                      to={`/candidatura/${candidatura.id}`}
                      className='group'
                    >
                      <div className='w-full flex max-sm:flex-col items-center justify-between rounded-lg p-4 max-sm:gap-3 bg-white'>
                        <div className='max-sm:w-full flex gap-7 max-sm:gap-2'>
                          <div className='border w-16 h-16 flex items-center justify-center rounded-full bg-white'>
                            <BuildingOffice2Icon className='w-10' />
                          </div>
                          <div>
                            <h1 className='text-2xl font-semibold text-zinc-800'>
                              {vaga.titulo}
                            </h1>
                            <h2 className='text-xl text-zinc-800'>
                              {vaga.empresa}
                            </h2>
                          </div>
                        </div>

                        <div className='w-1/5 max-sm:w-full h-full content-center'>
                          <button className='w-full z-[100] rounded-xl py-1 cursor-pointer bg-zinc-200 button-decor'>
                            Ver progresso
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div>
                    <span className='max-sm:hidden text-zinc-300'>
                      <hr />
                    </span>
                  </div>
                </div>
              )
            })
          ) : (
            <div className='flex justify-center items-center h-1/2 min-h-44'>
              <p className='text-gray-400 font-bold text-xl min-lg:text-2xl'>
                Nenhuma Candidatura em processo
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
