
import Header from "../Layout/Header"
import VagasCard from '../Components/Cadastro-Login/VagasCard'
import CadastroVagaModal from '../Components/Cadastro-Login/CadastroVagaModal'

export default function Vagas() {
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <Header />

                <div>
                    <div className="flex items-center justify-center mt-6 mb-4">
                        <h1 className="text-3xl font-bold text-center text-gray-800">Vagas</h1>
                    </div>
                    
                    <p className="text-gray-600 text-center">Veja as vagas cadastradas no nosso sistema.</p>

                    <div className="flex items-center max-md:flex-col justify-center gap-4 mt-6">
                        <CadastroVagaModal />
                        {/* <button className="bg-orange-500/70 hover:bg-orange-500 transition-all cursor-pointer max-md:w-1/3 px-5 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg">Visualizar todas as vagas</button>
                        <button className="bg-orange-500/70 hover:bg-orange-500 transition-all cursor-pointer max-md:w-1/3 px-5 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg">Filtrar vagas</button> */}
                    </div>
                </div>


                <div className="w-[80%] mx-auto mt-6">
                    <ul className="bg-white p-4 rounded-lg shadow">
                        <VagasCard />
                    </ul>
                </div>
            </div>
        </>
    );
}