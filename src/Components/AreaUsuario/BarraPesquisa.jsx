import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa'
import { api } from '../../Routes/server/api'

export default function BarraPesquisa ({ onSearch }) {
  const [termo, setTermo] = useState('')
  const [cep, setCep] = useState('')
  const [sugestoesVagas, setSugestoesVagas] = useState([])
  const [sugestoesCep, setSugestoesCep] = useState([])
  const [mostrarSugestoesVagas, setMostrarSugestoesVagas] = useState(false)
  const [mostrarSugestoesCep, setMostrarSugestoesCep] = useState(false)

  const buscarSugestoesVagas = async valor => {
    if (valor.length < 1) {
      setSugestoesVagas([])
      return
    }

    try {
      const response = await api.get(`/vagas`)
      const todasVagas = response.data.details

      // Se o valor tiver só 1 caractere, mostra tudo
      if (valor.length === 1) {
        setSugestoesVagas(todasVagas)
        setMostrarSugestoesVagas(true)
        return
      }

      const termoNormalizado = valor.toLowerCase().trim()

      const vagaFiltrada = todasVagas.filter(vaga => {
        const campos = [vaga.titulo, vaga.empresa]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return campos.includes(termoNormalizado)
      })

      setSugestoesVagas(vagaFiltrada)
      setMostrarSugestoesVagas(true)
    } catch (error) {
      console.error('Erro ao buscar sugestões de vagas:', error)
    }
  }

  const buscarSugestoesCep = async valor => {
    if (valor.length < 1) {
      setSugestoesCep([])
      return
    }

    try {
      const response = await api.get(`/vagas`)
      const todasVagas = response.data.details

      const cepsUnicos = [
        ...new Set(todasVagas.map(vaga => vaga.cep).filter(Boolean))
      ]

      // Se só 1 caractere, mostra todos os CEPs únicos
      if (valor.length === 1) {
        setSugestoesCep(cepsUnicos)
        setMostrarSugestoesCep(true)
        return
      }

      const termo = valor.trim().replace('-', '').toLowerCase()

      const cepFiltrado = cepsUnicos.filter(cep =>
        cep.replace('-', '').toLowerCase().includes(termo)
      )

      setSugestoesCep(cepFiltrado)
      setMostrarSugestoesCep(true)
    } catch (error) {
      console.error('Erro ao buscar sugestões de CEPs:', error)
    }
  }

  const buscarVagas = async () => {
    try {
      const response = await api.get('/vagas')

      const normalizarTexto = texto => {
        return texto
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      }

      const resultadoFiltrado = response.data.details.filter(vaga => {
        const campos = normalizarTexto(
          [vaga.titulo, vaga.empresa].filter(Boolean).join(' ')
        )

        const palavrasDoTermo = normalizarTexto(termo)
          .split(' ')
          .filter(Boolean)

        const correspondeTermo = palavrasDoTermo.every(palavra =>
          campos.includes(palavra)
        )

        const correspondeCep = cep
          ? normalizarTexto(vaga.cep).includes(normalizarTexto(cep))
          : true

        return correspondeTermo && correspondeCep
      })

      onSearch(resultadoFiltrado)
      setMostrarSugestoesVagas(false)
      setMostrarSugestoesCep(false)
    } catch (error) {
      console.error('Erro ao buscar vagas:', error)
    }
  }

  const selecionarSugestaoVaga = vaga => {
    setTermo(`${vaga.titulo} | ${vaga.empresa}`)
    setSugestoesVagas([])
    setMostrarSugestoesVagas(false)
  }

  const selecionarSugestaoCep = cepSelecionado => {
    setCep(cepSelecionado)
    setSugestoesCep([])
    setMostrarSugestoesCep(false)
  }

  return (
    <div className='relative w-full max-w-2xl mx-auto'>
      <div className='flex items-center bg-white shadow-md rounded-full px-4 py-2 w-full'>
        <FaSearch className='text-gray-500 mx-2 text-3xl' />
        <div className='relative w-full'>
          <input
            type='text'
            placeholder='Cargo, palavras-chave ou empresa...'
            className='w-full outline-none'
            value={termo}
            onChange={e => {
              setTermo(e.target.value)
              buscarSugestoesVagas(e.target.value)
            }}
          />
          {mostrarSugestoesVagas && sugestoesVagas.length > 0 && (
            <ul className='absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg'>
              {sugestoesVagas.map((vaga, index) => (
                <li
                  key={index}
                  className='p-2 hover:bg-gray-200 cursor-pointer'
                  onClick={() => selecionarSugestaoVaga(vaga)}
                >
                  {vaga.titulo} - {vaga.empresa}
                </li>
              ))}
            </ul>
          )}
        </div>

        <span className='border-l h-6 mx-2'></span>
        <FaMapMarkerAlt className='text-gray-500 mx-2 text-3xl' />
        <div className='relative w-full'>
          <input
            type='text'
            placeholder='Digite o CEP...'
            className='w-full outline-none'
            value={cep}
            onChange={e => {
              setCep(e.target.value)
              buscarSugestoesCep(e.target.value)
            }}
          />
          {mostrarSugestoesCep && sugestoesCep.length > 0 && (
            <ul className='absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg'>
              {sugestoesCep.map((cepItem, index) => (
                <li
                  key={index}
                  className='p-2 hover:bg-gray-200 cursor-pointer'
                  onClick={() => selecionarSugestaoCep(cepItem)}
                >
                  {cepItem}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className='bg-orange-600 hover:bg-orange-700 text-white font-bold px-2 py-2 rounded-full ml-2 cursor-pointer'
          onClick={buscarVagas}
        >
          <MagnifyingGlassIcon
            aria-hidden='true'
            className='size-6 group-data-open:block'
          />
        </button>
      </div>
    </div>
  )
}
