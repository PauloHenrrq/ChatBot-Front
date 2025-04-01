import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import UserLogout from '../Components/Logout/UserLogout'


export default function HeaderCandidato() {

    return(
        <>
        <nav className="bg-orange-500 shadow-md p-4 flex flex-col sm:flex-row justify-between items-center">
                <h1 className="text-xl text-white font-bold cursor-pointer">Painel RH</h1>
                <div className="w-52 text-right hidden max-sm:flex max-sm:justify-center max-sm:mt-4">
                    <Menu>
                        <MenuItems
                            transition
                            anchor="bottom end"
                            className="w-52 origin-top-right space-y-1 rounded-xl border border-white/5 bg-black/20 p-1 text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            <MenuItem>
                                <UserLogout />
                            </MenuItem>

                        </MenuItems>
                    </Menu>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 text-white font-semibold max-sm:hidden">
                    <UserLogout />
                </div>
            </nav>
        
        </>
    )
}