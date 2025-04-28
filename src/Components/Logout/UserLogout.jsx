import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/16/solid'
import { Button } from '@headlessui/react'
import { useNavigate } from 'react-router-dom';


export function VagaCandidado() {
    const navigate = useNavigate()

    function PgVagaCandidado() {
        navigate('/local-candidato');
    }
    

    return(
        <>
            <button className="inline-flex items-center gap-2 rounded-md bg-orange-400 hover:bg-orange-300 cursor-pointer py-1.5 px-3 text-sm/6 font-semibold text-white shadow-xl focus:outline-none data-[hover]:bg-orange-300 data-[focus]:outline-1 data-[focus]:outline-white" onClick={PgVagaCandidado}>
                Candidato
            </button>
        
        </>
    )
}
export default function UserLogout() {
    
    const navigate = useNavigate();

    function removeLocalStorage() {
        localStorage.removeItem('authToken');
        navigate('/');
    }
    

    return(
        <>
            <Button className="inline-flex items-center gap-2 rounded-md bg-zinc-100 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-xl focus:outline-none data-[hover]:bg-orange-300 data-[focus]:outline-1 data-[focus]:outline-white cursor-pointer" onClick={removeLocalStorage}>
                <ArrowLeftEndOnRectangleIcon className="size-6 fill-black/60" />    
            </Button>
        
        </>
    )
}