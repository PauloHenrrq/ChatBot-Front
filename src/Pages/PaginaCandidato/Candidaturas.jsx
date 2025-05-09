import { useState, useEffect } from 'react'
import HeaderCandidato from '../../Layout/HeaderCandidato'
import { api } from '../../Routes/server/api'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import { BuildingOffice2Icon } from '@heroicons/react/24/outline'

export default function Candidaturas() {
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
      <div className=''>
        <section className='flex sm:justify-center max-sm:px-8 sm:px-12 py-5'>
          <h1 className='text-4xl w-2/3 text-gray-800 text-left font-semibold'>
            Minhas Vagas
          </h1>

        </section>
        <hr />
        <section className='flex flex-col'>
          {vagas.map((vagas, index) => {
            const candidatura = candidaturas.find(c => c.vagaId === vagas.id)

            return (
              <>
                <div className='w-2/3 max-sm:w-full m-auto px-8 py-6 max-sm:grid max-sm:grid-cols-1'>
                  <div key={index} className='w-full flex max-sm:flex-col items-center justify-between border rounded p-4 max-sm:gap-3 bg-zinc-50'>
                    <div className='max-sm:w-full flex gap-7 max-sm:gap-2'>
                      <div className='border w-16 h-16 flex items-center justify-center rounded-full bg-white'>
                        <BuildingOffice2Icon className='w-10' />
                      </div>
                      <div className=''>
                        <h1 className='text-2xl font-semibold font text-zinc-600'>
                          {vagas.titulo}
                        </h1>
                        <h2 className='text-xl text-zinc-500'>
                          {vagas.empresa}
                        </h2>
                      </div>
                    </div>

                    <div className='w-1/5 max-sm:w-full h-full content-center'>
                      <Link to={`/candidatura/${candidatura.id}`}>
                        <button className='w-full z-[100] rounded-xl py-1 cursor-pointer bg-zinc-200 button-decor'>Ver Vaga</button>
                      </Link>
                    </div>

                  </div>


                </div>

                <div>
                  <span className='max-sm:hidden text-zinc-300'>
                    <hr />
                  </span>
                </div>

              </>

            )
          })}


        </section>

      </div>
    </>
  )
}
