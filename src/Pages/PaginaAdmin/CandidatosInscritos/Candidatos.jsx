import { useState, useEffect } from 'react'
import { api } from '../../../Routes/server/api.js'
import Header from '../../../Layout/Header.jsx'
import BuscaVaga from '../../../Components/AreaAdmin/BuscaVaga.jsx'
import FecharModal from '../../../Components/FecharModal.jsx'

export default function Candidatos() {
  const [candidatos, setCandidatos] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null)
  const [vagaDetalhada, setVagaDetalhada] = useState(null)
  const [aba, setAba] = useState('candidato')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    const carregarCandidatos = async () => {
      try {
        const response = await api.get('/candidaturas')
        setCandidatos(response.data)
      } catch (error) {
        console.error('Erro ao carregar candidatos:', error)
      }
    }

    carregarCandidatos()
  }, [])

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.patch(`/candidaturas/${id}`, { status: novoStatus })
      setCandidatos(prev =>
        prev.map(cand =>
          cand.id === id ? { ...cand, status: novoStatus } : cand
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status.')
    }
  }

  const abrirModal = async candidato => {
    setCandidatoSelecionado(candidato)
    setModalAberto(true)
    setAba('candidato')

    try {
      const response = await api.get(`/vagas/${candidato.vagaId}`)
      setVagaDetalhada(response.data)
      console.log(response.data)
    } catch (error) {
      console.error('Erro ao buscar detalhes da vaga:', error)
    }
  }

  const candidatosMap = {
    definicoes: ['Nome', 'Email', 'Vaga', 'Status', 'Ações'],
    options: [
      'Em análise',
      'Aprovado para entrevista',
      'Contratado',
      'Reprovado'
    ],
    abas: ['candidato', 'vaga'],
    candidato: {
      info: [
        { select: 'email', className: 'text-gray-700 mt-2', icon: '📧 ' },
        { select: 'telefone', className: 'text-gray-700 mt-2', icon: '📞 ' },
        {
          select: 'dataNascimento',
          className: 'text-gray-700 mt-2',
          icon: '📅 '
        },
        { isH3: true, text: '📌 Vaga Inscrita' },
        { select: 'vagaTitulo', className: 'text-gray-700 mt-2 font-bold' },
        { isH3: true, text: '📍 Endereço' },
        {
          end: true,
          select: ['rua', 'numero', 'bairro'],
          className: 'text-gray-700'
        },
        {
          end: true,
          select: ['cidade', 'estado', 'cep'],
          className: 'text-gray-700'
        }
      ],
      vaga: [
        { select: 'empresa', className: 'text-gray-700 mb-1', icon: '🏢 ' },
        { select: 'localizacao', className: 'text-gray-700 mb-1', icon: '📍 ' },
        { select: 'descricao', className: 'text-gray-700 mb-4', icon: '📝 ' },
        {
          isH3: true,
          text: '💼 Responsabilidades:',
          className: 'font-semibold'
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
        { isH3: true, text: '🎁 Benefícios:', className: 'font-semibold' },
        {
          isUL: true,
          select: 'beneficios'
        },
        { select: 'salario', strong: <strong>Salário: </strong>, className: 'text-gray-700 mt-2', icon: '💰 ' },
        {
          select: 'informacoes_adicionais',
          strong: <strong>Informações adicionais: </strong>,
          className: 'text-gray-700 mt-1',
          icon: '📎 '
        }
      ]
    }
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <Header />

      {/* Barra de Pesquisa */}

      <div className='w-full flex flex-col items-center justify-center mt-6 gap-4 border-b border-zinc-300 pb-8 '>
        <h1 className='text-2xl font-semibold'>Filtre aqui os candidatos.</h1>
        <BuscaVaga candidatos={candidatos} busca={busca} setBusca={setBusca} />
      </div>

      {/* Tabela de usuários */}

      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Candidatos Inscritos</h2>

        {/* Tabela para telas grandes */}
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full border bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-orange-500 text-white">
              <tr>
                {candidatosMap.definicoes.map((def, index) => (
                  <th className="p-3" key={index}>
                    {def}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidatos
                .filter(cand =>
                  cand.vagaTitulo.toLowerCase().includes(busca.toLowerCase())
                )
                .map(cand => (
                  <tr key={cand.id} className="border-b">
                    <td className="p-3 whitespace-nowrap">{cand.nome}</td>
                    <td className="p-3 whitespace-nowrap">{cand.email}</td>
                    <td className="p-3 whitespace-nowrap">{cand.vagaTitulo}</td>
                    <td className="p-3">
                      <select
                        className="border p-1 rounded w-full cursor-pointer"
                        value={cand.status || 'Em análise'}
                        onChange={e => atualizarStatus(cand.id, e.target.value)}
                      >
                        {candidatosMap.options.map((opt, index) => (
                          <option value={opt} key={index}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        className="bg-orange-500 hover:bg-orange-400 transition-all text-white px-3 py-1 rounded w-full"
                        onClick={() => abrirModal(cand)}
                      >
                        Visualizar Currículo
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Layout em cards para telas pequenas */}
        <div className="md:hidden space-y-4">
          {candidatos
            .filter(cand =>
              cand.vagaTitulo.toLowerCase().includes(busca.toLowerCase())
            )
            .map(cand => (
              <div key={cand.id} className="rounded-lg p-2 shadow bg-white">
                <div className='bg-zinc-200 p-2 space-y-1 rounded-lg'>
                  <div className='flex p-2 bg-white rounded-t-lg'>
                    <p className='font-semibold w-[10%] max-sm:w-[20%]'>Nome:</p>
                    <p className='w-[90%]'> {cand.nome}</p>
                  </div>

                  <div className='flex p-2 bg-white'>
                    <p className='font-semibold w-[10%] max-sm:w-[20%]'>Email:</p>
                    <p className='w-[90%]'> {cand.email}</p>
                  </div>

                  <div className='flex p-2 bg-white rounded-b-lg'>
                    <p className='font-semibold w-[10%] max-sm:w-[20%]'>Vaga:</p>
                    <p className='w-[90%]'> {cand.vagaTitulo}</p>
                  </div>
                </div>
                
                
                <p className="mt-2"><span className="font-semibold">Status:</span></p>
                <select
                  className="border p-1 rounded w-full mt-1 cursor-pointer"
                  value={cand.status || 'Em análise'}
                  onChange={e => atualizarStatus(cand.id, e.target.value)}
                >
                  {candidatosMap.options.map((opt, index) => (
                    <option value={opt} key={index}>
                      {opt}
                    </option>
                  ))}
                </select>
                <button
                  className="bg-orange-500 hover:bg-orange-400 text-white px-3 py-2 rounded w-full mt-3 cursor-pointer"
                  onClick={() => abrirModal(cand)}
                >
                  Visualizar Currículo
                </button>
              </div>
            ))}
        </div>
      </div>


      {/* MODAL */}
      {modalAberto && candidatoSelecionado && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
          <FecharModal nomeModal={modalAberto && candidatoSelecionado} className='bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto' setNomeModal={setModalAberto && setCandidatoSelecionado}>
            <div className='flex justify-between mb-4'>
              {candidatosMap.abas.map((abas, index) => (
                <button
                  key={index}
                  onClick={() => setAba(abas)}
                  className={`px-4 py-2 rounded-lg cursor-pointer ${aba === abas ? 'bg-orange-500 text-white' : 'bg-gray-200'
                    }`}
                >
                  {abas.charAt(0).toUpperCase() + abas.slice(1)}
                </button>
              ))}
            </div>

            {aba === 'candidato' && (
              // Fazer Map:
              <div>
                <h2 className='text-xl font-bold'>
                  {candidatoSelecionado.nome}
                </h2>
                {candidatosMap.candidato.info.map((info, index) => {
                  if (info.end) {
                    return (
                      <p key={index} className={info.className}>
                        {info.select.map((number, index) => {
                          return (
                            <span key={index}>
                              {candidatoSelecionado.endereco[number]}
                              {number === 'cidade' ? ' - ' : ''}
                              {index < info.select.length - 1 &&
                                number !== 'cidade'
                                ? ', '
                                : ''}
                            </span>
                          )
                        })}
                      </p>
                    )
                  } else if (info.select) {
                    return (
                      <p key={index} className={info.className}>
                        {info.icon} {candidatoSelecionado[info.select]}
                      </p>
                    )
                  } else if (info.isH3) {
                    return (
                      <h3 key={index} className='text-lg font-semibold mt-4'>
                        {info.text}
                      </h3>
                    )
                  }
                })}

                {candidatoSelecionado.curriculo && (
                  <div className='mt-4'>
                    <h3 className='text-lg font-semibold'>📄 Currículo</h3>
                    <a
                      href={candidatoSelecionado.curriculo}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 underline'
                    >
                      Visualizar Currículo
                    </a>
                  </div>
                )}
              </div>
            )}

            {aba === 'vaga' && vagaDetalhada && (
              <div>
                <h2 className='text-xl font-bold mb-2'>
                  {vagaDetalhada.titulo}
                </h2>
                {candidatosMap.candidato.vaga.map((vaga, index) => {
                  if (vaga.isH3) {
                    return (
                      <h3 className={vaga.className}>{vaga.text}</h3>
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
            )}

            <div className='flex justify-end mt-4'>
              <button
                className='px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg cursor-pointer'
                onClick={() => setModalAberto(false)}
              >
                Fechar
              </button>
            </div>
          </FecharModal>
        </div>
      )}
    </div>
  )
}
