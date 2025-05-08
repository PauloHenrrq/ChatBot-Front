import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import * as yup from 'yup' // Importando Yup
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { api } from '../../Routes/server/api'

const loginValidationSchema = yup.object({
  email: yup
    .string()
    .email('Por favor, insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('A senha é obrigatória')
})

const cadastroValidationSchema = yup.object({
  nome: yup.string().required('O nome é obrigatório'),
  email: yup
    .string()
    .email('Por favor, insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  data_nascimento: yup.string().required('A data de nascimento é obrigatória'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('A senha é obrigatória')
})

export default function LoginAdmin () {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  async function handleLogin (values) {
    try {
      const response = await api.post('/login', {
        email: values.email,
        password: values.password
      })

      const { token, role } = response.data.message
      localStorage.setItem('authToken', token)

      if (role === 'admin') {
        navigate('/vagas')
      } else {
        navigate('/home')
      }
    } catch (error) {
      console.error('Erro ao verificar as credenciais', error)
      alert('Erro ao tentar fazer login. Tente novamente.')
    }
  }

  async function handleCadastro (values, { setSubmitting }) {
    try {
      await api.post('/users', {
        name: values.nome,
        email: values.email,
        data_nascimento: values.data_nascimento,
        password: values.password
      })
      alert('Cadastro realizado com sucesso!')
      setIsLogin(true)
    } catch (error) {
      alert('Erro ao tentar cadastrar. Tente novamente.')
    }
    setSubmitting(false)
  }

  const loginMap = {
    button: [
      {
        className: `px-4 py-2 cursor-pointer rounded-full transition-colors text-white ${
          isLogin ? 'bg-orange-500' : 'bg-orange-600'
        }`,
        onClick: () => setIsLogin(true),
        text: 'Entrar'
      },
      {
        className: `px-4 py-2 cursor-pointer rounded-full transition-colors text-white ${
          !isLogin ? 'bg-orange-500' : 'bg-orange-600'
        }`,
        onClick: () => setIsLogin(false),
        text: 'Cadastrar'
      }
    ],
    form: [
      { type: 'text', name: 'nome', placeholder: 'Nome completo' },
      { type: 'email', name: 'email', placeholder: 'E-mail' },
      { type: 'date', name: 'data_nascimento', placeholder: 'Data_nascimento' },
      { type: 'password', name: 'password', placeholder: 'Senha' }
    ]
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-500 to-orange-400'>
      <div className='bg-white rounded-xl shadow-lg flex max-lg:flex-col w-[50%] max-sm:w-[70%] transition-all overflow-hidden'>
        <div className='w-1/2 max-lg:w-full px-8 py-12'>
          <div className='flex justify-center gap-4 mb-6'>
            {loginMap.button.map((button, index) => (
              <button
                key={index}
                className={button.className}
                onClick={button.onClick}
              >
                {button.text}
              </button>
            ))}
          </div>

          {isLogin ? (
            <Formik
              initialValues={{
                nome: '',
                email: '',
                data_nascimento: '',
                password: ''
              }}
              validationSchema={loginValidationSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting }) => (
                <Form>
                  <h2 className='text-3xl font-semibold text-center text-orange-600'>
                    Login
                  </h2>
                  {loginMap.form
                    .filter((_, index) => index !== 0 && index !== 2)
                    .map((form, index) => (
                      <div className='mb-4' key={index}>
                        <Field
                          type={form.type}
                          name={form.name}
                          placeholder={form.placeholder}
                          className='w-full border border-zinc-500 p-2 mt-4 rounded'
                        />
                        <ErrorMessage
                          name={form.name}
                          component='div'
                          className='text-red-500 text-sm'
                        />
                      </div>
                    ))}
                  <button
                    type='submit'
                    className='w-full bg-orange-600 hover:bg-orange-500 text-white py-2 mt-4 rounded cursor-pointer'
                    disabled={isSubmitting}
                  >
                    Entrar
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={{
                nome: '',
                email: '',
                data_nascimento: '',
                password: ''
              }}
              validationSchema={cadastroValidationSchema}
              onSubmit={handleCadastro}
            >
              {({ isSubmitting }) => (
                <Form>
                  <h2 className='text-3xl font-semibold text-center text-orange-600'>
                    Cadastrar
                  </h2>
                  {loginMap.form.map((form, index) => (
                    <div className='mb-4' key={index}>
                      <Field
                        type={form.type}
                        name={form.name}
                        placeholder={form.placeholder}
                        className='w-full border border-zinc-500 p-2 mt-4 rounded'
                      />
                      <ErrorMessage
                        name={form.name}
                        component='div'
                        className='text-red-500 text-sm'
                      />
                    </div>
                  ))}
                  <button
                    type='submit'
                    className='cursor-pointer w-full bg-orange-600 hover:bg-orange-500 text-white py-2 mt-4 rounded'
                    disabled={isSubmitting}
                  >
                    Cadastrar
                  </button>
                </Form>
              )}
            </Formik>
          )}
        </div>

        <div className='w-1/2 max-lg:w-full flex flex-col items-start max-lg:items-center justify-center bg-orange-50 p-8'>
          <p className='text-orange-600 font-medium text-xl max-md:text-[16px] max-md:text-center'>
            Bem-vindo ao nosso sistema!
          </p>
          <p className='text-orange-600 font-medium text-xl max-md:text-[16px] max-md:text-center'>
            Por favor, faça seu login ou cadastro.
          </p>
        </div>
      </div>
    </div>
  )
}
