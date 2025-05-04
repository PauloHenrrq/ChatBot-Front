import { useState, useEffect } from 'react'
import { api } from '../Routes/server/api'
import Header from '../Layout/Header'
import FecharModal from './FecharModal.jsx'

export default function CadastroLoginAdm () {
  const formatarData = () => {
    const data = editUser.data_nascimento

    if (!data) return ''

    if (data.includes('/')) {
      const partes = data.split('/')
      if (partes.length !== 3) return ''
      const [dia, mes, ano] = partes
      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
    }

    return data
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    data_nascimento: '',
    password: ''
  })

  const [inputModify, setInputModify] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [valorInicialNascimento, setValorInicialNascimento] = useState('')

  useEffect(() => {
    if (showModal) {
      api
        .get('/users')
        .then(res => {
          setUsuarios(res.data)
        })
        .catch(error => {
          console.error('Erro ao buscar usuários:', error)
        })
    }
  }, [showModal])

  useEffect(() => {
    if (!editUser) {
      setInputModify('password')
    }
  }, [!editUser])

  useEffect(() => {
    if (editUser?.data_nascimento) {
      setValorInicialNascimento(editUser.data_nascimento)
    }
  }, [editUser])

  const handleDelete = async id => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      await api.delete(`/users/${id}`)
      setUsuarios(prev => prev.filter(u => u.id !== id))
    }
  }

  const handleEdit = user => {
    setEditUser({ ...user }) // adaptando para form
  }

  const handleUpdateChange = e => {
    const { name, value } = e.target

    if (name === 'data_nascimento' && value) {
      const [ano, mes, dia] = value.split('-')
      const formatado = `${dia}/${mes}/${ano}`
      setEditUser(prev => ({ ...prev, [name]: formatado }))
    } else {
      setEditUser(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleUpdate = async () => {
    try {
      const updatedUser = {
        ...editUser
      }
      await api.put(`/users/${editUser.id}`, updatedUser)
      alert('Usuário atualizado com sucesso!')
      setEditUser(null)
      setShowModal(false)
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      alert('Erro ao atualizar o usuário.')
    }
  }

  const handleChange = e => {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await api.post('/users', {
        ...formData,
        role: 'admin'
      })
      alert('Administrador cadastrado com sucesso!')
      setFormData({
        name: '',
        email: '',
        data_nascimento: '',
        password: ''
      })
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
      alert('Erro ao cadastrar administrador.')
    }
  }

  const cadastroMap = [
    { type: 'text', name: 'name', placeholder: 'Nome' },
    { type: 'email', name: 'email', placeholder: 'Email' },
    { type: 'date', name: 'data_nascimento', placeholder: '' },
    { type: 'password', name: 'password', placeholder: '**********' }
  ]

  return (
    <div className='min-h-screen bg-gray-100'>
      <Header />
      <div className='max-w-xl mx-auto p-6 bg-white mt-6 rounded-lg shadow-md'>
        <h2 className='text-2xl font-semibold mb-4 text-orange-500'>
          Cadastro de Administrador
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {cadastroMap.map((cad, index) => (
            <input
              key={index}
              type={cad.type}
              name={cad.name}
              value={formData[cad.name]}
              onChange={handleChange}
              placeholder={cad.placeholder}
              className={
                index === 3 && formData.password.length < 6
                  ? 'w-full p-2 border rounded m-0'
                  : 'w-full p-2 border rounded'
              }
              required
            />
          ))}

          {formData.password.length < 6 ? (
            <p className='text-red-600'>
              A senha precisa conter 6 ou mais caracteres
            </p>
          ) : null}

          <button
            disabled={formData.password.length < 6}
            type='submit'
            className={`bg-orange-500 hover:bg-orange-600 text-white w-full p-2 rounded cursor-pointer ${
              formData.password.length >= 6 ? 'mt-4' : null
            }`}
          >
            Cadastrar Administrador
          </button>
        </form>
      </div>

      {/* Botão Flutuante */}
      <button
        onClick={() => {
          setShowModal(true)
        }}
        className='cursor-pointer fixed bottom-6 right-6 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-orange-600 transition'
      >
        Gerenciar Usuários
      </button>

      {/* Modal de Listagem */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          {editUser ? null : (
            <FecharModal
              nomeModal={showModal}
              className='bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-lg relative'
              setNomeModal={setShowModal}
            >
              <h2 className='text-xl font-bold text-orange-500 mb-4'>
                Usuários Cadastrados
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className='cursor-pointer absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded font-bold'
              >
                X
              </button>

              {usuarios.length === 0 ? (
                <p className='text-gray-600'>Nenhum usuário encontrado.</p>
              ) : (
                <ul className='space-y-4'>
                  {usuarios.map(user => (
                    <li
                      key={user.id}
                      className='bg-gray-100 p-4 rounded flex justify-between items-center'
                    >
                      <div>
                        <p className='font-semibold'>{user.name}</p>
                        <p className='text-sm text-gray-600'>{user.email}</p>
                        <p className='text-sm text-gray-500'>
                          Role: {user.role}
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => handleEdit(user)}
                          className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer'
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer'
                        >
                          Deletar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </FecharModal>
          )}
        </div>
      )}

      {/* Modal de Edição */}
      {editUser && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <FecharModal
            nomeModal={editUser}
            className='bg-white p-6 rounded-lg max-w-lg w-full shadow-lg relative'
            setNomeModal={setEditUser}
          >
            <h2 className='text-xl font-bold text-blue-500 mb-4'>
              Editar Usuário
            </h2>
            <button
              onClick={() => setEditUser(null)}
              className='cursor-pointer absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded font-bold'
            >
              X
            </button>

            <div className='space-y-3'>
              {cadastroMap.map((cad, index) => {
                return (
                  <div key={index}>
                    <input
                      name={cad.name}
                      type={
                        inputModify === 'text' && index === 3
                          ? 'text'
                          : cad.type
                      }
                      value={
                        cad.type === 'date'
                          ? formatarData()
                          : cad.type != 'password' 
                          ? editUser[cad.name]
                          : cad.type === 'password'
                          ? null
                          : editUser[cad.name] === 'password'
                      }
                      placeholder={cad.placeholder}
                      onChange={handleUpdateChange}
                      className={
                        index === 3 && editUser.password.length < 6
                          ? 'w-full p-2 border rounded m-0'
                          : 'w-full p-2 border rounded'
                      }
                    />
                    {index === 3 ? (
                      <p
                        className='absolute right-8 bottom-21.5 cursor-pointer'
                        onClick={() => {
                          inputModify === 'text'
                            ? setInputModify('password')
                            : setInputModify('text')
                        }}
                      >
                        {inputModify === '' || inputModify === 'text'
                          ? '👁'
                          : '🙈'}
                      </p>
                    ) : null}
                  </div>
                )
              })}
              {editUser.password.length < 6 ? (
                <p className='text-red-600'>
                  A senha precisa conter 6 ou mais caracteres
                </p>
              ) : null}

              <button
                disabled={editUser.password.length < 6}
                onClick={handleUpdate}
                className={
                  editUser.password.length >= 6
                    ? 'cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded'
                    : 'w-full bg-blue-300 text-white p-2 rounded'
                }
              >
                Salvar Alterações
              </button>
            </div>
          </FecharModal>
        </div>
      )}
    </div>
  )
}
