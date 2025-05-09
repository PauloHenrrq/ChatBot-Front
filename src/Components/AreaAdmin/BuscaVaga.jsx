// components/BuscaVaga.js
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { useEffect, useState } from 'react'
import FecharModal from '../FecharModal'

export default function BuscaVaga ({ candidatos, busca, setBusca }) {
  const [sugestoes, setSugestoes] = useState([])

  useEffect(() => {
    const vagasUnicas = [...new Set(candidatos.map(c => c.vagaTitulo))]
    const filtradas = vagasUnicas.filter(vaga =>
      vaga.toLowerCase().includes(busca.toLowerCase())
    )
    setSugestoes(busca ? filtradas : [])
  }, [busca, candidatos])

  useEffect(() => {
    (sugestoes)
  }, [busca, candidatos])

  return (
    <FecharModal
      className='mb-4 flex justify-center items-center relative w-full max-w-md'
      nomeModal={sugestoes}
      setNomeModal={setSugestoes}
    >
      <input
        type='text'
        placeholder='Buscar por vaga...'
        value={busca}
        onChange={e => setBusca(e.target.value)}
        className='sm:w-full max-sm:w-[80%] p-2 border border-gray-300 outline-gray-400 rounded-t-md shadow-sm'
      />
      <MagnifyingGlassIcon
        aria-hidden='true'
        className='flex size-8 absolute sm:right-1 right-12 fill-orange-600'
      />
      {sugestoes.length > 0 && (
        <ul className='absolute z-10 top-10 bg-white border border-gray-300 rounded-b-md sm:w-full w-[80%] max-h-48 overflow-y-auto shadow-lg'>
          {sugestoes.map((sugestao, index) => (
            <li
              key={index}
              onClick={() => {
                setBusca(sugestao)
              }}
              className='p-2 cursor-pointer hover:bg-orange-100'
            >
              {sugestao}
            </li>
          ))}
        </ul>
      )}
    </FecharModal>
  )
}
