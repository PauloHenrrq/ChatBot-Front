import HeaderCandidato from '../../Layout/HeaderCandidato'
import { useState, useEffect, useRef } from 'react'
import { api } from '../../Routes/server/api'
import BarraPesquisa from '../../Components/AreaUsuario/BarraPesquisa'
import FecharModal from '../../Components/FecharModal.jsx'
import 'animate.css'
import { jwtDecode } from 'jwt-decode'

const vagaMap = {
  part1: [{ type: 'text', name: 'telefone', placeholder: 'Telefone' }],
  part2: [
    { type: 'text', name: 'endereco.cep', placeholder: 'CEP' },
    { type: 'text', name: 'endereco.rua', placeholder: 'Rua' },
    { type: 'number', name: 'endereco.numero', placeholder: 'Número' },
    { type: 'text', name: 'endereco.bairro', placeholder: 'Bairro' },
    { type: 'text', name: 'endereco.cidade', placeholder: 'Cidade' },
    { type: 'text', name: 'endereco.estado', placeholder: 'Estado' }
  ]
}

export default function HomeCandidato () {
  const [vagasInicial, setVagasInicial] = useState([])
  const [vagas, setVagas] = useState([])
  const [vagaSelecionada, setVagaSelecionada] = useState(null)
  const [user, setUser] = useState([])
  const [cep, setCep] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [erro, setErro] = useState(null)
  const [formData, setFormData] = useState({
    telefone: '',
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    descricao: '',
    curriculo: null
  })

  useEffect(() => {
    if (!modalAberto) {
      setFormData({
        telefone: '',
        endereco: {
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: ''
        },
        descricao: '',
        curriculo: null
      })
    }
  }, [modalAberto])

  useEffect(() => {
    const carregarVagas = async () => {
      try {
        const response = await api.get('/vagas')
        if (response.data.details.length === 0) {
          setErro('Nenhuma vaga encontrada!')
          return
        }
        setVagas(response.data.details)
        setVagasInicial(response.data.details)
      } catch (error) {
        console.error('Vaga não encontrada')
      }
    }

    const carregarUserID = async () => {
      const token = localStorage.getItem('authToken')
      const decode = jwtDecode(token)
      const userID = decode.data.id
      try {
        const response = await api.get(`/users/${userID}`)
        setUser(response.data.details)
      } catch (error) {
        console.error('Usuário não encontrado', error)
      }
    }

    carregarVagas()
    carregarUserID()
  }, [])

  useEffect(() => {
    if (!vagaSelecionada) {
      return
    }

    const CEP = async () => {
      const isValidCEP = /^\d{5}-?\d{3}$/.test(vagaSelecionada.cep)

      if (!isValidCEP) {
        setCep({ logradouro: 'CPF não informado' })
        return
      }

      try {
        const response = await api.get(
          `https://viacep.com.br/ws/${vagaSelecionada.cep}/json/`
        )
        setCep(response.data)
      } catch (error) {
        console.error('CEP não encontrado!', error)
      }
    }

    CEP()
  }, [vagaSelecionada])

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : ''), obj)
  }

  const handleChange = e => {
    const { name, value } = e.target
    const keys = name.split('.')

    setFormData(prev => {
      const updated = { ...prev }
      let nested = updated

      for (let i = 0; i < keys.length - 1; i++) {
        if (!nested[keys[i]]) nested[keys[i]] = {}
        nested = nested[keys[i]]
      }

      nested[keys[keys.length - 1]] = value
      return updated
    })
  }

  useEffect(() => {
    const cepValue = formData?.endereco?.cep
    const isValidCEP = /^\d{5}-?\d{3}$/.test(cepValue)

    if (isValidCEP) {
      const buscarCEP = async () => {
        try {
          const response = await fetch(
            `https://viacep.com.br/ws/${cepValue}/json/`
          )
          const data = await response.json()

          if (!data.erro) {
            setFormData(prev => ({
              ...prev,
              endereco: {
                ...prev.endereco,
                rua: data.logradouro || '',
                bairro: data.bairro || '',
                cidade: data.localidade || '',
                estado: data.uf || ''
              }
            }))
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error)
        }
      }

      buscarCEP()
    }
  }, [formData?.endereco?.cep])

  const handleSubmit = async () => {
    if (!vagaSelecionada) {
      alert('Por favor, selecione uma vaga antes de se candidatar.')
      return
    }

    if (
      !formData.telefone ||
      !formData.endereco.cep ||
      !(formData.curriculo instanceof File)
    ) {
      alert('Preencha todos os campos obrigatórios.')
      return
    }

    const candidatura = new FormData()
    candidatura.append('userId', user.id)
    candidatura.append('vagaId', vagaSelecionada.id)
    candidatura.append('vagaTitulo', vagaSelecionada.titulo)
    candidatura.append('telefone', formData.telefone)
    candidatura.append('endereco', JSON.stringify(formData.endereco))
    candidatura.append('descricao', formData.descricao)
    candidatura.append('curriculo', formData.curriculo)
    candidatura.append('status', 'Em análise')

    try {
      await api.post('/candidaturas', candidatura)

      alert('Candidatura enviada com sucesso!')
      setModalAberto(false)
    } catch (error) {
      console.error('Erro ao enviar candidatura:', error)
      alert(
        error.response
          ? error.response.data.message
          : 'Erro ao enviar candidatura. Tente novamente.'
      )
    }
  }

  return (
    <>
      <HeaderCandidato />
      <div className='my-5'>
        <BarraPesquisa onSearch={setVagas} />
      </div>

      <div className='flex flex-col max-md:gap-6 md:flex-row min-h-screen p-4'>
        {/* Lista de Vagas */}
        <div className='md:w-1/2 bg-white shadow-md rounded-lg p-4 overflow-auto min-h-64'>
          <div className='flex justify-between mb-4'>
            <h2 className='text-xl font-bold'>Vagas Disponíveis</h2>
            <p
              className='underline cursor-pointer'
              onClick={() => {
                setVagas(vagasInicial)
              }}
            >
              Limpar filtros
            </p>
          </div>
          {erro ? (
            <div className='flex justify-center items-center h-1/2 min-h-44'>
              <p className='text-gray-400 font-bold text-xl min-lg:text-2xl'>
                {erro}
              </p>
            </div>
          ) : (
            vagas.map(vaga => (
              <a
                key={vaga.id}
                href='#vagaSelecionada'
                className='transition-all scroll-smooth duration-500 animate__animated animate__backInUp'
              >
                <div
                  className='p-4 mb-2 border rounded-lg cursor-pointer hover:bg-gray-200'
                  onClick={() => setVagaSelecionada(vaga)}
                >
                  <h3 className='text-lg font-semibold'>{vaga.titulo}</h3>
                  <p className='text-gray-600'>
                    {vaga.empresa} - {vaga.localizacao}
                  </p>
                  <p className='text-sm text-gray-500 mt-2'>{vaga.descricao}</p>
                </div>
              </a>
            ))
          )}
        </div>

        {/* Detalhes da Vaga */}
        <div
          className='md:w-2/3 md:ml-4 bg-white shadow-md rounded-lg p-6 md:overflow-auto w-auto md:max-h-screen'
          id='vagaSelecionada'
        >
          {vagaSelecionada ? (
            <>
              <h2 className='text-2xl font-bold'>{vagaSelecionada.titulo}</h2>
              <p className='text-gray-700 mt-2'>{vagaSelecionada.empresa} </p>
              <button
                className='mt-6 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 cursor-pointer'
                onClick={() => setModalAberto(true)}
              >
                Candidatar-se
              </button>

              <div className='mt-6 border-t pt-4'>
                <h3 className='text-lg font-semibold'>📍 CEP</h3>
                <p className='text-gray-600'>{cep.cep}</p>
                <p className='text-gray-600'>
                  {cep.erro
                    ? vagaSelecionada.cep
                    : `${cep.logradouro}, ${cep.bairro}`}
                </p>
                <p className='text-gray-600'>
                  {cep.erro ? null : `${cep.localidade} - ${cep.uf}`}
                </p>
              </div>

              <div className='mt-6 border-t pt-4'>
                <h3 className='text-lg font-semibold'>📝 Requisitos</h3>
                <ul className='list-disc pl-5 text-gray-600'>
                  {vagaSelecionada.requisitos?.length > 0 ? (
                    vagaSelecionada.requisitos.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))
                  ) : (
                    <p className='text-gray-500'>Nenhum requisito informado.</p>
                  )}
                </ul>
              </div>

              <div className='mt-6 border-t pt-4'>
                <h3 className='text-lg font-semibold'>🔹 Responsabilidades</h3>
                <ul className='list-disc pl-5 text-gray-600'>
                  {vagaSelecionada.responsabilidades?.length > 0 ? (
                    vagaSelecionada.responsabilidades.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))
                  ) : (
                    <p className='text-gray-500'>
                      Nenhuma responsabilidade informada.
                    </p>
                  )}
                </ul>
              </div>

              <div className='mt-6 border-t pt-4'>
                <h3 className='text-lg font-semibold'>🎁 Benefícios</h3>
                <ul className='list-disc pl-5 text-gray-600'>
                  {Array.isArray(vagaSelecionada.beneficios) &&
                  vagaSelecionada.beneficios.length > 0 ? (
                    vagaSelecionada.beneficios.map((beneficio, index) => (
                      <li key={index}>{beneficio}</li>
                    ))
                  ) : (
                    <p className='text-gray-500'>Nenhum benefício informado.</p>
                  )}
                </ul>
              </div>

              <div className='mt-6 border-t pt-4'>
                <h3 className='text-lg font-semibold'>💰 Salário</h3>
                <p className='text-green-600 text-lg font-semibold'>
                  {vagaSelecionada.salario || 'A combinar'}
                </p>
              </div>
            </>
          ) : (
            <p className='text-gray-500 text-center'>
              Selecione uma vaga para ver os detalhes.
            </p>
          )}
        </div>
      </div>

      {modalAberto && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 overflow-auto'>
          <FecharModal
            className='bg-white p-6 rounded-lg shadow-lg w-96 h-[90%] overflow-auto'
            nomeModal={modalAberto}
            setNomeModal={() => {
              setModalAberto(false)
              setFormData({
                telefone: '',
                endereco: {
                  rua: '',
                  numero: '',
                  bairro: '',
                  cidade: '',
                  estado: '',
                  cep: ''
                },
                descricao: '',
                curriculo: null
              })
            }}
          >
            <h2 className='text-xl font-bold'>Candidatar-se à vaga</h2>
            <p className='text-gray-700 mt-2'>{vagaSelecionada?.titulo}</p>
            {vagaMap.part1.map((input, index) => (
              <input
                key={index}
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
                value={formData[input.name]}
                onChange={handleChange}
                className='w-full mt-4 p-2 border rounded lg'
              />
            ))}

            <h3 className='text-lg font-semibold mt-4'>Endereço</h3>
            {vagaMap.part2.map((input, index) => (
              <input
                key={index}
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
                value={getNestedValue(formData, input.name)}
                onChange={handleChange}
                className='w-full mt-2 p-2 border rounded-lg'
              />
            ))}

            <h3 className='text-lg font-semibold mt-4'>Descrição</h3>
            <p className='text-sm text-gray-600'>
              Conte como você pode ajudar a empresa no desafio descrito na vaga.
            </p>
            {formData.descricao ? (
              <p className='flex justify-end text-sm text-gray-500 m-0'>
                {formData.descricao.length}/1400
              </p>
            ) : null}
            <textarea
              type='textarea'
              name='descricao'
              placeholder='Descrição sobre'
              onChange={handleChange}
              className={
                formData.descricao.length > 0
                  ? 'w-full mt-0 p-2 border rounded-lg'
                  : 'w-full mt-2 p-2 border rounded-lg'
              }
              maxLength={1400}
            />

            {/* Input para Upload do Currículo */}
            <h3 className='text-lg font-semibold mt-4'>
              📄 Anexar Currículo (PDF)
            </h3>
            <input
              type='file'
              accept='application/pdf'
              onChange={e => {
                if (e.target.files.length > 0) {
                  setFormData(prev => ({
                    ...prev,
                    curriculo: e.target.files[0] // Pegando o primeiro arquivo
                  }))
                }
              }}
              className='w-full mt-2 p-2 border rounded-lg'
            />

            <div className='flex justify-end mt-4'>
              <button
                className='px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg mr-2 cursor-pointer'
                onClick={() => setModalAberto(false)}
              >
                Cancelar
              </button>
              <button
                className='px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg cursor-pointer'
                onClick={handleSubmit}
              >
                Enviar
              </button>
            </div>
          </FecharModal>
        </div>
      )}
    </>
  )
}
