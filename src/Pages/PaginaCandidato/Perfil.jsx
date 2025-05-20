import { Field, Form, Formik } from 'formik'
import HeaderCandidato from '../../Layout/HeaderCandidato'
import { UserIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'

export default function Perfil () {
  const [viewImg, setViewImg] = useState(null)
  const fileInputRef = useRef()

  useEffect(() => {
    const getCandidato = async () => {
      try{

      } catch(error) {

      }
    }
  }, [])

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

  return (
    <>
      <HeaderCandidato />
      <Formik
        initialValues={{
          nome: '',
          email: '',
          bio: '',
          img: null,
          linkedin: '',
          github: ''
        }}

        // onSubmit={handleProfile}
      >
        <div className='mx-auto my-5 w-1/2 max-sm:w-11/12 max-md:w-5/6'>
          <Form className='px-10 py-5 flex flex-col flex-wrap bg-white rounded-lg'>
            <div className='flex flex-col gap-5'>
              <div className='flex m-auto justify-center border w-41 h-41 rounded-full cursor-pointer'>
                {viewImg ? (
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

                <Field
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
            <div className='flex m-auto flex-col w-3/4 max-sm:w-full'>
              {infoData.map((info, index) => {
                return (
                  <>
                    <label className=''>{info.label}</label>
                    <Field
                      type={info.type}
                      name={info.name}
                      placeholder={info.placeholder}
                      className='border rounded p-1 mb-5 focus:outline-orange-600'
                      required={index === 0 || index === 1}
                    />
                  </>
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
    </>
  )
}
