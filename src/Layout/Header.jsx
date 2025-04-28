import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
    ChevronDownIcon,
    Bars3Icon
} from '@heroicons/react/16/solid'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import UserLogout from '../Components/Logout/UserLogout'
export default function Header() {

    // GLUGLUGLUGLULUGLUGLUGGLU

    const [secaoAtiva, setSecaoAtiva] = useState("candidatos");

    return (
        <>

            <nav className="bg-orange-500 shadow-md p-4 flex flex-col sm:flex-row justify-between items-center">
                <h1 className="text-xl text-white font-bold cursor-pointer">Painel RH</h1>
                <div className="w-52 text-right hidden max-sm:flex max-sm:justify-center max-sm:mt-4">
                    <Menu>
                        <MenuButton className="inline-flex items-center gap-2 rounded-md bg-zinc-200 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-orange-200 data-[open]:bg-orange-100 data-[focus]:outline-1 data-[focus]:outline-white">
                            <Bars3Icon className="size-6 fill-black/60" />
                            <ChevronDownIcon className="size-4 fill-black/60" />
                        </MenuButton>

                        <MenuItems
                            transition
                            anchor="bottom end"
                            className="w-52 origin-top-right space-y-1 rounded-xl border border-white/5 bg-black/20 p-1 text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            <MenuItem>

                                <Link to={"/candidatos"}>
                                    <button className={`group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-white font-semibold data-[focus]:bg-orange-400/50 ${secaoAtiva === "candidatos" ? "bg-orange-400" : "bg-orange-500"}`} onClick={() => setSecaoAtiva("candidatos")}>
                                        Candidatos
                                    </button>
                                </Link>

                            </MenuItem>

                            <MenuItem>
                                <Link to={"/vagas"}>
                                    <button className={`group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-white font-semibold data-[focus]:bg-orange-400/50 ${secaoAtiva === "vagas" ? "bg-orange-400 " : "bg-orange-500"}`} onClick={() => setSecaoAtiva("vagas")}>
                                        Vagas
                                    </button>
                                </Link>

                            </MenuItem>

                            <MenuItem>
                                <UserLogout />
                            </MenuItem>

                        </MenuItems>
                    </Menu>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 text-white font-semibold max-sm:hidden">
                    <Link to={"/cadastro-adm"}>
                        <button className='group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/50 hover:bg-orange-400 cursor-pointer'>
                            Cadastro Admin
                        </button>
                    </Link>

                    <Link to={"/candidatos"}>
                        <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/50 hover:bg-orange-400 cursor-pointer">
                            Candidatos
                        </button>
                    </Link>

                    <Link to={"/vagas"}>
                        <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/50 hover:bg-orange-400 cursor-pointer">
                            Vagas
                        </button>
                    </Link>
                    <UserLogout />
                </div>
            </nav>

        </>
    )
}
