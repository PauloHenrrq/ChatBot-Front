import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../Components/Login'
import PainelAdmin from '../Pages/Painel_Admin'
export default function AppRoute() {

    return (
        <>  
            
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/painel_admin" element={<PainelAdmin />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}