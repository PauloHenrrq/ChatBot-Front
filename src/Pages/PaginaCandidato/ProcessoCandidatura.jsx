import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../Routes/server/api'
import { jwtDecode } from 'jwt-decode'
import HeaderCandidato from '../../Layout/HeaderCandidato'
import { HandThumbUpIcon } from '@heroicons/react/24/outline'

export default function ProcessoCandidatura () {
  const { id: vagaId } = useParams() // O id aqui é o vagaId
  const navigate = useNavigate()
  const [vaga, setVaga] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const carregarVagas = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const decoded = jwtDecode(token)
        const userId = decoded.data.id

        const response = await api.get(`/candidaturas/${vagaId}`)
        const vagaEncontrada = response.data.details

        if (!vagaEncontrada || vagaEncontrada.userId === undefined) {
          console.warn('Candidatura inválida ou não encontrada')
          return
        }

        if (vagaEncontrada.userId !== userId) {
          console.warn('Usuário não autorizado a ver esta vaga')
          return navigate('/minhas-vagas')
        }

        setVaga(vagaEncontrada)
        setStatus(vagaEncontrada.status)
      } catch (error) {
        console.error('Erro ao carregar a candidatura:', error)
      }
    }

    carregarVagas()
  }, [vagaId])

  const statusEtapas = ['Em análise', 'Aprovado para entrevista', 'Contratado']
  const etapaAtual = statusEtapas.indexOf(status)

  return (
    <>
      <HeaderCandidato />
      <h1 className='text-3xl mb-5 text-gray-800 text-center font-semibold m-20'>
        Processo da candidatura ...
      </h1>
      <div className='p-6 flex justify-center'>
        <div className='relative w-7/12 h-3 mb-6 bg-neutral-200 dark:bg-neutral-600 rounded-full'>
          <div
            className={`absolute top-0 left-0 h-3 bg-green-400 rounded-full transition-all duration-500 ${
              status === 'Em análise'
                ? 'w-1/3'
                : status === 'Aprovado para entrevista'
                ? 'w-2/3'
                : status === 'Contratado'
                ? 'w-3/3'
                : status === 'Reprovado'
                ? 'w-0/3'
                : 'w-0/3'
            }`}
          ></div>

          <div className='absolute top-1/2 left-0 w-full flex justify-between items-center -translate-y-1/2'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={
                  index === 3
                    ? index === 3 && status === 'Contratado'
                      ? 'w-10 h-10 rounded-full bg-white border-2 border-green-400 toBigInfinite'
                      : 'w-9 h-9 rounded-full bg-white border-2 border-zinc-400'
                    : `w-9 h-9 rounded-full ${
                        status === 'Reprovado'
                          ? 'bg-neutral-400'
                          : index <= etapaAtual
                          ? 'bg-green-500'
                          : 'bg-neutral-400'
                      }`
                }
              >
                {index === 3 && status === 'Contratado' ? (
                  <HandThumbUpIcon className='stroke-green-600 toBig' />
                ) : index === 3 ? (
                  <HandThumbUpIcon className='stroke-zinc-400' />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
