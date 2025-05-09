import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../Components/Login'
import Candidatos from '../Pages/PaginaAdmin/CandidatosInscritos/Candidatos'
import ProtectRoute from '../Routes/ProtectRoute.jsx'
import Vagas from '../Pages/PaginaAdmin/Vagas'
import HomeCandidato from '../Pages/PaginaCandidato/HomeCandidato'
import CadastroLoginAdm from '../Components/CadastroLoginAdm'
import CheckRoute from './CheckRoute.jsx'
import Candidaturas from '../Pages/PaginaCandidato/Candidaturas.jsx'
import ProcessoCandidatura from '../Pages/PaginaCandidato/ProcessoCandidatura.jsx'

export default function AppRoute () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<CheckRoute />}>
            <Route path='/' element={<Login />} />
          </Route>
          <Route element={<ProtectRoute />}>
            <Route path='/cadastro-adm' element={<CadastroLoginAdm />} />
            <Route path='/candidatos' element={<Candidatos />} />
            <Route path='/vagas' element={<Vagas />} />

            <Route path='/home' element={<HomeCandidato />} />
            <Route path='/minhas-vagas' element={<Candidaturas />} />
            <Route path='/candidatura/:id' element={<ProcessoCandidatura />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
