import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../Components/Login'
import Candidatos from '../Pages/Candidatos'
import ProtectRoute from '../Routes/ProtectRoute'
import Vagas from '../Pages/Vagas'
import ChatBot from '../Components/AreaUsuario/Chatbot'
import VagaCandidato from '../Pages/PaginaCandidato/VagaCandidato'
export default function AppRoute() {

    return (
        <>  
            
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route element={<ProtectRoute />}>
                        <Route path="/candidatos" element={<Candidatos />} />
                        <Route path='/vagas' element={<Vagas />}></Route>
                    </Route>
                    <Route path='/local-candidato' element={<VagaCandidato /> } />
                    <Route path='/chatbot' element={<ChatBot />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}