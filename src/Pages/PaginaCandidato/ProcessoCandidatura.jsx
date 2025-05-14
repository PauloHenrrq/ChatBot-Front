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
  const [candidatura, setCandidatura] = useState(null)
  const [vagaDetalhada, setVagaDetalhada] = useState([])
  const [status, setStatus] = useState(null)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    const carregarCandidatura = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const decoded = jwtDecode(token)
        const userId = decoded.data.id

        const response = await api.get(`/candidaturas/${vagaId}`)
        const candidaturaEncontrada = response.data.details

        if (
          !candidaturaEncontrada ||
          candidaturaEncontrada.userId === undefined
        ) {
          console.warn('Candidatura inválida ou não encontrada')
          return
        }

        if (candidaturaEncontrada.userId !== userId) {
          console.warn('Usuário não autorizado a ver esta vaga')
          return navigate('/minhas-vagas')
        }

        setCandidatura(candidaturaEncontrada)
        setStatus(candidaturaEncontrada.status)
      } catch (error) {
        console.error('Erro ao carregar a candidatura:', error)
        return navigate('/minhas-vagas')
      }
    }

    carregarCandidatura()
  }, [vagaId])

  useEffect(() => {
    if (!candidatura) {
      return
    } else {
      const carregarVaga = async () => {
        try {
          const response = await api.get(`vagas/${candidatura.vagaId}`)
          setVagaDetalhada(response.data.details)
        } catch (error) {
          console.error('Nenhuma vaga para retornar', error)
        }
      }

      carregarVaga()
    }
  }, [candidatura])

  useEffect(() => {
    if (status === 'Contratado') {
      setModal(true)
    }
  }, [status])

  const statusEtapas = ['Em análise', 'Aprovado para entrevista', 'Contratado']
  const etapaAtual = statusEtapas.indexOf(status)

  const vagaInfo = [
    { select: 'empresa', className: 'text-gray-700 mb-6 text-lg', icon: '🏢 ' },
    {
      isH3: true,
      text: '📍 CEP:',
      className: 'font-semibold text-lg'
    },
    { select: 'cep', className: 'text-gray-700 mb-1 text-lg' },
    {
      isH3: true,
      text: '📝 Descrição:',
      className: 'font-semibold text-lg'
    },
    { select: 'descricao', className: 'text-gray-700 mb-4 text-lg' },
    {
      isH3: true,
      text: '💼 Responsabilidades:',
      className: 'font-semibold text-lg'
    },
    {
      isUL: true,
      select: 'responsabilidades'
    },
    { isH3: true, text: '📌 Requisitos:' },
    {
      isUL: true,
      select: 'requisitos'
    },
    { isH3: true, text: '🎁 Benefícios:', className: 'font-semibold text-lg' },
    {
      isUL: true,
      select: 'beneficios'
    },
    {
      select: 'salario',
      strong: <strong>Salário: </strong>,
      className: 'text-gray-700 mt-2 text-lg',
      icon: '💰 '
    },
    {
      select: 'informacoes_adicionais',
      strong: <strong>Informações adicionais: </strong>,
      className: 'text-gray-700 mt-1 text-lg',
      icon: '📎 '
    }
  ]

  return (
    <>
      <HeaderCandidato />

      <h1 className='text-gray-800 font-semibold flex justify-center items-end mb-5 max-md:mt-5 min-md:m-20 min-md:text-4xl max-md:text-2xl'>
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

      <div className='flex flex-col min-md:items-center min-md:justify-center min-md:gap-10 px-4'>
        <div className='p-6 max-md:mb-10'>
          <div className='relative min-md:w-[28rem] min-md:h-3 bg-neutral-200 dark:bg-neutral-600 rounded-full max-md:w-5 max-md:h-100'>
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

            <div className='absolute left-0 h-100 w-full max-md:flex max-md:flex-col max-md:justify-between max-md:items-center min-md:flex min-md:flex-row min-md:items-center min-md:justify-between min-md:top-1/2 min-md:-translate-y-1/2'>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={
                    index === 3
                      ? index === 3 && status === 'Contratado'
                        ? 'w-10 h-10 rounded-full bg-white border-2 border-green-400 cursor-pointer toBigInfinite'
                        : 'w-10 h-10 rounded-full bg-white border-2 border-zinc-400'
                      : `w-10 h-10 rounded-full ${
                          status === 'Reprovado'
                            ? 'bg-neutral-400'
                            : index <= etapaAtual
                            ? 'bg-green-500'
                            : 'bg-neutral-400'
                        }`
                  }
                  onClick={() => setModal(true)}
                >
                  {index === 3 && (
                    <HandThumbUpIcon
                      className={`${
                        status === 'Contratado'
                          ? 'stroke-green-600 toBig'
                          : 'stroke-zinc-400'
                      } w-9`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className='min-md:absolute flex min-md:justify-evenly min-md:w-full min-md:mt-5 max-md:ml-10 max-md:gap-5 max-md:flex-col max-md:justify-evenly'>
              {statusEtapas.map((stats, index) => (
                <p
                  key={index}
                  className={status === stats ? 'text-black' : 'text-zinc-300'}
                >
                  {stats}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className='bg-zinc-100 rounded-2xl p-10 min-md:w-[60rem] max-md:p-2 mb-5'>
          <h1 className='text-center font-semibold text-4xl mb-7 max-md:text-3xl'>
            Informações da vaga
          </h1>
          <h2 className='text-2xl font-bold text-zinc-900'>
            {vagaDetalhada.titulo}
          </h2>
          {vagaInfo.map((vaga, index) => {
            if (vaga.isH3) {
              return (
                <h3 key={index} className={vaga.className}>
                  {vaga.text}
                </h3>
              )
            } else if (vaga.isUL) {
              return (
                <ul key={index} className='list-disc list-inside mb-2'>
                  {vagaDetalhada[vaga.select]?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )
            } else if (vaga.select) {
              return (
                <p key={index} className={vaga.className}>
                  {vaga.icon}
                  {vaga.strong}
                  {vagaDetalhada[vaga.select]}
                </p>
              )
            }
          })}
        </div>
      </div>

      {/* Modal de sucesso */}
      {modal && status === 'Contratado' && (
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
              <h2 className='text-center text-zinc-100 font-semibold'>
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
