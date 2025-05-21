import { Field, Form, Formik } from 'formik'
import HeaderCandidato from '../../Layout/HeaderCandidato'
import { UserIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { api } from '../../Routes/server/api'
import { useNavigate } from 'react-router-dom'

export default function Perfil () {
  const [img, setImg] = useState(null)
  const [viewImg, setViewImg] = useState(null)
  const [user, setUser] = useState(null)
  const [social, setSocial] = useState({})
  const fileInputRef = useRef()

  const navigate = useNavigate()

  const token = localStorage.getItem('authToken')
  const decodeToken = jwtDecode(token)
  const userId = decodeToken.data.id

  useEffect(() => {
    const getCandidato = async () => {
      try {
        const response = await api.get(`/users/${userId}`)
        console.log(response.data.details)
        setUser(response.data.details)
        setImg(response.data.details.img)
      } catch (error) {
        console.error('Erro ao retornar o usuário:', error)
      }
    }

    const getSocial = async () => {
      try {
        const response = await api.get(`/social/${userId}`)
        console.log(response.data.details)
        setSocial(response.data.details)
      } catch (error) {
        return
      }
    }

    getCandidato()
    getSocial()
  }, [])

  const handleSubmit = async values => {
    try {
      const formData = new FormData()

      formData.append('nome', values.nome)
      formData.append('email', values.email)
      formData.append('bio', values.bio)

      if (fileInputRef.current.files[0]) {
        formData.append('img', fileInputRef.current.files[0])
      }

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }

      await api.put(`/users/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      await api.put(`/social/${userId}`, {
        linkedin: values.linkedin,
        github: values.github
      })

      alert('Atualizações enviadas!')
      navigate('/home')
    } catch (error) {
      console.error('Ocorreu um erro ao enviar as atualizações', error)
      alert('Erro ao atualizar perfil. Tente novamente.')
    }
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      setViewImg(URL.createObjectURL(file))
    }
  }

  const infoData = [
    {
      label: 'Nome',
      type: 'text',
      name: 'nome',
      placeholder: 'Insira seu nome'
    },
    {
      label: 'Email',
      type: 'email',
      name: 'email',
      placeholder: 'Insira seu email'
    },
    {
      label: 'LinkedIn',
      type: 'url',
      name: 'linkedin',
      placeholder: 'Insira seu LinkedIn'
    },
    {
      label: 'GitHub',
      type: 'url',
      name: 'github',
      placeholder: 'Insira seu GitHub'
    }
  ]

  const formData = {
    nome: user?.name || '',
    email: user?.email || '',
    bio: user?.bio ?? '',
    img: user?.img ?? '',
    linkedin: social?.linkedin || '',
    github: social?.github || ''
  }

  return (
    <>
      <HeaderCandidato />

      {(user && social) ? (
        <Formik initialValues={formData} onSubmit={handleSubmit}>
          <div className='mx-auto my-5 w-1/2 max-sm:w-11/12 max-md:w-5/6'>
            <Form className='px-10 py-5 flex flex-col flex-wrap bg-white rounded-lg'>
              <div className='flex flex-col gap-5'>
                <div className='flex m-auto justify-center border w-41 h-41 rounded-full cursor-pointer'>
                  {img ? (
                    <img
                      src={`https://chatbot-back-production-d852.up.railway.app/uploads/img/${img}`}
                      alt='Imagem-Perfil'
                      className='rounded-full w-full'
                      onClick={handleImageClick}
                    />
                  ) : viewImg ? (
                    <img
                      src={viewImg}
                      alt='Imagem-Perfil'
                      className='rounded-full w-full'
                      onClick={handleImageClick}
                    />
                  ) : (
                    <UserIcon
                      className='w-full rounded-full stroke-1 stroke-zinc-900'
                      onClick={handleImageClick}
                    />
                  )}

                  <input
                    type='file'
                    name='img'
                    accept='image/*'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className='hidden'
                  />
                </div>
                <Field
                  as='textarea'
                  name='bio'
                  placeholder='Bio'
                  className='border m-auto rounded p-2 w-3/4 focus:outline-orange-600 max-sm:w-full max-md:full'
                />
              </div>
              <hr className='my-5 m-auto w-1/3 border-zinc-700' />
              <div className=''>
                {infoData.map((info, index) => {
                  return (
                    <div
                      key={index}
                      className='flex m-auto flex-col w-3/4 max-sm:w-full'
                    >
                      <label className=''>{info.label}</label>
                      <Field
                        type={info.type}
                        name={info.name}
                        placeholder={info.placeholder}
                        className='border rounded p-1 mb-5 focus:outline-orange-600'
                        required={index === 0 || index === 1}
                      />
                    </div>
                  )
                })}
              </div>
              <button
                type='submit'
                className='p-3 m-auto w-1/3 rounded cursor-pointer bg-orange-600 text-white font-semibold tracking-wide  transition-all hover:bg-orange-500 hover:scale-105 max-md:w-2/3'
              >
                Atualizar Perfil
              </button>
            </Form>
          </div>
        </Formik>
      ) : (
        null
      )}
    </>
  )
}
