import {
  CloseButton,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition
} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../Routes/server/api'
import { jwtDecode } from 'jwt-decode'
import FecharModal from '../Components/FecharModal'

function classNames (...classes) {
  return classes.filter(Boolean).join('')
}

export default function HeaderCandidato () {
  const navigate = useNavigate()
  const [candidaturas, setCandidaturas] = useState([])
  const [notificacao, setNotificacao] = useState([])
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState([])
  const [user, setUser] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [modal, setModal] = useState(false)

  const token = localStorage.getItem('authToken')
  const decode = jwtDecode(token)
  const userID = decode.data.id

  const location = useLocation()
  const path = location.pathname

  const navigation = [
    { name: 'Inicio', href: '/home', current: path === '/home' },
    {
      name: 'Minhas Candidaturas',
      href: '/minhas-vagas',
      current: path === '/minhas-vagas'
    }
  ]

  function removeLocalStorage () {
    localStorage.removeItem('authToken')
    navigate('/')
  }

  useEffect(() => {
    const returnCandidaturas = async () => {
      try {
        const response = await api.get(`/candidaturas/candidatos/${userID}`)
        setCandidaturas(response.data.details)
      } catch (error) {
        console.error('Houve um erro ao retornar a vaga', error)
      }
    }

    const notificacoes = async () => {
      try {
        const response = await api.get(`/notificacao/${userID}`)
        if (response.data.details.length === 0) {
          setNotificacao('Sem notificações por aqui 😅')
          return
        }
        setNotificacao(response.data.details)
      } catch (error) {
        console.error('Nenhuma notificação encontrada', error)
      }
    }

    returnCandidaturas()
    notificacoes()
  }, [])

  const deleteNotificacao = async id => {
    try {
      await api.delete(`/notificacao/${id}`)
    } catch (error) {
      console.error('Houve um erro ao excluir a notificação', error)
    }
  }

  useEffect(() => {
    const fetchVagas = async () => {
      const candidaturaReprovada = candidaturas.filter(
        cand => cand.status === 'Reprovado'
      )

      if (candidaturaReprovada.length > 0) {
        try {
          const vagas = await Promise.all(
            candidaturaReprovada.map(async cand => {
              const vagaID = cand.vagaId
              try {
                const response = await api.get(`/vagas/${vagaID}`)
                return response.data.details
              } catch (error) {
                console.error('Erro ao buscar vaga:', error)
                return null
              }
            })
          )

          const vagasValidas = vagas.filter(vaga => vaga !== null)
          setVaga(vagasValidas)
        } catch (error) {
          console.error('Erro ao buscar candidaturas ou vagas:', error)
        }
      } else {
        return
      }
    }

    fetchVagas()
  }, [candidaturas])

  return (
    <>
      <Disclosure as='nav' className='bg-orange-700'>
        <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
          <div className='relative flex h-16 items-center justify-between'>
            <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
              <DisclosureButton className='group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset'>
                <span className='absolute -inset-0.5' />
                <span className='sr-only'>Open main menu</span>
                <Bars3Icon
                  aria-hidden='true'
                  className='block stroke-white size-6 group-data-open:hidden'
                />
                <XMarkIcon
                  aria-hidden='true'
                  className='hidden stroke-white size-6 group-data-open:block'
                />
              </DisclosureButton>
            </div>
            <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
              <div className='flex shrink-0 items-center text-white text-2xl font-semibold'>
                <h1>Painel Vagas</h1>
              </div>
              <div className='hidden sm:ml-6 sm:block'>
                <div className='flex space-x-4 text-white'>
                  {navigation.map(item => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current
                          ? 'bg-orange-600 text-white'
                          : 'text-zinc-100 hover:bg-orange-600 hover:text-white',
                        'g px-3 py-2 text-sm font-medium rounded-lg'
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
              <Menu as='div' className='relative ml-3'>
                {({ open }) => {
                  useEffect(() => {
                    setIsOpen(open)
                  }, [open])

                  return (
                    <>
                      <div>
                        <MenuButton className='relative rounded-full cursor-pointer bg-white p-1 text-gray-400 hover:text-orange-500 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden'>
                          <span className='absolute -inset-1.5' />
                          <BellIcon aria-hidden='true' className='size-6' />
                          {notificacao !== 'Sem notificações por aqui 😅' ? (
                            <div className='absolute bottom-6 right-0 bg-red-400 w-2 h-2 rounded-full' />
                          ) : null}
                        </MenuButton>
                      </div>
                      <Transition
                        as={Fragment}
                        show={open}
                        enter='transition-transform duration-300 ease-out'
                        enterFrom='translate-x-full'
                        enterTo='translate-x-0'
                        leave='transition-transform duration-300 ease-in'
                        leaveFrom='translate-x-0'
                        leaveTo='translate-x-full'
                      >
                        <MenuItems className='fixed z-10 top-0 right-0 bg-gradient-to-b from-orange-700 via-orange-600 to-orange-500 border-l border-white w-60 h-screen'>
                          <MenuItem>
                            <div className='flex justify-end border-b border-white'>
                              <CloseButton className='w-8 h-8 m-3 bg-white rounded-md hover:scale-110 transition-all'>
                                <XMarkIcon className='stroke-black/70 hover:stroke-black cursor-pointer' />
                              </CloseButton>
                            </div>
                          </MenuItem>
                          {Array.isArray(notificacao) ? (
                            notificacao.map(n => (
                              <Transition
                                key={n.id}
                                appear
                                show={isOpen}
                                enter='transition-transform duration-300 ease-out'
                                enterFrom='translate-x-full'
                                enterTo='translate-x-0'
                                leave='transition-transform duration-300 ease-in'
                                leaveFrom='translate-x-0'
                                leaveTo='translate-x-full'
                              >
                                <div className='flex'>
                                  <button
                                    className='flex justify-center items-center absolute right-1.5 mt-3 w-5 h-5 bg-orange-800 rounded-2xl text-white font-bold cursor-pointer'
                                    onClick={() => {
                                      deleteNotificacao(n.id)
                                      setNotificacao(
                                        'Sem notificações por aqui 😅'
                                      )
                                    }}
                                  >
                                    X
                                  </button>
                                  <MenuItem className='m-2 mt-4'>
                                    <div
                                      className='flex flex-col gap-5 bg-white w-55 h-1/5 rounded-3xl p-3 cursor-pointer justify-between'
                                      onClick={() => {
                                        setModal(true)
                                        setNotificacaoSelecionada(n)
                                      }}
                                    >
                                      <p>
                                        Olá {user.name}, infelizmente decidimos
                                        prosseguir...
                                      </p>
                                      <p className='truncate font-semibold'>
                                        Vaga referente:{' '}
                                        <span className='font-normal line-clamp-1'>
                                          {n.vagaEmpresa} - {n.vagaTitulo}
                                        </span>
                                      </p>
                                    </div>
                                  </MenuItem>
                                </div>
                              </Transition>
                            ))
                          ) : (
                            <div className='flex justify-center'>
                              <Transition
                                appear
                                show={isOpen}
                                enter='transition-transform duration-300 ease-out'
                                enterFrom='translate-x-full'
                                enterTo='translate-x-0'
                                leave='transition-transform duration-200 ease-in'
                                leaveFrom='translate-x-0'
                                leaveTo='translate-x-full'
                              >
                                {notificacao ===
                                'Sem notificações por aqui 😅' ? (
                                  <div className='flex justify-center mt-5'>
                                    <p className='text-center text-white font-semibold'>
                                      {notificacao}
                                    </p>
                                  </div>
                                ) : (
                                  <div
                                    className='flex flex-col gap-5 bg-white w-full h-2/8 rounded-3xl p-3 cursor-pointer justify-between'
                                    onClick={() => {
                                      setModal(true)
                                    }}
                                  >
                                    {' '}
                                    <p>
                                      Olá {user.name}, decidimos prosseguir com
                                      outro...
                                    </p>
                                    <p className='truncate font-semibold'>
                                      Vaga referente:{' '}
                                      <span className='font-normal line-clamp-1'>
                                        {notificacao.vagaEmpresa} -{' '}
                                        {notificacao.vagaTitulo}
                                      </span>
                                    </p>{' '}
                                  </div>
                                )}
                              </Transition>
                            </div>
                          )}
                        </MenuItems>
                      </Transition>
                    </>
                  )
                }}
              </Menu>

              {/* Profile dropdown */}
              <Menu as='div' className='relative ml-3'>
                <div>
                  <MenuButton className='relative flex rounded-full cursor-pointer bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden'>
                    <span className='absolute -inset-1.5' />
                    <img
                      alt=''
                      src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                      className='size-8 rounded-full'
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in'
                >
                  <MenuItem>
                    <a
                      href='#'
                      className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden'
                    >
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href='#'
                      className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden'
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={removeLocalStorage}
                      className='block w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden'
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <DisclosurePanel className='sm:hidden'>
          <div className='space-y-1 px-2 pt-2 pb-3'>
            {navigation.map(item => (
              <DisclosureButton
                key={item.name}
                as='a'
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current
                    ? 'bg-orange-600 text-white px-3 py-2 text-sm font-medium rounded-lg'
                    : 'text-white hover:bg-orange-600 hover:text-white',
                  'block rounded-md px-3 py-2 mx-2 text-base font-medium'
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
      {modal && (
        <div className='fixed top-0 z-10 right-0 bg-black/50 w-full h-screen'>
          <div className='flex h-full justify-center items-center'>
            <FecharModal
              nomeModal={modal}
              setNomeModal={setModal}
              className='bg-orange-500 max-w-1/2 max-md:max-w-2/3 text-wrap rounded-2xl p-6'
            >
              <h1
                className='text-center text-white font-bold text-3xl'
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                Olá {user.name}
              </h1>
              <h1
                className='text-center text-white font-bold mb-10 text-xl'
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                Decidimos prosseguir com outro profissional e infelizmente sua
                candidatura acabou sendo reprovada.
              </h1>
              <h2 className='text-center text-zinc-100 font-semibold '>
                Agradecemos muito por sua candidatura em nossa vaga! Continue
                atento para se candidatar em novas vagas, boa sorte.
              </h2>
              <hr className='text-white my-2' />
              <h3 className='text-center text-zinc-200 font-semibold'>
                Vaga:{' '}
                <span className='line-clamp-1'>
                  {notificacaoSelecionada.vagaEmpresa} -{' '}
                  {notificacaoSelecionada.vagaTitulo}
                </span>
              </h3>
            </FecharModal>
          </div>
        </div>
      )}
    </>
  )
}
