import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../Components/Login'
import Candidatos from '../Pages/PaginaAdmin/CandidatosInscritos/Candidatos'
import ProtectRoute from '../Routes/ProtectRoute'
import Vagas from '../Pages/PaginaAdmin/Vagas'
import HomeCandidato from '../Pages/PaginaCandidato/HomeCandidato'
import CadastroLoginAdm from '../Components/CadastroLoginAdm'
import MyVacancies from '../Pages/PaginaCandidato/MyVacancies'

export default function AppRoute() {

    return (
        <>  
            
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route element={<ProtectRoute />}>
                        <Route path='/cadastro-adm' element={<CadastroLoginAdm />} />
                        <Route path="/candidatos" element={<Candidatos />} />
                        <Route path='/vagas' element={<Vagas />} />
                    </Route>
                    <Route path='/home' element={<HomeCandidato />} />
                    <Route path='/minhas-vagas' element={<MyVacancies />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}