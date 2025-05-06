import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa'
import { api } from '../../Routes/server/api'

export default function BarraPesquisa ({ onSearch }) {
  const [termo, setTermo] = useState('')
  const [localizacao, setLocalizacao] = useState('')
  const [sugestoesVagas, setSugestoesVagas] = useState([]) // Sugestões de vagas
  const [sugestoesLocal, setSugestoesLocal] = useState([]) // Sugestões de localizações
  const [mostrarSugestoesVagas, setMostrarSugestoesVagas] = useState(false)
  const [mostrarSugestoesLocal, setMostrarSugestoesLocal] = useState(false)

  // Buscar sugestões de vagas conforme o usuário digita
  const buscarSugestoesVagas = async valor => {
    if (valor.length < 1) {
      setSugestoesVagas([])
      return
    }

    try {
      const response = await api.get(`/vagas`)
      const vagaFiltrada = response.data.filter(vaga => {
        const campos = [vaga.titulo, vaga.empresa]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return campos.includes(termo.toLowerCase())
      })
      setSugestoesVagas(vagaFiltrada)
      setMostrarSugestoesVagas(true)
    } catch (error) {
      console.error('Erro ao buscar sugestões de vagas:', error)
    }
  }

  // Buscar sugestões de localizações
  const buscarSugestoesLocal = async valor => {
    if (valor.length < 1) {
      setSugestoesLocal([])
      return
    }

    try {
      const response = await api.get(`/vagas`)
      // Filtra localizações únicas
      const locaisUnicos = [
        ...new Set(response.data.map(vaga => vaga.localizacao))
      ]
      const localFiltrado = locaisUnicos.filter(local =>
        local.toLowerCase().includes(valor.toLowerCase())
      )
      setSugestoesLocal(localFiltrado)
      setMostrarSugestoesLocal(true)
    } catch (error) {
      console.error('Erro ao buscar sugestões de localizações:', error)
    }
  }

  // Buscar vagas ao clicar no botão
  const buscarVagas = async () => {
    try {
      const response = await api.get(`/vagas`)

      const normalizarTexto = (texto) => {
        return texto
          .toLowerCase()
          .normalize("NFD")                     
          .replace(/[\u0300-\u036f]/g, "")     
          .replace(/[^\w\s]/g, "")             
          .replace(/\s+/g, " ")                
          .trim();                             
      };
      
      const resultadoFiltrado = response.data.filter((vaga) => {
        const campos = normalizarTexto(
          [vaga.titulo, vaga.empresa].filter(Boolean).join(" ")
        );
      
        const palavrasDoTermo = normalizarTexto(termo).split(" ").filter(Boolean);
      
        const correspondeTermo = palavrasDoTermo.every(palavra =>
          campos.includes(palavra)
        );
      
        const correspondeLocalizacao = localizacao
          ? normalizarTexto(vaga.localizacao).includes(normalizarTexto(localizacao))
          : true;
      
        return correspondeTermo && correspondeLocalizacao;
      });
      onSearch(resultadoFiltrado)
      setMostrarSugestoesVagas(false)
      setMostrarSugestoesLocal(false)
    } catch (error) {
      console.error('Erro ao buscar vagas:', error)
    }
  }

  // Quando o usuário clicar em uma sugestão de vaga
  const selecionarSugestaoVaga = vaga => {
    setTermo(vaga.titulo + ' | ' + vaga.empresa)
    setSugestoesVagas([])
    setMostrarSugestoesVagas(false)
  }

  // Quando o usuário clicar em uma sugestão de local
  const selecionarSugestaoLocal = local => {
    setLocalizacao(local)
    setSugestoesLocal([])
    setMostrarSugestoesLocal(false)
  }

  return (
    <div className='relative w-full max-w-2xl mx-auto'>
      {/* Barra de pesquisa */}
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
          {/* Dropdown de sugestões de vagas */}
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
            placeholder='Localização'
            className='w-full outline-none'
            value={localizacao}
            onChange={e => {
              setLocalizacao(e.target.value)
              buscarSugestoesLocal(e.target.value)
            }}
          />
          {/* Dropdown de sugestões de localizações */}
          {mostrarSugestoesLocal && sugestoesLocal.length > 0 && (
            <ul className='absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg'>
              {sugestoesLocal.map((local, index) => (
                <li
                  key={index}
                  className='p-2 hover:bg-gray-200 cursor-pointer'
                  onClick={() => selecionarSugestaoLocal(local)}
                >
                  {local}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className='bg-orange-600 hover:bg-orange-700 text-white font-bold px-2 py-2 rounded-full ml-2 cursor-pointer'
          onClick={buscarVagas}
        >
          <MagnifyingGlassIcon aria-hidden="true" className="size-6 group-data-open:block" />
        </button>
      </div>
    </div>
  )
}
