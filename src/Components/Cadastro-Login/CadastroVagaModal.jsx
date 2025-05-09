import { useState } from 'react'
import { api } from '../../Routes/server/api'
import FecharModal from '../FecharModal.jsx'

export default function CadastroVagaModal () {
  const [mostrarCadastroModal, setMostrarCadastroModal] = useState(false)
  const [novaVaga, setNovaVaga] = useState({
    titulo: '',
    empresa: '',
    cep: '',
    descricao: '',
    requisitos: '',
    responsabilidades: '',
    beneficios: '',
    salario: '',
    informacoes_adicionais: ''
  })

  const handleChange = e => {
    setNovaVaga({ ...novaVaga, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const vagaFormatada = {
      ...novaVaga,
      requisitos: novaVaga.requisitos.split('\n').map(req => req.trim()),
      responsabilidades: novaVaga.responsabilidades
        .split('\n')
        .map(resp => resp.trim()),
      beneficios: novaVaga.beneficios.split('\n').map(ben => ben.trim())
    }

    try {
      await api.post('/vagas', vagaFormatada)
      alert('Vaga cadastrada com sucesso!')
      setMostrarCadastroModal(false)
    } catch (error) {
      console.error('Erro ao cadastrar vaga', error)
      alert('Erro ao cadastrar vaga.')
    }

    setTimeout(() => {
      window.location.reload()
    }, 200)
  }

  const formMap = [
    {
      className: 'grid grid-cols-2 gap-4',
      child: [
        {
          type: 'text',
          name: 'titulo',
          placeholder: 'Título da Vaga',
          className: 'col-span-2 bg-zinc-100 p-2 rounded-lg'
        },
        { type: 'text', name: 'empresa', placeholder: 'Empresa' },
        { type: 'text', name: 'cep', placeholder: 'CEP' }
      ]
    },
    {
      className: 'grid grid-cols-1 gap-4',
      child: [
        { name: 'descricao', placeholder: 'Descrição' },
        {
          name: 'requisitos',
          placeholder: 'Requisitos (separados por vírgula)'
        },
        {
          name: 'responsabilidades',
          placeholder: 'Responsabilidades (separados por vírgula)'
        },
        {
          name: 'beneficios',
          placeholder: 'Benefícios (separados por vírgula)'
        },
        { type: 'text', name: 'salario', placeholder: 'Salário' },
        {
          name: 'informacoes_adicionais',
          placeholder: 'Informações Adicionais'
        }
      ]
    }
  ]

  return (
    <>
      <button
        className='bg-orange-500 hover:bg-orange-600 transition-all px-5 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg cursor-pointer'
        onClick={() => setMostrarCadastroModal(true)}
      >
        Cadastrar Vaga
      </button>

      {mostrarCadastroModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 p-4 overflow-auto'>
          <FecharModal
            nomeModal={mostrarCadastroModal}
            className='bg-white p-6 rounded-lg shadow-lg max-w-lg w-full h-[80%] transition-all overflow-auto'
            setNomeModal={setMostrarCadastroModal}
          >
            <h3 className='text-xl font-bold text-center text-orange-600 mb-6'>
              Cadastrar Nova Vaga
            </h3>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {formMap.map((form, index) => (
                <div key={index} className={form.className}>
                  {form.child.map((child, index) => {
                    {
                      return !child.type ? (
                        <textarea
                          key={index}
                          type={child.type}
                          name={child.name}
                          placeholder={child.placeholder}
                          className={
                            child.className ? child.className : 'inputNovaVaga'
                          }
                          required
                          onChange={handleChange}
                        />
                      ) : (
                        <input
                          key={index}
                          type={child.type}
                          name={child.name}
                          placeholder={child.placeholder}
                          className={
                            child.className ? child.className : 'inputNovaVaga'
                          }
                          required
                          onChange={handleChange}
                        />
                      )
                    }
                  })}
                </div>
              ))}

              <button
                type='submit'
                className='bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg w-full cursor-pointer transition-all'
              >
                Cadastrar Vaga
              </button>
            </form>

            <button
              className='mt-4 bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-lg w-full cursor-pointer transition-all'
              onClick={() => setMostrarCadastroModal(false)}
            >
              Fechar
            </button>
          </FecharModal>
        </div>
      )}
    </>
  )
}
