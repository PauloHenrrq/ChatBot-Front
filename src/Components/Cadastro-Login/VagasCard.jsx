import { useEffect, useState } from 'react'
import { api } from '../../Routes/server/api'
import { Form, Formik, Field } from 'formik'
import * as Yup from 'yup'
import FecharModal from '../FecharModal.jsx'

export default function VagasCard () {
  const [modalAberto, setModalAberto] = useState(null)
  const [etapa, setEtapa] = useState(1)
  const [vagas, setVagas] = useState([])
  const [candidatura, setCandidatura] = useState([])
  const [erro, setErro] = useState(null)

  useEffect(() => {
    api
      .get('/vagas')
      .then(response => setVagas(response.data.details))
      .catch(err => {
        console.error('Erro ao buscar vagas:', err)
        setErro('Nenhuma vaga foi encontrada!')
      })
  }, [])

  async function delVagas (id) {
    try {
      const acharVaga = candidatura.find(cand => String(cand.vagaId) === id)
      await api.delete(`/vagas/${id}`)
      await api.delete(`/candidaturas/${acharVaga.id}`)
      alert('Vaga excluída com sucesso!')
      setVagas(prevVagas => prevVagas.filter(vaga => vaga.id !== id))
    } catch (error) {
      console.error('Erro ao excluir vaga', error)
    }
  }

  async function salvarDados (values) {
    if (!modalAberto || !modalAberto) {
      alert('Erro: ID da vaga não encontrado.')
      return
    }

    const idVaga = String(modalAberto) // Garante que o ID é string para compatibilidade com JSON Server

    try {
      const vagaExistente = vagas.find(vaga => String(vaga.id) === idVaga)
      const dadosFormatados = {
        ...vagaExistente, // Mantém os dados antigos
        ...values, // Atualiza os novos valores
        requisitos: values.requisitos
          ? values.requisitos.split('\n').filter(Boolean)
          : [],
        responsabilidades: values.responsabilidades
          ? values.responsabilidades.split('\n').filter(Boolean)
          : [],
        beneficios: values.beneficios
          ? values.beneficios.split('\n').filter(Boolean)
          : []
      }

      await api.put(`/vagas/${idVaga}`, dadosFormatados)

      alert('Vaga Atualizada com Sucesso.')

      setVagas(prevVagas =>
        prevVagas.map(vaga =>
          String(vaga.id) === idVaga ? { ...vaga, ...dadosFormatados } : vaga
        )
      )

      setTimeout(() => setModalAberto(null), 100)
      setEtapa(1)
    } catch (error) {
      console.error('Erro ao salvar dados', error)
      alert('Erro ao salvar dados. Tente novamente.')
    }
  }

  const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('Campo Obrigatório'),
    empresa: Yup.string().required('Campo Obrigatório'),
    localizacao: Yup.string().required('Campo Obrigatório'),
    descricao: Yup.string().required('Campo Obrigatório'),
    informacoes_adicionais: Yup.string().required('Campo Obrigatório'),
    requisitos: Yup.string().required('Campo Obrigatório'),
    responsabilidades: Yup.string().required('Campo Obrigatório'),
    beneficios: Yup.string().required('Campo Obrigatório'),
    salario: Yup.string().required('Campo Obrigatório')
  })

  const vagaMap = {
    part1: [
      { label: 'Cargo', type: 'text', name: 'titulo', className: 'fieldText' },
      {
        label: 'Nome Empresarial',
        type: 'text',
        name: 'empresa',
        className: 'fieldText'
      },
      {
        label: 'Localização',
        type: 'text',
        name: 'localizacao',
        className: 'fieldText'
      },
      {
        label: 'Descrição',
        as: 'textarea',
        name: 'descricao',
        className: 'fieldArea'
      }
    ],
    part2: ['Requisitos', 'Responsabilidades', 'Beneficios'],
    part3: [
      {
        label: 'Salário',
        type: 'text',
        name: 'salario',
        className: 'fieldText'
      },
      {
        label: 'Informações Adicionais',
        as: 'textarea',
        name: 'informacoes_adicionais',
        className: 'fieldArea'
      }
    ]
  }

  return (
    <div
      className={
        !erro
          ? 'h-full grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 mx-auto gap-5'
          : 'h-full max-sm:grid-cols-1 mx-auto gap-5'
      }
    >
      {erro ? (
        <div className='flex justify-center items-center h-1/2 min-h-44'>
          <p className='text-gray-400 font-bold text-lg min-lg:text-2xl'>
            {erro}
          </p>
        </div>
      ) : (
        Array.isArray(vagas) && vagas.map(vaga => (
          <div
            className='bg-gradient-to-b from-orange-200 to-white shadow-md rounded-lg p-4 w-full max-w-md flex flex-col justify-between mx-auto'
            key={vaga.id}
          >
            <div className='flex flex-col items-start h-fit'>
              <h3 className='text-xl font-semibold'>{vaga.titulo}</h3>
              <h1 className='text-gray-600'>{vaga.empresa}</h1>
            </div>
            <p className='text-gray-500 mt-2'>{vaga.descricao}</p>

            <div className='flex items-center justify-center h-fit mt-8'>
              <p className='text-gray-600 w-1/2'>{vaga.salario}</p>
              <button
                className='w-1/2 py-1 bg-orange-500 hover:bg-orange-400 text-white rounded cursor-pointer'
                onClick={() => setModalAberto(vaga.id)}
              >
                Editar
              </button>
            </div>

            {modalAberto === vaga.id && (
              <div className='fixed inset-0 flex items-center justify-center bg-black/40 px-4 overflow-auto'>
                <FecharModal
                  nomeModal={modalAberto}
                  className='bg-white p-8 rounded-2xl shadow-2xl max-w-5xl w-full h-[90%] flex flex-col justify-center relative overflow-auto'
                  setNomeModal={setModalAberto}
                >
                  <button
                    className='cursor-pointer absolute top-2 right-4 bg-red-500 text-white px-4 py-2 rounded font-bold'
                    onClick={() => {
                      setModalAberto(null)
                      setEtapa(1)
                    }}
                  >
                    X
                  </button>
                  <Formik
                    enableReinitialize
                    initialValues={{
                      titulo: vaga.titulo,
                      empresa: vaga.empresa,
                      localizacao: vaga.localizacao,
                      descricao: vaga.descricao,
                      salario: vaga.salario,
                      informacoes_adicionais: vaga.informacoes_adicionais,
                      requisitos: Array.isArray(vaga.requisitos)
                        ? vaga.requisitos.join('\n')
                        : '',
                      responsabilidades: Array.isArray(vaga.responsabilidades)
                        ? vaga.responsabilidades.join('\n')
                        : '',
                      beneficios: Array.isArray(vaga.beneficios)
                        ? vaga.beneficios.join('\n')
                        : ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={salvarDados}
                  >
                    <Form id='Form1' className='space-y-6 overflow-auto'>
                      {etapa === 1 ? (
                        <>
                          {vagaMap.part1.map((vaga, index) => (
                            <div key={index}>
                              <label
                                htmlFor={vaga.name}
                                className='text-xl font-medium'
                              >
                                {vaga.label}
                              </label>
                              {vaga.as ? (
                                <Field
                                  as={vaga.as}
                                  name={vaga.name}
                                  className={vaga.className}
                                />
                              ) : (
                                <Field
                                  type={vaga.type}
                                  name={vaga.name}
                                  className={vaga.className}
                                />
                              )}
                            </div>
                          ))}
                          <button
                            type='button'
                            onClick={() => {
                              setEtapa(2)
                              Form1.scrollTo({ top: 0 })
                            }}
                            className='bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-md w-full cursor-pointer'
                          >
                            Próximo
                          </button>
                        </>
                      ) : etapa === 2 ? (
                        <>
                          {vagaMap.part2.map((vaga, index) => (
                            <div key={index}>
                              <label
                                htmlFor={vaga.toLowerCase()}
                                className='text-xl font-medium'
                              >
                                {vaga}
                              </label>
                              <Field
                                as='textarea'
                                name={vaga.toLowerCase()}
                                className='fieldArea'
                              />
                            </div>
                          ))}
                          <div className='flex gap-3'>
                            <button
                              type='button'
                              onClick={() => setEtapa(1)}
                              className='bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-md w-1/2 cursor-pointer'
                            >
                              Voltar
                            </button>
                            <button
                              type='submit'
                              className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md w-1/2 cursor-pointer'
                            >
                              Salvar
                            </button>
                            <button
                              type='button'
                              onClick={() => setEtapa(3)}
                              className='bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-md w-1/2 cursor-pointer'
                            >
                              Próximo
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {vagaMap.part3.map((vaga, index) => (
                            <div key={index}>
                              <label
                                htmlFor={vaga.name}
                                className='text-xl font-medium'
                              >
                                {vaga.label}
                              </label>
                              <Field
                                type={vaga.type}
                                as={vaga.as}
                                name={vaga.name}
                                className={vaga.className}
                              />
                            </div>
                          ))}
                          <div className='flex gap-3'>
                            <button
                              type='button'
                              onClick={() => setEtapa(2)}
                              className='bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-md w-1/2 cursor-pointer'
                            >
                              Voltar
                            </button>
                            <button
                              type='submit'
                              className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md cursor-pointer w-full'
                            >
                              Salvar
                            </button>
                          </div>
                        </>
                      )}
                    </Form>
                  </Formik>
                  <button
                    className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md w-full mt-4 cursor-pointer'
                    onClick={() => delVagas(vaga.id)}
                  >
                    Deletar
                  </button>
                </FecharModal>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
