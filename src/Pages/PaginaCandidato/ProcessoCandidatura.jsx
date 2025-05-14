import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../Routes/server/api'
import { jwtDecode } from 'jwt-decode'
import HeaderCandidato from '../../Layout/HeaderCandidato'
import { HandThumbUpIcon } from '@heroicons/react/24/outline'
import FecharModal from '../../Components/FecharModal'

export default function ProcessoCandidatura () {
  const { id: vagaId } = useParams()
  const navigate = useNavigate()
  const [vaga, setVaga] = useState(null)
  const [status, setStatus] = useState(null)
  const [modal, setModal] = useState(false)

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
        return navigate('/minhas-vagas')
      }
    }

    carregarVagas()
  }, [vagaId])

  useEffect(() => {
    if (status === 'Contratado') {
      setModal(true)
    }
  }, [status])

  const statusEtapas = ['Em análise', 'Aprovado para entrevista', 'Contratado']
  const etapaAtual = statusEtapas.indexOf(status)

  return (
    <>
      <HeaderCandidato />
      <h1 className='min-md:text-4xl max-md:text-2xl mb-5 max-md:mt-5 text-gray-800 font-semibold min-md:m-20 flex justify-center items-end'>
        Processo da candidatura&nbsp;
        {Array.from({ length: 3 }).map((_, index) => (
          <span
            key={index}
            className='upDown'
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            .
          </span>
        ))}
      </h1>
      <div className='p-6 min-md:flex min-md:justify-center max-md:flex-col max-md:absolute max-md:left-5'>
        <div className='relative min-md:w-7/12 min-md:h-3 min-md:mb-6 bg-neutral-200 dark:bg-neutral-600 rounded-full max-md:w-5 max-md:h-100'>
          <div
            className={`absolute top-0 left-0 max-md:w-5 min-md:h-3 bg-green-400 rounded-full transition-all duration-500 ${
              status === 'Em análise'
                ? 'min-md:w-1/3 max-md:h-35'
                : status === 'Aprovado para entrevista'
                ? 'min-md:w-2/3 max-md:h-70'
                : status === 'Contratado'
                ? 'min-md:w-3/3 max-md:h-100'
                : status === 'Reprovado'
                ? 'min-md:w-0/3 max-md:h-35'
                : 'min-md:w-0/3 max-md:h-35'
            }`}
          ></div>

          <div
            className='absolute left-0 h-100 w-full 
                       max-md:flex max-md:flex-col max-md:justify-between max-md:items-center 
                       min-md:flex min-md:flex-row min-md:items-center min-md:justify-between 
                       min-md:top-1/2 min-md:-translate-y-1/2'
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={
                  index === 3
                    ? index === 3 && status === 'Contratado'
                      ? 'min-md:w-10 min-md:h-10 max-md:w-10 max-md:h-10 rounded-full bg-white border-2 border-green-400 cursor-pointer toBigInfinite'
                      : 'min-md:w-9 min-md:h-9 max-md:w-10 max-md:h-10 rounded-full bg-white border-2 border-zinc-400'
                    : `min-md:w-9 min-md:h-9 max-md:w-10  max-md:h-10 rounded-full ${
                        status === 'Reprovado'
                          ? 'bg-neutral-400'
                          : index <= etapaAtual
                          ? 'bg-green-500'
                          : 'bg-neutral-400'
                      }`
                }
                onClick={() => setModal(true)}
              >
                {index === 3 && status === 'Contratado' ? (
                  <HandThumbUpIcon className='stroke-green-600 toBig max-md:w-9' />
                ) : index === 3 ? (
                  <HandThumbUpIcon className='stroke-zinc-400 max-md:w-9' />
                ) : null}
              </div>
            ))}
          </div>
          <div className='min-md:absolute flex min-md:justify-evenly min-2xl:justify-between min-2xl:px-32 min-md:w-full min-md:mt-5 max-md:ml-10 max-md:w-30 max-md:h-100 max-md:gap-5 max-md:flex-col max-md:justify-evenly '>
            {statusEtapas.map((stats, index) => (
              <p
                key={index}
                className={
                  status === stats
                    ? 'text-black'
                    : 'text-zinc-300'
                }
              >
                {stats}
              </p>
            ))}
          </div>
        </div>
      </div>
      {(modal && status === 'Contratado') && (
        <div className='fixed top-0 right-0 bg-black/50 w-full h-screen'>
          <div className='flex h-full justify-center items-center'>
            <FecharModal
              nomeModal={modal}
              setNomeModal={setModal}
              className='bg-orange-500 max-w-1/3 max-md:max-w-2/3 text-wrap rounded-2xl p-6'
            >
              <h1
                className='text-center text-white font-bold text-2xl'
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                Parabéns!
              </h1>
              <h1
                className='text-center text-white font-bold mb-5 text-2xl'
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                Você foi escolhido para a vaga 🎉
              </h1>
              <h2 className='text-center text-zinc-100 font-semibold '>
                Fique atento, em breve entraremos em contato através do telefone
                informado na candidatura
              </h2>
            </FecharModal>
          </div>
        </div>
      )}
    </>
  )
}
